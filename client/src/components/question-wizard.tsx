import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Answer } from "@shared/schema";
import { QUESTIONS } from "@/lib/questions-data";

interface QuestionWizardProps {
  onComplete: (answers: Answer) => void;
  onBack?: () => void;
}

export default function QuestionWizard({ onComplete, onBack }: QuestionWizardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer>({});
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [lostCheckboxes, setLostCheckboxes] = useState({
    callCenter: false,
    policeReport: false
  });

  // Filter questions based on current answers
  const relevantQuestions = QUESTIONS.filter(q => 
    !q.showWhen || q.showWhen(answers)
  );

  const question = relevantQuestions[currentQuestion];
  
  // Calculate progress - ensure it reaches 100% at completion
  const calculateProgress = () => {
    if (currentQuestion === 0) return 0; // First page is always 0%
    
    // If we're at the last question, return 100%
    if (currentQuestion === relevantQuestions.length - 1) {
      return 100;
    }
    
    // Otherwise calculate proportional progress up to 95%
    return Math.min(95, ((currentQuestion + 1) / relevantQuestions.length) * 100);
  };
  
  const progress = calculateProgress();

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    
    // Auto-advance after selection with slight delay for better UX
    setTimeout(() => {
      // Recalculate relevant questions with new answers
      const updatedRelevantQuestions = QUESTIONS.filter(q => 
        !q.showWhen || q.showWhen(newAnswers)
      );
      
      if (currentQuestion < updatedRelevantQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        const nextQuestion = updatedRelevantQuestions[currentQuestion + 1];
        setSelectedOption(newAnswers[nextQuestion?.id] || "");
      } else {
        onComplete(newAnswers);
      }
    }, 300);
  };

  const handleNext = () => {
    if (currentQuestion < relevantQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[relevantQuestions[currentQuestion + 1].id] || "");
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[relevantQuestions[currentQuestion - 1].id] || "");
    }
  };

  const handleLostCheckboxChange = (checkboxType: 'callCenter' | 'policeReport') => {
    setLostCheckboxes(prev => ({
      ...prev,
      [checkboxType]: !prev[checkboxType]
    }));
  };

  const handleLostProceedNext = () => {
    if (lostCheckboxes.callCenter && lostCheckboxes.policeReport) {
      const newAnswers = { ...answers, lost_check_complete: "true" };
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">
            質問 {currentQuestion + 1}
          </span>
          <span className="text-sm text-slate-600">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="kyoto-card rounded-lg shadow-lg p-8 mb-6">
        <CardContent className="space-y-6">
          {question.id === "lost_procedures" ? (
            <>
              <h2 className="text-2xl font-bold text-kyoto-purple-dark mb-6">紛失手続きの確認</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="text-gray-800 leading-relaxed">
                  <p className="mb-4">
                    マイナンバーカードを紛失した時は，マイナンバーカード一時停止のお手続きが必要となりますので，個人番号カードコールセンター（TEL0120－95－0178）へご連絡をお願いします。
                  </p>
                  <p className="mb-4">
                    あわせて，警察に遺失届を出していただき、受理番号を控えてください。その後，京都市マイナンバーカードセンターへ届け出をしていただき，マイナンバーカードの再発行のお手続きをおとりください。（※マイナンバーカードの再発行手続きの際，警察署で発行される受理番号の控えが必要となります。）
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="callCenter"
                    checked={lostCheckboxes.callCenter}
                    onCheckedChange={() => handleLostCheckboxChange('callCenter')}
                  />
                  <label htmlFor="callCenter" className="text-sm font-medium text-gray-800">
                    個人番号カードコールセンターへ連絡した
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="policeReport"
                    checked={lostCheckboxes.policeReport}
                    onCheckedChange={() => handleLostCheckboxChange('policeReport')}
                  />
                  <label htmlFor="policeReport" className="text-sm font-medium text-gray-800">
                    警察に遺失届を出し、受理番号を控えている
                  </label>
                </div>
              </div>
              
              {lostCheckboxes.callCenter && lostCheckboxes.policeReport && (
                <Button 
                  onClick={handleLostProceedNext}
                  className="kyoto-button w-full mt-4"
                >
                  次へ進む
                </Button>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-kyoto-purple-dark mb-6">{question.text}</h2>
              <div className="space-y-4">
                {question.options.map((option) => (
                  <div
                    key={option.v}
                    className={`option-card p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOption === option.v
                        ? "border-kyoto-purple bg-kyoto-purple-light"
                        : "border-gray-200 hover:border-kyoto-purple hover:bg-kyoto-purple-light"
                    }`}
                    onClick={() => handleOptionSelect(option.v)}
                  >
                    <div className="flex items-center space-x-4">
                      <i className={`${option.icon} text-kyoto-purple text-xl`}></i>
                      <span className="font-medium text-slate-800">{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-start space-x-4">
        {currentQuestion === 0 && onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            className="kyoto-button-outline"
          >
            <i className="fas fa-home mr-2"></i>ホームに戻る
          </Button>
        )}
        {currentQuestion > 0 && (
          <Button
            onClick={handlePrev}
            variant="outline"
            className="kyoto-button-outline"
          >
            <i className="fas fa-chevron-left mr-2"></i>前の質問
          </Button>
        )}
      </div>
    </div>
  );
}
