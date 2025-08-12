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
  initialAnswers?: Answer;
}

export default function QuestionWizard({ onComplete, onBack, initialAnswers = {} }: QuestionWizardProps) {
  // Initialize with existing answers and find the appropriate starting question
  const initializeQuestionPosition = () => {
    const relevantQuestions = QUESTIONS.filter(q => 
      !q.showWhen || q.showWhen(initialAnswers)
    );
    
    // Find the last answered question
    let lastAnsweredIndex = -1;
    for (let i = relevantQuestions.length - 1; i >= 0; i--) {
      if (initialAnswers[relevantQuestions[i].id]) {
        lastAnsweredIndex = i;
        break;
      }
    }
    
    // Start from the last answered question (or 0 if none answered)
    return Math.max(0, lastAnsweredIndex);
  };

  const [currentQuestion, setCurrentQuestion] = useState(initializeQuestionPosition());
  const [answers, setAnswers] = useState<Answer>(initialAnswers);
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    const relevantQuestions = QUESTIONS.filter(q => 
      !q.showWhen || q.showWhen(initialAnswers)
    );
    const currentQ = relevantQuestions[initializeQuestionPosition()];
    return initialAnswers[currentQ?.id] || "";
  });
  const [lostCheckboxes, setLostCheckboxes] = useState({
    callCenter: false,
    policeReport: false,
    centerReport: false
  });
  
  const [returnDocuments, setReturnDocuments] = useState<string[]>(() => {
    // Initialize from existing answers if available
    const existing = initialAnswers.return_documents;
    return existing ? existing.split(',') : [];
  });
  
  const [inquiryResponseConfirmed, setInquiryResponseConfirmed] = useState(false);

  // Filter questions based on current answers
  const relevantQuestions = QUESTIONS.filter(q => 
    !q.showWhen || q.showWhen(answers)
  );

  const question = relevantQuestions[currentQuestion];
  
  // Calculate maximum possible questions for current flow
  // Calculate the total number of questions for the current flow
  const calculateTotalQuestionsForCurrentFlow = (currentAnswers: Answer) => {
    // Find questions that would appear with current answers
    return QUESTIONS.filter(q => !q.showWhen || q.showWhen(currentAnswers)).length;
  };

  // Calculate progress based on answered questions
  const calculateProgress = () => {
    const totalQuestions = calculateTotalQuestionsForCurrentFlow(answers);
    const answeredQuestions = Object.keys(answers).length;
    
    // If no questions in flow, show 0%
    if (totalQuestions === 0) return 0;
    
    // If no answers yet, show 0%
    if (answeredQuestions === 0) return 0;
    
    // Progress is based on answered questions
    // For example: 1 answer of 3 total = 1/3 = 33%
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    
    // Cap at 95% during question phase
    return Math.min(95, progressPercentage);
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
        setSelectedOption(nextQuestion?.id ? newAnswers[nextQuestion.id] || "" : "");
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

  const handleLostCheckboxChange = (checkboxType: 'callCenter' | 'policeReport' | 'centerReport') => {
    setLostCheckboxes(prev => ({
      ...prev,
      [checkboxType]: !prev[checkboxType]
    }));
  };

  const handleLostProceedNext = () => {
    if (lostCheckboxes.callCenter && lostCheckboxes.policeReport && lostCheckboxes.centerReport) {
      const newAnswers = { ...answers, lost_check_complete: "true" };
      setAnswers(newAnswers);
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleReturnDocumentChange = (documentType: string) => {
    setReturnDocuments(prev => {
      const updated = prev.includes(documentType)
        ? prev.filter(doc => doc !== documentType)
        : [...prev, documentType];
      
      // Update answers immediately
      const newAnswers = { ...answers, return_documents: updated.join(',') };
      setAnswers(newAnswers);
      
      return updated;
    });
  };

  const handleReturnDocumentNext = () => {
    // 値が設定されていない場合でも空文字で設定
    const newAnswers = { ...answers };
    if (!("return_documents" in newAnswers)) {
      newAnswers.return_documents = returnDocuments.join(',');
    }
    setAnswers(newAnswers);
    
    // Auto-advance after slight delay for better UX
    setTimeout(() => {
      const updatedRelevantQuestions = QUESTIONS.filter(q => 
        !q.showWhen || q.showWhen(newAnswers)
      );
      
      if (currentQuestion < updatedRelevantQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        const nextQuestion = updatedRelevantQuestions[currentQuestion + 1];
        setSelectedOption(nextQuestion?.id ? newAnswers[nextQuestion.id] || "" : "");
      } else {
        onComplete(newAnswers);
      }
    }, 300);
  };

  const handleInquiryResponseNext = () => {
    if (inquiryResponseConfirmed) {
      const newAnswers = { ...answers, inquiry_response_confirmed: "true" };
      setAnswers(newAnswers);
      
      setTimeout(() => {
        const updatedRelevantQuestions = QUESTIONS.filter(q => 
          !q.showWhen || q.showWhen(newAnswers)
        );
        
        if (currentQuestion < updatedRelevantQuestions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          const nextQuestion = updatedRelevantQuestions[currentQuestion + 1];
          setSelectedOption(nextQuestion?.id ? newAnswers[nextQuestion.id] || "" : "");
        } else {
          onComplete(newAnswers);
        }
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedOption("");
    setLostCheckboxes({
      callCenter: false,
      policeReport: false,
      centerReport: false
    });
    setReturnDocuments([]);
    setInquiryResponseConfirmed(false);
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
      <Card className="kyoto-card rounded-lg shadow-lg p-2 sm:p-6 mb-6 w-full">
        <CardContent className="space-y-6">
          {question.id === "lost_procedures" ? (
            <>
              <h2 className="text-2xl font-bold text-black mb-6">紛失手続きについてご確認</h2>
              <div className="bg-kyoto-purple-light border border-purple-200 rounded-lg p-4 sm:p-6 mb-6">
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
                
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="centerReport"
                    checked={lostCheckboxes.centerReport}
                    onCheckedChange={() => handleLostCheckboxChange('centerReport')}
                  />
                  <label htmlFor="centerReport" className="text-sm font-medium text-gray-800">
                    京都市マイナンバーカードセンターへ届け出た
                  </label>
                </div>
              </div>
              
              {lostCheckboxes.callCenter && lostCheckboxes.policeReport && lostCheckboxes.centerReport && (
                <Button 
                  onClick={handleLostProceedNext}
                  className="kyoto-button w-full mt-4 text-center justify-center"
                >
                  次へ進む
                </Button>
              )}
            </>
          ) : question.id === "return_documents" ? (
            <>
              <h2 className="text-2xl font-bold text-black mb-6">
                {question.text.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </h2>
              <div className="space-y-4">
                {question.options.map((option) => (
                  <div
                    key={option.v}
                    className="flex items-center space-x-4 p-3 sm:p-4 border rounded-lg"
                  >
                    <Checkbox 
                      id={option.v}
                      checked={returnDocuments.includes(option.v)}
                      onCheckedChange={() => handleReturnDocumentChange(option.v)}
                    />
                    <i className={`${option.icon} text-kyoto-purple text-xl`}></i>
                    <label htmlFor={option.v} className="font-medium text-black cursor-pointer flex-1">
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={handleReturnDocumentNext}
                className="kyoto-button w-full mt-6 text-center justify-center"
              >
                次へ進む
              </Button>
            </>
          ) : question.id === "issuance_inquiry_response_check" ? (
            <>
              <h2 className="text-2xl font-bold text-black mb-6">照会書兼回答書について</h2>
              <div className="bg-kyoto-purple-light border border-purple-200 rounded-lg p-4 sm:p-6 mb-6">
                <div className="text-gray-800 leading-relaxed">
                  {question.text.split('\n').map((line, index) => (
                    <p key={index} className={index === 0 ? "mb-4" : index < 4 ? "mb-2" : "mb-4"}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                {question.options.map((option) => (
                  <div
                    key={option.v}
                    className={`option-card p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOption === option.v
                        ? "border-kyoto-purple bg-kyoto-purple-light"
                        : "border-gray-200 hover:border-kyoto-purple hover:bg-kyoto-purple-light"
                    }`}
                    onClick={() => handleOptionSelect(option.v)}
                  >
                    <div className="flex items-center space-x-3">
                      <i className={`${option.icon} text-kyoto-purple text-xl`}></i>
                      <span className="font-medium text-black">{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {selectedOption && (
                <Button 
                  onClick={handleNext}
                  className="kyoto-button w-full mt-6 text-center justify-center"
                >
                  次へ進む
                </Button>
              )}
            </>
          ) : question.id === "inquiry_response_check" ? (
            <>
              <h2 className="text-2xl font-bold text-black mb-6">照会書兼回答書について</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <div className="text-red-800 leading-relaxed">
                  <p className="mb-4">
                    交付通知書の提出がない場合は、マイナンバーカードのお受取ができません。
                  </p>
                  <p className="mb-4">
                    紛失等でお手元にない場合は、代わりとなる「照会書兼回答書」の送付を京都市マイナンバーカードセンターに依頼ください。申請者ご本人の住民票上の住所地に転送不要扱いの郵便物として送付します。
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Checkbox 
                    id="inquiryResponse"
                    checked={inquiryResponseConfirmed}
                    onCheckedChange={(checked) => setInquiryResponseConfirmed(checked as boolean)}
                  />
                  <label htmlFor="inquiryResponse" className="text-sm font-medium text-gray-800">
                    照会書兼回答書を持っている
                  </label>
                </div>
              </div>
              
              {inquiryResponseConfirmed && (
                <Button 
                  onClick={handleInquiryResponseNext}
                  className="kyoto-button w-full mt-4 text-center justify-center"
                >
                  次へ進む
                </Button>
              )}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-black mb-6">{question.text}</h2>
              
              <div className="space-y-4">
                {question.options.map((option) => (
                  <div
                    key={option.v}
                    className={`option-card p-2 sm:p-3 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedOption === option.v
                        ? "border-kyoto-purple bg-kyoto-purple-light"
                        : "border-gray-200 hover:border-kyoto-purple hover:bg-kyoto-purple-light"
                    }`}
                    onClick={() => handleOptionSelect(option.v)}
                  >
                    <div className="flex items-center space-x-3">
                      <i className={`${option.icon} text-kyoto-purple text-xl`}></i>
                      <span className="font-medium text-black">{option.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Show proxy information for card issuance visitor type question */}
              {question.id === "visitor_type" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mt-6">
                  <h3 className="font-semibold text-blue-900 mb-3">代理人による受取について</h3>
                  <div className="text-sm text-blue-800 leading-relaxed">
                    <p className="mb-3">代理人が受取を行うことができるのは、次のような場合などに限られます。</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>75歳以上の方や要介護・要支援認定、障害をお持ちで来庁が困難である方</li>
                      <li>長期の入院や施設に入所しており、来所が困難である方（長期の入院とは、概ね90日以上の入院が見込まれる場合を示しています。）</li>
                      <li>成年被後見人又は、被保佐人、被補助人、任意被後見人の方</li>
                      <li>申請者が15歳未満の方や15歳以上の中学生、高校生、高専生、海外留学されている方</li>
                      <li>妊婦の方</li>
                      <li>社会的参加（義務教育を含む就学、非常勤職を含む就労、家庭外での交遊など）を回避し長期にわたって概ね家庭にとどまり続けている状態である方</li>
                    </ul>
                    <p className="mt-3 font-medium">（注意）仕事の多忙等といった場合は、やむを得ない理由に該当しません。</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="relative">
        <div className="flex justify-start">
          {currentQuestion === 0 && onBack && (
            <Button
              onClick={onBack}
              className="kyoto-button px-4 py-2 rounded-lg font-semibold text-center justify-center"
            >
              <i className="fas fa-home mr-2"></i>ホームに戻る
            </Button>
          )}
          {currentQuestion > 0 && (
            <Button
              onClick={handlePrev}
              className="kyoto-button px-4 py-2 rounded-lg font-semibold text-center justify-center"
            >
              <i className="fas fa-chevron-left mr-2"></i>前の質問
            </Button>
          )}
        </div>
        

      </div>
    </div>
  );
}
