export interface Question {
  id: number;
  text: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
}
export interface Test {
  id: string;
  title: string;
  questions: Question[];
  timerEnabled: boolean;
  timerSeconds: number;
}
