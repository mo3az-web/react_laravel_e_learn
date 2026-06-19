import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

type Quiz = {
  id: number;
  title: string;
  lesson_id: number;
};

type Question = {
  id: number;
  question: string;
  quiz_id: number;
};

export default function AddExamPage() {
  const { lessonId } = useParams();

  // ─── states ─────────────────────────
  const [quizTitle, setQuizTitle] = useState("");
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const [questionText, setQuestionText] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);

  const [choices, setChoices] = useState<
    Record<number, { text: string; is_true: boolean }[]>
  >({});

  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  // ─── CREATE QUIZ ─────────────────────
  const createQuiz = async () => {
    if (!quizTitle || !lessonId) return;

    try {
      setLoading(true);

      const res = await axios.post(
        "http://127.0.0.1:8001/api/admin/addquiz",
        {
          title: quizTitle,
          lesson_id: Number(lessonId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuiz(res.data.quiz);
    } catch (err) {
      console.error(err);
      alert("Error creating quiz");
    } finally {
      setLoading(false);
    }
  };

  // ─── ADD QUESTION ────────────────────
  const addQuestion = async () => {
    if (!quiz || !questionText) return;

    try {
      const res = await axios.post(
        "http://127.0.0.1:8001/api/admin/addquestion",
        {
          quiz_id: quiz.id,
          question: questionText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setQuestions((prev) => [...prev, res.data.question]);
      setQuestionText("");
    } catch (err) {
      console.error(err);
      alert("Error adding question");
    }
  };

  // ─── ADD CHOICES ─────────────────────
  const addChoices = async (questionId: number) => {
    const data = choices[questionId] || [];

    try {
      await axios.post(
        "http://127.0.0.1:8001/api/admin/addchoise",
        {
          question_id: questionId,
          choices: data,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Choices saved successfully");
    } catch (err) {
      console.error(err);
      alert("Error saving choices");
    }
  };

  // ─── UI ─────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Create Exam (Lesson #{lessonId})
        </h1>

        {/* ─── CREATE QUIZ ─── */}
        {!quiz && (
          <div className="p-4 bg-white dark:bg-gray-900 border rounded-xl space-y-3">
            <input
              placeholder="Quiz title"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-950"
            />

            <button
              onClick={createQuiz}
              disabled={loading}
              className="bg-emerald-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Creating..." : "Create Quiz"}
            </button>
          </div>
        )}

        {/* ─── ADD QUESTIONS ─── */}
        {quiz && (
          <div className="space-y-4">

            <div className="p-4 bg-white dark:bg-gray-900 border rounded-xl space-y-3">
              <input
                placeholder="New question"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-950"
              />

              <button
                onClick={addQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Question
              </button>
            </div>

            {/* ─── QUESTIONS ─── */}
            {questions.map((q) => (
              <div
                key={q.id}
                className="p-4 bg-white dark:bg-gray-900 border rounded-xl space-y-3"
              >
                <p className="font-medium">{q.question}</p>

                {/* choices */}
                <div className="space-y-2">
                  {(choices[q.id] || []).map((c, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        placeholder="Choice"
                        value={c.text}
                        onChange={(e) => {
                          const updated = [...(choices[q.id] || [])];
                          updated[i].text = e.target.value;

                          setChoices({
                            ...choices,
                            [q.id]: updated,
                          });
                        }}
                        className="flex-1 p-2 border rounded dark:bg-gray-950"
                      />

                      <label className="text-xs flex items-center gap-1">
                        <input
                          type="checkbox"
                          checked={c.is_true}
                          onChange={(e) => {
                            const updated = [...(choices[q.id] || [])];
                            updated[i].is_true = e.target.checked;

                            setChoices({
                              ...choices,
                              [q.id]: updated,
                            });
                          }}
                        />
                        correct
                      </label>
                    </div>
                  ))}
                </div>

                {/* actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const prev = choices[q.id] || [];
                      setChoices({
                        ...choices,
                        [q.id]: [...prev, { text: "", is_true: false }],
                      });
                    }}
                    className="text-sm text-gray-500"
                  >
                    + Add Choice
                  </button>

                  <button
                    onClick={() => addChoices(q.id)}
                    className="bg-emerald-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Save Choices
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}