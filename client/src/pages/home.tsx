import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Answer } from "@shared/schema";
import QuestionWizard from "@/components/question-wizard";
import ResultsDisplay from "@/components/results-display";


type AppState = 'welcome' | 'questions' | 'results';

export default function Home() {
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">


        {currentState === 'welcome' && (
          <WelcomeScreen onStart={handleStartQuiz} />
        )}

        {currentState === 'questions' && (
          <QuestionWizard 
            onComplete={handleQuestionsComplete} 
            onBack={() => setCurrentState('welcome')}
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
      <Card className="kyoto-card rounded-lg shadow-lg p-8 mb-8">
        <CardContent className="space-y-6">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-kyoto-purple-dark mb-4">申請方法を確認しましょう</h2>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              簡単な質問にお答えいただくと、あなたの状況に応じた申請方法をご案内します。
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-kyoto-purple-light rounded-lg p-4 border border-purple-100">
              <i className="fas fa-clock text-kyoto-purple text-2xl mb-2"></i>
              <h3 className="font-semibold text-kyoto-purple-dark">約1分で完了</h3>
              <p className="text-sm text-gray-600">簡単な質問に答えるだけ</p>
            </div>
            <div className="bg-kyoto-purple-light rounded-lg p-4 border border-purple-100">
              <i className="fas fa-mobile-alt text-kyoto-purple text-2xl mb-2"></i>
              <h3 className="font-semibold text-kyoto-purple-dark">スマホ対応</h3>
              <p className="text-sm text-gray-600">どこでも手軽にチェック</p>
            </div>
            <div className="bg-kyoto-purple-light rounded-lg p-4 border border-purple-100">
              <i className="fas fa-info-circle text-kyoto-purple text-2xl mb-2"></i>
              <h3 className="font-semibold text-kyoto-purple-dark">詳細案内</h3>
              <p className="text-sm text-gray-600">申請方法を詳しく説明</p>
            </div>
          </div>

          <Button 
            onClick={onStart}
            className="kyoto-button px-8 py-4 rounded-lg text-lg shadow-lg font-semibold"
            size="lg"
          >
            質問を始める
          </Button>
        </CardContent>
      </Card>


    </div>
  );
}
