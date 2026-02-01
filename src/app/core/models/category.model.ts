import { Question } from './question.model';

export interface Category {
  id: string;
  name: string;
  isPremium: boolean;
  questions: Question[];
}
