import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Answer } from "@shared/schema";
import QuestionWizard from "@/components/question-wizard";
import ResultsDisplay from "@/components/results-display";


type AppState = 'welcome' | 'questions' | 'results';

export default function Home({ onHomeClick }: { onHomeClick?: () => void }) {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [answers, setAnswers] = useState<Answer>({});

  const handleStartQuiz = () => {
    setCurrentState('questions');
    setAnswers({});
  };

  const handleQuestionsComplete = (finalAnswers: Answer) => {
    setAnswers(finalAnswers);
    setCurrentState('results');
  };

  const handleRestart = () => {
    setCurrentState('welcome');
    setAnswers({});
  };

  const handleHomeClickInternal = () => {
    setCurrentState('welcome');
    setAnswers({});
    if (onHomeClick) {
      onHomeClick();
    }
  };

  // Handle header click to always return to welcome state
  const handleHeaderClick = () => {
    handleHomeClickInternal();
  };

  return (
    <div className={`container mx-auto px-1 sm:px-4 max-w-none sm:max-w-4xl ${currentState === 'welcome' ? 'min-h-screen flex items-center justify-center py-4' : 'py-8'}`}>


        {currentState === 'welcome' && (
          <WelcomeScreen onStart={handleStartQuiz} />
        )}

        {currentState === 'questions' && (
          <QuestionWizard 
            onComplete={handleQuestionsComplete} 
            onBack={handleHomeClickInternal}
            initialAnswers={answers}
          />
        )}

        {currentState === 'results' && (
          <ResultsDisplay 
            answers={answers}
            onRestart={handleRestart}
            onBack={() => setCurrentState('questions')}
          />
        )}
    </div>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center max-h-screen overflow-hidden">
      <div className="space-y-4 mb-6">
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black mb-3 px-2">手続きの方法を確認しましょう</h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-3 px-2">
            質問にお答えいただくと、あなたに必要な情報をご案内いたします。
          </p>
          <div className="hidden md:flex flex-wrap justify-center gap-4 text-sm text-black font-medium">
            <span className="flex items-center"><span className="text-lg mr-1 text-black">✓</span> 持ち物</span>
            <span className="flex items-center"><span className="text-lg mr-1 text-black">✓</span> 場所</span>
            <span className="flex items-center"><span className="text-lg mr-1 text-black">✓</span> 申請方法</span>
            <span className="flex items-center"><span className="text-lg mr-1 text-black">✓</span> 予約方法</span>
          </div>
          <div className="md:hidden flex flex-col items-center gap-2 text-sm text-black font-medium">
            <span className="flex items-center"><span className="text-lg mr-1 text-black">✓</span> 持ち物</span>
            <span className="flex items-center"><span className="text-lg mr-1 text-black">✓</span> 場所</span>
            <span className="flex items-center"><span className="text-lg mr-1 text-black">✓</span> 申請方法</span>
            <span className="flex items-center"><span className="text-lg mr-1 text-black">✓</span> 予約方法</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="bg-kyoto-purple-light rounded-lg p-3 border border-purple-100">
            <i className="fas fa-clock text-kyoto-purple text-xl mb-1"></i>
            <h3 className="font-semibold text-kyoto-purple-dark text-sm">約1分で完了</h3>
            <p className="text-xs text-gray-600">簡単な質問に答えるだけ</p>
          </div>
          <div className="bg-kyoto-purple-light rounded-lg p-3 border border-purple-100">
            <i className="fas fa-list-check text-kyoto-purple text-xl mb-1"></i>
            <h3 className="font-semibold text-kyoto-purple-dark text-sm">チェックリストの自動作成</h3>
            <p className="text-xs text-gray-600">必要な項目を整理</p>
          </div>
          <div className="bg-kyoto-purple-light rounded-lg p-3 border border-purple-100">
            <i className="fas fa-share text-kyoto-purple text-xl mb-1"></i>
            <h3 className="font-semibold text-kyoto-purple-dark text-sm">簡単に印刷・共有可能</h3>
            <p className="text-xs text-gray-600">・PDFの作成<br/>・QRコードの生成<br/>・LINE/SMSで共有</p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={onStart}
          className="kyoto-button px-6 py-3 rounded-lg text-base shadow-lg font-semibold"
          size="lg"
        >
          始める
        </Button>
      </div>
    </div>
  );
}
