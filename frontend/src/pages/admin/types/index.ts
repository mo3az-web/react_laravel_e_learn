export type Status = "published" | "draft";
export type View = "dashboard" | "courses" | "students" | "stats";

export interface Lesson {
  id: number;
  title: string;
  url: string;
  desc: string;
  free: boolean;
}

export interface Course {
  id: number;
  title: string;
  desc: string;
  status: Status;
  thumb: string;
  views: number;
  lessons: Lesson[];
}