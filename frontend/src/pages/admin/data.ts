 type Status = "published" | "draft";

interface Lesson {
  id: number;
  title: string;
  url: string;
  desc: string;
  free: boolean;
}

interface Course {
  id: number;
  title: string;
  desc: string;
  status: Status;
  thumb: string;
  views: number;
  lessons: Lesson[];
}
export const INITIAL_COURSES: Course[] = [
  {
    id: 1,
    title: "React Advanced",
    desc: "Deep dive into hooks, context, and advanced patterns",
    status: "published",
    thumb: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
    views: 1240,
    lessons: [
      { id: 1, title: "Introduction to Hooks", url: "https://youtube.com/watch?v=demo1", desc: "Overview of useState and useEffect", free: true },
      { id: 2, title: "Custom Hooks Deep Dive", url: "https://youtube.com/watch?v=demo2", desc: "Building reusable custom hooks", free: false },
      { id: 3, title: "Context API", url: "https://youtube.com/watch?v=demo3", desc: "Managing global state with context", free: false },
    ],
  },
  {
    id: 2,
    title: "UI/UX Design",
    desc: "Figma, design systems, and user research fundamentals",
    status: "published",
    thumb: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    views: 860,
    lessons: [
      { id: 1, title: "Design Principles", url: "https://youtube.com/watch?v=demo4", desc: "Color, typography, layout basics", free: true },
      { id: 2, title: "Figma Basics", url: "https://youtube.com/watch?v=demo5", desc: "Getting started with Figma", free: false },
    ],
  },
  {
    id: 3,
    title: "Python ML",
    desc: "Machine learning with scikit-learn and pandas",
    status: "draft",
    thumb: "",
    views: 420,
    lessons: [
      { id: 1, title: "NumPy Fundamentals", url: "https://youtube.com/watch?v=demo6", desc: "Arrays and matrix operations", free: true },
    ],
  },
];