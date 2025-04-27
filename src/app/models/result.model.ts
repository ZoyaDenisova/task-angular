export interface Answer {
  questionId: number;
  selectedOptionIndex: number;
  isCorrect: boolean;
  pointsAwarded: number;
}
export interface Result {
  id: string;
  testId: string;
  testTitle: string;
  userId: string;
  userName: string;
  score: number;
  date: string;
  answers: Answer[];
}
