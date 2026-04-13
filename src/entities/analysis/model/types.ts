import { z } from "zod";
import { ErrorTypeEnum } from "../lib/schemas";

export type ErrorType = z.infer<typeof ErrorTypeEnum>;

export interface ExtractedQuestion {
  questionNumber: number;
  questionText: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  subject: string;
  topic: string;
}

export interface TestPaperExtraction {
  testTitle: string;
  totalQuestions: number;
  questions: ExtractedQuestion[];
  overallSubject: string;
}

export interface ErrorClassification {
  questionNumber: number;
  errorType: ErrorType;
  errorExplanation: string;
  conceptsInvolved: string[];
  prerequisiteConcepts: string[];
  remedyHint: string;
  severityScore: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  extraction: TestPaperExtraction;
  classifications: ErrorClassification[];
  summary: {
    totalCorrect: number;
    totalWrong: number;
    accuracy: number;
    dominantErrorType: ErrorType;
    weakTopics: string[];
    strongTopics: string[];
  };
}
