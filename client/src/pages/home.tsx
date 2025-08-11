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
    <div className="container mx-auto px-2 sm:px-4 py-8 max-w-4xl">


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
    <div className="text-center">
      <Card className="kyoto-card rounded-lg shadow-lg p-4 sm:p-8 mb-8">
        <CardContent className="space-y-6">
          <div className="mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black mb-4 px-2">手続きの方法を確認しましょう</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed mb-4 px-2">
              質問にお答えいただくと、あなたに必要な情報をご案内いたします。
            </p>
            <div className="hidden md:flex flex-wrap justify-center gap-6 text-base text-black font-medium">
              <span className="flex items-center"><span className="text-2xl mr-2 text-black">✓</span> 持ち物</span>
              <span className="flex items-center"><span className="text-2xl mr-2 text-black">✓</span> 場所</span>
              <span className="flex items-center"><span className="text-2xl mr-2 text-black">✓</span> 申請方法</span>
              <span className="flex items-center"><span className="text-2xl mr-2 text-black">✓</span> 予約方法</span>
            </div>
            <div className="md:hidden flex flex-col items-center gap-3 text-base text-black font-medium">
              <span className="flex items-center"><span className="text-2xl mr-2 text-black">✓</span> 持ち物</span>
              <span className="flex items-center"><span className="text-2xl mr-2 text-black">✓</span> 場所</span>
              <span className="flex items-center"><span className="text-2xl mr-2 text-black">✓</span> 申請方法</span>
              <span className="flex items-center"><span className="text-2xl mr-2 text-black">✓</span> 予約方法</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-kyoto-purple-light rounded-lg p-6 border border-purple-100">
              <i className="fas fa-clock text-kyoto-purple text-3xl mb-3"></i>
              <h3 className="font-semibold text-kyoto-purple-dark text-lg mb-2">約1分で完了します。</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• 質問は簡単です。</p>
                <p>• チェックリストが自動作成されます。</p>
                <p>• 必要な項目を整理できます。</p>
              </div>
            </div>
            <div className="bg-kyoto-purple-light rounded-lg p-6 border border-purple-100">
              <i className="fas fa-share text-kyoto-purple text-3xl mb-3"></i>
              <h3 className="font-semibold text-kyoto-purple-dark text-lg mb-2">簡単に印刷・共有可能です。</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• PDFの作成</p>
                <p>• QRコードの生成</p>
                <p>• LINE/SMSで共有</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={onStart}
            className="kyoto-button px-8 py-4 rounded-lg text-lg shadow-lg font-semibold"
            size="lg"
          >
            始める
          </Button>
        </CardContent>
      </Card>


    </div>
  );
}
