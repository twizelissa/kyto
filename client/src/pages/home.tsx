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
      <Card className="kyoto-card rounded-lg shadow-lg p-8 mb-8">
        <CardContent className="space-y-6">
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-kyoto-purple-dark mb-6">マイナンバーカード申請ガイド</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8">
              あなたに最適な申請方法と必要書類を自動判定。<br />
              <span className="text-kyoto-purple font-semibold">チェックリスト付きPDFで手続きがスムーズに。</span>
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-lg mb-4">
                <i className="fas fa-clock text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">約1分で完了</h3>
              <p className="text-sm text-gray-600">簡単な質問に答えるだけで最適な申請方法を案内</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-lg mb-4">
                <i className="fas fa-file-pdf text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">PDF自動生成</h3>
              <p className="text-sm text-gray-600">必要書類・持ち物・予約方法をチェックリスト付きPDFで出力</p>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-500 rounded-lg mb-4">
                <i className="fas fa-share-alt text-white text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">簡単共有</h3>
              <p className="text-sm text-gray-600">QRコード付きで家族や友人との共有も簡単</p>
            </div>
          </div>

          <Button 
            onClick={onStart}
            className="kyoto-button px-10 py-5 rounded-xl text-xl shadow-xl font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            size="lg"
          >
            <i className="fas fa-play mr-3"></i>
            質問を始める
          </Button>
        </CardContent>
      </Card>


    </div>
  );
}
