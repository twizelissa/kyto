import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Answer } from "@shared/schema";
import QuestionWizard from "@/components/question-wizard";
import ResultsDisplay from "@/components/results-display";
import ModifyAnswers from "@/components/modify-answers";

type AppState = 'welcome' | 'questions' | 'results';

export default function Home() {
  const [currentState, setCurrentState] = useState<AppState>('welcome');
  const [answers, setAnswers] = useState<Answer>({});
  const [showModifyPanel, setShowModifyPanel] = useState(false);

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
    setShowModifyPanel(false);
  };

  const handleModifyAnswers = (modifiedAnswers: Answer) => {
    setAnswers(modifiedAnswers);
    setShowModifyPanel(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <i className="fas fa-id-card text-gov-blue text-2xl"></i>
              <h1 className="text-xl font-bold text-slate-800">マイナンバーカード手続きガイド</h1>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-gov-gray hover:text-gov-blue">
                  <i className="fas fa-question-circle text-xl"></i>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>ヘルプ</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 text-sm text-slate-600">
                  <p>このツールは、マイナンバーカードの手続きに必要な書類を確認するためのものです。</p>
                  <p>5つの質問に答えることで、あなたの状況に応じた必要書類のリストが表示されます。</p>
                  <p><strong>注意：</strong>自治体により必要書類が異なる場合があります。必ず各自治体の窓口で最新の情報をご確認ください。</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {currentState === 'welcome' && (
          <WelcomeScreen onStart={handleStartQuiz} />
        )}

        {currentState === 'questions' && (
          <QuestionWizard onComplete={handleQuestionsComplete} />
        )}

        {currentState === 'results' && (
          <>
            <ResultsDisplay 
              answers={answers}
              onRestart={handleRestart}
              onModify={() => setShowModifyPanel(true)}
            />
            {showModifyPanel && (
              <ModifyAnswers
                currentAnswers={answers}
                onApply={handleModifyAnswers}
                onCancel={() => setShowModifyPanel(false)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="text-center">
      <Card className="rounded-xl shadow-lg p-8 mb-8">
        <CardContent className="space-y-6">
          <div className="mb-6">
            <i className="fas fa-clipboard-check text-gov-blue text-6xl mb-4"></i>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">必要書類を確認しましょう</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              5つの簡単な質問にお答えいただくと、あなたの状況に応じた必要書類のリストを作成します。
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 rounded-lg p-4">
              <i className="fas fa-clock text-gov-green text-2xl mb-2"></i>
              <h3 className="font-semibold text-slate-800">約1分で完了</h3>
              <p className="text-sm text-slate-600">簡単な質問に答えるだけ</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <i className="fas fa-mobile-alt text-gov-blue text-2xl mb-2"></i>
              <h3 className="font-semibold text-slate-800">スマホ対応</h3>
              <p className="text-sm text-slate-600">どこでも手軽にチェック</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <i className="fas fa-print text-gov-orange text-2xl mb-2"></i>
              <h3 className="font-semibold text-slate-800">印刷可能</h3>
              <p className="text-sm text-slate-600">チェックリストを持参</p>
            </div>
          </div>

          <Button 
            onClick={onStart}
            className="bg-gov-blue hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg shadow-lg"
            size="lg"
          >
            質問を始める
          </Button>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
        <i className="fas fa-info-circle mr-2"></i>
        <strong>ご注意：</strong>自治体により必要書類が異なる場合があります。詳細は各自治体の窓口にご確認ください。
      </div>
    </div>
  );
}
