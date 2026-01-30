export enum LearningStyle {
  ANALOGY = 'Analogy-based',
  FIRST_PRINCIPLES = 'First Principles',
  ELI5 = 'Explain Like I\'m 5',
  VISUAL_DESC = 'Visual Description'
}

export interface PracticeProblem {
  question: string;
  options: string[]; // 4 options
  correctOptionIndex: number; // 0-3
  hint: string;
  explanation: string; // Explains why the answer is correct
}

export interface AnalysisResponse {
  detectedMisconceptions: string[];
  missingPrerequisites: string[];
  simplifiedExplanation: string;
  invisibleConfusion: string; // The core hidden blocker
  nextSteps: string[];
  clarityScore: number; // 0-100
  studyNotes: string; // Markdown
  youtubeSearchQueries: string[];
  practiceProblems: PracticeProblem[];
}

export interface AnalysisRequest {
  topic: string;
  userUnderstanding: string;
  learningStyle: LearningStyle;
}