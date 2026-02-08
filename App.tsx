
import React, { useState, useRef, useEffect } from 'react';
import FloatingHearts from './components/FloatingHearts';
import Fireworks from './components/Fireworks';
import { Heart, Gift, ChevronDown, Frown } from 'lucide-react';

type AppPhase = 'game' | 'celebration' | 'gift' | 'reasons' | 'quiz' | 'postQuizCelebration' | 'finalBlackout';

interface Question {
  text: string;
  options: { id: string; label: string }[];
  wrongIds: string[];
}

const App: React.FC = () => {
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);
  const [noButtonPosQuiz, setNoButtonPosQuiz] = useState<{ x: number; y: number } | null>(null);
  const [moveStep, setMoveStep] = useState(0); 
  const [phase, setPhase] = useState<AppPhase>('game');
  const [showFireworks, setShowFireworks] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const quizNoButtonRef = useRef<HTMLButtonElement | null>(null);

  const reasons = [
    "your mesmerising smile",
    "the way ur hand fits perfectly with mine",
    "you are always there for me",
    "the way u understad me",
    "you are amazing at everything",
    "you make us look gorgeous",
    "cute fights that make me wanna bite ur tummy",
    "ur perfect eyes",
    "the warmth you give me",
    "the way u care for me",
    "your amazing mind",
    "because you love me more than anyone",
    "you are really cute when you blush",
    "i see us in the future",
    "because you make me a better person",
    "you are perfect the way u are"
  ];

  const questions: Question[] = [
    {
      text: "Who does Harsha Love the most ?",
      options: [
        { id: 'a', label: 'you' },
        { id: 'b', label: 'only you' },
        { id: 'c', label: 'only you, forever forever' },
        { id: 'd', label: 'someone else, UGH 🤮(Lalit)' }
      ],
      wrongIds: ['d']
    },
    {
      text: "What is Harsha's most important thought ?",
      options: [
        { id: 'a', label: 'you' },
        { id: 'b', label: 'are birds government spies' },
        { id: 'c', label: 'being with you' },
        { id: 'd', label: 'making you happy' }
      ],
      wrongIds: ['b']
    },
    {
      text: "What are you to Harsha ?",
      options: [
        { id: 'a', label: 'cutie pie' },
        { id: 'b', label: 'angry bird' },
        { id: 'c', label: 'love of his life' },
        { id: 'd', label: 'everything' }
      ],
      wrongIds: ['a', 'b']
    },
    {
      text: "16 months and it went by soo fast ?",
      options: [
        { id: 'a', label: 'true' },
        { id: 'b', label: 'false' },
        { id: 'c', label: 'every moment was worth it' }
      ],
      wrongIds: ['b']
    },
    {
      text: "final question. will you be my valentine ?",
      options: [
        { id: 'a', label: 'yes' },
        { id: 'b', label: 'no' },
        { id: 'c', label: 'is this even a question ? absolutely yes' }
      ],
      wrongIds: ['b']
    }
  ];

  const moveNoButton = (isQuiz = false) => {
    const targetRef = isQuiz ? quizNoButtonRef.current : noButtonRef.current;
    if (targetRef) {
      const rect = targetRef.getBoundingClientRect();
      const currentPos = isQuiz ? noButtonPosQuiz : noButtonPos;
      const currentX = currentPos ? currentPos.x : rect.left;
      const currentY = currentPos ? currentPos.y : rect.top;

      const dist = 150;
      let dx = 0;
      let dy = 0;

      const step = moveStep % 4;
      if (step === 0) dx = dist;        
      else if (step === 1) dx = -dist;  
      else if (step === 2) dy = -dist;  
      else if (step === 3) dy = dist;   

      let newX = currentX + dx;
      let newY = currentY + dy;

      const padding = 20;
      const buttonWidth = rect.width;
      const buttonHeight = rect.height;

      if (newX < padding) newX = padding;
      if (newX > window.innerWidth - buttonWidth - padding) newX = window.innerWidth - buttonWidth - padding;
      if (newY < padding) newY = padding;
      if (newY > window.innerHeight - buttonHeight - padding) newY = window.innerHeight - buttonHeight - padding;

      if (isQuiz) {
        setNoButtonPosQuiz({ x: newX, y: newY });
      } else {
        setNoButtonPos({ x: newX, y: newY });
      }
      setMoveStep(prev => prev + 1);
    }
  };

  const handleYesClick = () => {
    setIsFading(true);
    setTimeout(() => {
      setPhase('celebration');
      setShowFireworks(true);
      setIsFading(false);
    }, 1000);
  };

  const handleGiftClick = () => {
    setIsFading(true);
    setTimeout(() => {
      setPhase('reasons');
      setIsFading(false);
    }, 1000);
  };

  const handleContinueClick = () => {
    setIsFading(true);
    setTimeout(() => {
      setPhase('quiz');
      setIsFading(false);
    }, 1000);
  };

  const handleQuizSubmit = () => {
    if (!selectedOption) return;

    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.wrongIds.includes(selectedOption)) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
        setSelectedOption(null);
      }, 1500);
    } else {
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 5000);
      
      if (currentQuestionIndex < questions.length - 1) {
        setIsFading(true);
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
          setSelectedOption(null);
          setIsFading(false);
        }, 800);
      } else {
        // Quiz completed
        setIsFading(true);
        setTimeout(() => {
           setPhase('postQuizCelebration');
           setIsFading(false);
           
           // Show celebration message for 4 seconds
           setTimeout(() => {
             setIsFading(true); // Start fading out content
             // After 2 seconds (requested fade to black time), transition phase
             setTimeout(() => {
               setPhase('finalBlackout');
               setIsFading(false);
             }, 2000); 
           }, 4000); 
        }, 1000);
      }
    }
  };

  useEffect(() => {
    if (showFireworks) {
      const timer = setTimeout(() => {
        setShowFireworks(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showFireworks]);

  useEffect(() => {
    if (phase === 'celebration') {
      const timer = setTimeout(() => {
        setIsFading(true);
        setTimeout(() => {
          setPhase('gift');
          setIsFading(false);
        }, 1000);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const showHearts = phase !== 'postQuizCelebration' && phase !== 'finalBlackout';

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-[2000ms] ${phase === 'finalBlackout' ? 'bg-black' : 'bg-white'}`}>
      {showHearts && <FloatingHearts />}
      {showFireworks && <Fireworks />}

      {/* Phase 1: Game */}
      {phase === 'game' && (
        <div 
          className={`z-10 bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-[2rem] shadow-[0_4px_24px_0_rgba(255,182,193,0.15)] border border-white/30 flex flex-col items-center justify-center text-center max-w-lg w-full transition-all duration-1000 ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
        >
          <h1 className="text-xl md:text-3xl font-romantic text-pink-500 mb-8 drop-shadow-sm leading-tight">
            ready for a game namit ?
          </h1>
          <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full min-h-[80px]">
            <button
              onClick={handleYesClick}
              className="px-10 py-3 bg-pink-500 text-white font-bold text-xl rounded-full shadow-md hover:bg-pink-600 hover:scale-105 active:scale-95 transition-all duration-300 min-w-[120px] cursor-pointer z-10"
            >
              YES
            </button>
            <button
              ref={noButtonRef}
              onMouseEnter={() => moveNoButton(false)}
              onClick={() => moveNoButton(false)}
              style={noButtonPos ? {
                position: 'fixed',
                left: `${noButtonPos.x}px`,
                top: `${noButtonPos.y}px`,
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: 100
              } : {
                position: 'relative'
              }}
              className="px-10 py-3 bg-white/60 text-pink-400 font-bold text-xl rounded-full shadow-sm border border-pink-100 hover:border-pink-300 min-w-[120px] whitespace-nowrap"
            >
              NO
            </button>
          </div>
        </div>
      )}

      {/* Phase 2: Celebration */}
      {phase === 'celebration' && (
        <div className={`z-20 text-center transition-opacity duration-1000 ${isFading ? 'opacity-0' : 'opacity-100'} animate-in fade-in duration-[2000ms] ease-out`}>
          <h2 className="text-4xl md:text-7xl font-romantic text-pink-600 drop-shadow-lg p-4">
            Happy 16 Kannama
          </h2>
          <div className="mt-4 flex justify-center space-x-2">
            <Heart className="text-pink-400 fill-pink-400 animate-bounce" size={32} />
            <Heart className="text-pink-500 fill-pink-500 animate-bounce delay-100" size={40} />
            <Heart className="text-pink-400 fill-pink-400 animate-bounce delay-200" size={32} />
          </div>
        </div>
      )}

      {/* Phase 3: Gift Box */}
      {phase === 'gift' && (
        <div 
          onClick={handleGiftClick}
          className={`z-30 flex flex-col items-center cursor-pointer transition-all duration-1000 ${isFading ? 'opacity-0 scale-75' : 'opacity-100 scale-100'} animate-in fade-in zoom-in duration-1000`}
        >
          <div className="relative group">
            <Gift 
              size={120} 
              className="text-pink-500 fill-pink-100 group-hover:scale-110 transition-transform duration-300 animate-pulse" 
            />
            <div className="absolute -top-4 -right-4 bg-pink-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
              16
            </div>
          </div>
          <p className="mt-6 text-pink-400 font-romantic text-2xl animate-pulse">
            click me
          </p>
        </div>
      )}

      {/* Phase 4: Reasons */}
      {phase === 'reasons' && (
        <div 
          className={`z-10 bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(255,182,193,0.2)] border border-white/40 flex flex-col items-center max-w-2xl w-full h-[85vh] transition-all duration-1000 ${isFading ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'} animate-in fade-in slide-in-from-bottom-20`}
        >
          <h1 className="text-2xl md:text-4xl font-romantic text-pink-600 mb-6 text-center drop-shadow-sm px-4">
            16 reasons why Harsha loves you the most
          </h1>
          
          <div className="w-full overflow-y-auto pr-2 custom-scrollbar space-y-4 flex-1">
            {reasons.map((reason, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 p-4 bg-white/40 rounded-2xl border border-pink-50/50 hover:bg-white/60 transition-colors"
              >
                <div className="bg-pink-500 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm">
                  {index + 1}
                </div>
                <p className="text-pink-700 text-lg md:text-xl font-medium pt-0.5 italic">
                  "{reason}"
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-4 w-full">
            <div className="text-pink-300 animate-bounce">
              <ChevronDown size={24} />
            </div>
            <button
              onClick={handleContinueClick}
              className="px-12 py-3 bg-pink-500 text-white font-bold text-lg rounded-full shadow-lg hover:bg-pink-600 hover:scale-105 active:scale-95 transition-all duration-300 w-full md:w-auto"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Phase 5: Quiz */}
      {phase === 'quiz' && (
        <div 
          className={`z-10 bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(255,182,193,0.2)] border border-white/40 flex flex-col items-center max-w-lg w-full min-h-[500px] transition-all duration-1000 ${isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} animate-in fade-in zoom-in`}
        >
          <h2 className="text-2xl md:text-3xl font-romantic text-pink-600 mb-4 text-center">
            let's see how well you know him
          </h2>
          
          <div className="flex-1 w-full flex flex-col items-center py-6">
            <h3 className="text-xl text-pink-500 font-semibold mb-8 text-center px-2">
              {questions[currentQuestionIndex].text}
            </h3>
            
            <div className="grid grid-cols-1 gap-4 w-full">
              {questions[currentQuestionIndex].options.map((option) => {
                const isNo = option.label.toLowerCase() === 'no' && currentQuestionIndex === 4;
                
                return (
                  <button
                    key={option.id}
                    ref={isNo ? (el => quizNoButtonRef.current = el) : null}
                    onMouseEnter={isNo ? () => moveNoButton(true) : undefined}
                    onClick={isNo ? () => moveNoButton(true) : () => setSelectedOption(option.id)}
                    style={isNo && noButtonPosQuiz ? {
                      position: 'fixed',
                      left: `${noButtonPosQuiz.x}px`,
                      top: `${noButtonPosQuiz.y}px`,
                      zIndex: 1000,
                      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    } : {}}
                    className={`px-6 py-4 rounded-2xl border-2 transition-all duration-200 text-left font-medium ${
                      selectedOption === option.id 
                      ? 'bg-pink-500 text-white border-pink-500 shadow-md scale-102' 
                      : 'bg-white/40 text-pink-700 border-pink-100 hover:border-pink-300 hover:bg-white/60'
                    }`}
                  >
                    <span className="mr-3 font-bold opacity-50 uppercase">{option.id}.</span>
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {showError && (
            <div className="flex flex-col items-center gap-2 mb-4 animate-in fade-in slide-in-from-top-4">
              <Frown className="text-pink-500" size={48} />
              <p className="text-pink-600 font-bold text-lg">try again</p>
            </div>
          )}

          <button
            onClick={handleQuizSubmit}
            disabled={!selectedOption || showError}
            className={`mt-6 px-16 py-3 bg-pink-500 text-white font-bold text-xl rounded-full shadow-lg transition-all duration-300 w-full ${!selectedOption || showError ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:bg-pink-600 hover:scale-105 active:scale-95'}`}
          >
            Submit
          </button>
          
          <p className="mt-4 text-pink-300 text-sm font-medium">Question {currentQuestionIndex + 1} of 5</p>
        </div>
      )}

      {/* Phase 6: Post Quiz Celebration Message */}
      {phase === 'postQuizCelebration' && (
        <div className={`z-40 text-center px-4 transition-opacity duration-2000 ${isFading ? 'opacity-0' : 'opacity-100'} animate-in fade-in duration-[1500ms]`}>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-romantic text-pink-600 leading-tight drop-shadow-md">
            yayyyyyy!!! you are locked in for life, love you soooo muchh
          </h1>
        </div>
      )}

      {/* Phase 7: Final Blackout Screen */}
      {phase === 'finalBlackout' && (
        <div className="z-50 flex flex-col items-center justify-center min-h-screen w-full text-center px-6 md:px-12 relative bg-black">
          <div className="max-w-3xl animate-in fade-in duration-[5000ms] ease-in-out">
            <p className="text-lg md:text-2xl text-white leading-relaxed font-romantic opacity-90">
              Namit, we have come some way, looking back, we have had some great times and there is no doubt we will continue having greater times. To us, our first 16 and to a lot more to come. love you
            </p>
          </div>
          <div className="absolute bottom-10 w-full text-center animate-in fade-in duration-[7000ms] delay-[3000ms]">
            <p className="text-pink-500/80 text-sm font-medium tracking-widest uppercase">
              made with love by ur bubii harsha
            </p>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        .font-romantic {
          letter-spacing: -0.01em;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.5);
        }
        .scale-102 {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default App;
