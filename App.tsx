import React, { useState, useEffect } from 'react';
import { Brain, Moon, Sun } from 'lucide-react';
import { InputSection } from './components/InputSection';
import { ResultsView } from './components/ResultsView';
import { analyzeUnderstanding } from './services/geminiService';
import { AnalysisResponse, LearningStyle } from './types';

const App: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [understanding, setUnderstanding] = useState('');
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(LearningStyle.ANALOGY);
  const [results, setResults] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const data = await analyzeUnderstanding({
        topic,
        userUnderstanding: understanding,
        learningStyle
      });
      setResults(data);
    } catch (err) {
      setError("Analysis failed. Please try again. Make sure your input isn't empty.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setTopic('');
    setUnderstanding('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900 dark:selection:text-indigo-100 pb-20 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">LearnSense</h1>
          </div>
          <div className="flex items-center space-x-4">
             <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 hidden sm:block">
              About Invisible Confusion
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 pt-10">
        
        {/* Intro Text - Only show if no results */}
        {!results && (
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
              Reveal What You Don't Know
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
              Standardized learning misses the way <i>you</i> process concepts. 
              Describe what you think you know, and we'll detect the hidden confusion blocking your progress.
            </p>
          </div>
        )}

        {/* Dynamic Content */}
        <div className="transition-all duration-500 ease-in-out">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {!results ? (
            <InputSection
              topic={topic}
              setTopic={setTopic}
              understanding={understanding}
              setUnderstanding={setUnderstanding}
              learningStyle={learningStyle}
              setLearningStyle={setLearningStyle}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          ) : (
            <ResultsView 
              results={results} 
              onReset={handleReset} 
            />
          )}
        </div>
      </main>

    </div>
  );
};

export default App;