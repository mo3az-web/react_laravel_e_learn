import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "react-router-dom";

// ─── types ──────────────────────────────
type Quiz = {
  id: number;
  title: string;
  lesson_id: number;
};

type QuestionResponse = {
  id: number;
  question: string;
  quiz_id: number;
};

type Choice = {
  text: string;
  is_true: boolean;
};

// A question as it exists in the form, before/while it's being saved.
// serverId / choicesSaved track how far this particular question has made
// it through the save process, so a retry after a failed submit only
// resends what's actually missing instead of duplicating everything.
type QuestionDraft = {
  localId: string;
  text: string;
  choices: Choice[];
  serverId: number | null;
  choicesSaved: boolean;
};

const makeEmptyQuestion = (): QuestionDraft => ({
  localId: crypto.randomUUID(),
  text: "",
  choices: [
    { text: "", is_true: false },
    { text: "", is_true: false },
  ],
  serverId: null,
  choicesSaved: false,
});

// ─── axios instance ─────────────────────
const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://127.0.0.1:8001/api/admin";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getErrorMessage(err: unknown, fallback: string) {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    return axiosErr.response?.data?.message || fallback;
  }
  return fallback;
}

export default function AddExamPage() {
  const { lessonId } = useParams();

  const [quizTitle, setQuizTitle] = useState("");
  const [quizId, setQuizId] = useState<number | null>(null);

  const [questions, setQuestions] = useState<QuestionDraft[]>([
    makeEmptyQuestion(),
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const hasToken = Boolean(localStorage.getItem("token"));

  // Clears any leftover status text ("Exam saved ✓" etc.) as soon as the
  // person changes something, so it doesn't sit there looking stale.
  const clearStatus = () => statusMessage && setStatusMessage(null);

  // ─── question helpers ────────────────
  const addQuestionBlock = () => {
    setQuestions((prev) => [...prev, makeEmptyQuestion()]);
    clearStatus();
  };

  const removeQuestionBlock = (localId: string) => {
    setQuestions((prev) => prev.filter((q) => q.localId !== localId));
    clearStatus();
  };

  const updateQuestionText = (localId: string, text: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.localId === localId ? { ...q, text } : q))
    );
    clearStatus();
  };

  const addChoiceField = (localId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.localId === localId
          ? { ...q, choices: [...q.choices, { text: "", is_true: false }] }
          : q
      )
    );
    clearStatus();
  };

  const removeChoiceField = (localId: string, index: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.localId === localId
          ? { ...q, choices: q.choices.filter((_, i) => i !== index) }
          : q
      )
    );
    clearStatus();
  };

  const updateChoice = (
    localId: string,
    index: number,
    patch: Partial<Choice>
  ) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.localId !== localId) return q;
        const choices = [...q.choices];
        choices[index] = { ...choices[index], ...patch };
        return { ...q, choices };
      })
    );
    clearStatus();
  };

  // ─── validation ──────────────────────
  const validate = (): string | null => {
    if (!quizTitle.trim()) return "Give the exam a title.";
    if (questions.length === 0) return "Add at least one question.";

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) return `Question ${i + 1} needs some text.`;
      if (q.choices.length < 2)
        return `Question ${i + 1} needs at least two choices.`;
      if (q.choices.some((c) => !c.text.trim()))
        return `Question ${i + 1} has a choice with no text.`;
      if (!q.choices.some((c) => c.is_true))
        return `Question ${i + 1} needs at least one correct choice.`;
    }
    return null;
  };

  // ─── SUBMIT THE WHOLE EXAM ───────────
  // Creates the quiz (if not already created), then walks through every
  // question saving the question and its choices in order. Anything that
  // was already saved on a previous attempt (quizId / serverId /
  // choicesSaved) is skipped, so pressing Submit again after a failure
  // only resends what's missing instead of creating duplicates.
  const submitExam = async () => {
    const validationError = validate();
    if (validationError) {
      alert(validationError);
      return;
    }
    if (!lessonId) {
      alert("Missing lesson id.");
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    const working = questions.map((q) => ({ ...q }));
    let currentQuizId = quizId;

    try {
      if (!currentQuizId) {
        setStatusMessage("Creating quiz...");
        const res = await api.post<{ quiz: Quiz }>("/addquiz", {
          title: quizTitle.trim(),
          lesson_id: Number(lessonId),
        });
        currentQuizId = res.data.quiz.id;
        setQuizId(currentQuizId);
      }

      for (let i = 0; i < working.length; i++) {
        const q = working[i];

        if (!q.serverId) {
          setStatusMessage(`Saving question ${i + 1} of ${working.length}...`);
          const res = await api.post<{ question: QuestionResponse }>(
            "/addquestion",
            {
              quiz_id: currentQuizId,
              question: q.text.trim(),
            }
          );
          q.serverId = res.data.question.id;
          setQuestions([...working]);
        }

        if (!q.choicesSaved) {
          setStatusMessage(
            `Saving choices for question ${i + 1} of ${working.length}...`
          );
          await api.post("/addchoise", {
            question_id: q.serverId,
            choices: q.choices.map(({ text, is_true }) => ({
              text: text.trim(),
              is_true,
            })),
          });
          q.choicesSaved = true;
          setQuestions([...working]);
        }
      }

      setStatusMessage("Exam saved successfully ✓");
    } catch (err) {
      console.error(err);
      setStatusMessage(null);
      alert(
        getErrorMessage(
          err,
          "Something went wrong while saving the exam. Anything already saved is kept — fix the issue and press Submit again to continue from where it stopped."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ─── guard: no auth token ────────────
  if (!hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-6">
        <p className="text-gray-600 dark:text-gray-300">
          You need to log in again before creating an exam.
        </p>
      </div>
    );
  }

  const allSaved =
    quizId !== null && questions.every((q) => q.serverId && q.choicesSaved);

  // ─── UI ─────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Create Exam (Lesson #{lessonId})
        </h1>

        {/* ─── ONE BIG FORM ─── */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitExam();
          }}
          className="space-y-4"
        >
          {/* exam title */}
          <div className="p-4 bg-white dark:bg-gray-900 border rounded-xl space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Exam title
            </label>
            <input
              placeholder="e.g. Chapter 3 Quiz"
              value={quizTitle}
              disabled={quizId !== null}
              onChange={(e) => {
                setQuizTitle(e.target.value);
                clearStatus();
              }}
              className="w-full p-2 border rounded dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-60"
            />
          </div>

          {/* questions */}
          {questions.map((q, qIndex) => {
            const locked = q.choicesSaved;

            return (
              <div
                key={q.localId}
                className="p-4 bg-white dark:bg-gray-900 border rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Question {qIndex + 1}
                  </label>

                  <div className="flex items-center gap-2">
                    {locked && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        ✓ saved
                      </span>
                    )}
                    {!locked && questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQuestionBlock(q.localId)}
                        className="text-xs text-red-500"
                      >
                        Remove question
                      </button>
                    )}
                  </div>
                </div>

                <input
                  placeholder="Question text"
                  value={q.text}
                  disabled={locked}
                  onChange={(e) => updateQuestionText(q.localId, e.target.value)}
                  className="w-full p-2 border rounded dark:bg-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                />

                {/* choices */}
                <div className="space-y-2 pl-2">
                  {q.choices.map((c, cIndex) => (
                    <div key={cIndex} className="flex gap-2 items-center">
                      <input
                        placeholder={`Choice ${cIndex + 1}`}
                        value={c.text}
                        disabled={locked}
                        onChange={(e) =>
                          updateChoice(q.localId, cIndex, {
                            text: e.target.value,
                          })
                        }
                        className="flex-1 p-2 border rounded dark:bg-gray-950 disabled:opacity-60"
                      />

                      <label className="text-xs flex items-center gap-1 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={c.is_true}
                          disabled={locked}
                          onChange={(e) =>
                            updateChoice(q.localId, cIndex, {
                              is_true: e.target.checked,
                            })
                          }
                        />
                        correct
                      </label>

                      {!locked && q.choices.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeChoiceField(q.localId, cIndex)}
                          className="text-xs text-red-500 px-1"
                          aria-label="Remove choice"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {!locked && (
                  <button
                    type="button"
                    onClick={() => addChoiceField(q.localId)}
                    className="text-sm text-gray-500 pl-2"
                  >
                    + Add Choice
                  </button>
                )}
              </div>
            );
          })}

          <button
            type="button"
            onClick={addQuestionBlock}
            className="w-full py-2 border-2 border-dashed rounded-xl text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors"
          >
            + Add Question
          </button>

          {/* submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting || allSaved}
              className="bg-emerald-600 text-white px-5 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting
                ? "Saving..."
                : allSaved
                ? "Saved"
                : "Submit Exam"}
            </button>

            {statusMessage && (
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {statusMessage}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}