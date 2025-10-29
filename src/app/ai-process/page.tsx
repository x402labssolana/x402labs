'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DataStream {
  id: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  speed: number;
  delay: number;
}

interface LearningNode {
  id: number;
  x: number;
  y: number;
  isActive: boolean;
  activationTime: number;
  connections: number[];
}

interface LearningTask {
  id: string;
  title: string;
  description: string;
  startState: string;
  goalState: string;
  phases: string[];
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export default function AIProcessPage() {
  const [learningProgress, setLearningProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [dataStreams, setDataStreams] = useState<DataStream[]>([]);
  const [learningNodes, setLearningNodes] = useState<LearningNode[]>([]);
  const [isLearning, setIsLearning] = useState(false);
  const [currentTask, setCurrentTask] = useState<LearningTask | null>(null);

  const learningTasks: LearningTask[] = [
    {
      id: 'driving',
      title: 'Learning to Drive a Car',
      description: 'Mastering the complex coordination of vehicle control, traffic rules, and situational awareness',
      startState: 'No driving experience, unfamiliar with vehicle controls',
      goalState: 'Confident driver capable of handling various road conditions and traffic situations',
      phases: [
        'Understanding Vehicle Controls',
        'Learning Traffic Rules & Signs',
        'Practicing Basic Maneuvers',
        'Developing Spatial Awareness',
        'Mastering Parking Techniques',
        'Handling Complex Traffic Situations',
        'Building Confidence & Reflexes',
        'Driving Proficiency Achieved!'
      ],
      category: 'Physical Skills',
      difficulty: 'Intermediate'
    },
    {
      id: 'emotion-recognition',
      title: 'Understanding Human Emotions',
      description: 'Learning to recognize, interpret, and respond appropriately to emotional expressions',
      startState: 'Unable to distinguish between different emotional expressions',
      goalState: 'Accurately identify emotions and respond with appropriate empathy',
      phases: [
        'Analyzing Facial Expressions',
        'Recognizing Voice Tones',
        'Understanding Body Language',
        'Learning Emotional Context',
        'Developing Empathy Patterns',
        'Practicing Appropriate Responses',
        'Building Emotional Intelligence',
        'Emotional Mastery Complete!'
      ],
      category: 'Social Intelligence',
      difficulty: 'Advanced'
    },
    {
      id: 'cooking',
      title: 'Learning to Cook',
      description: 'Developing culinary skills from basic food preparation to complex recipe execution',
      startState: 'No cooking experience, unfamiliar with kitchen tools and techniques',
      goalState: 'Skilled cook capable of creating diverse, delicious meals',
      phases: [
        'Learning Kitchen Safety',
        'Understanding Basic Techniques',
        'Mastering Ingredient Preparation',
        'Learning Flavor Combinations',
        'Practicing Recipe Execution',
        'Developing Timing & Coordination',
        'Building Culinary Creativity',
        'Cooking Mastery Achieved!'
      ],
      category: 'Creative Skills',
      difficulty: 'Beginner'
    },
    {
      id: 'language',
      title: 'Learning a New Language',
      description: 'Acquiring fluency in a foreign language through vocabulary, grammar, and cultural understanding',
      startState: 'No knowledge of the target language',
      goalState: 'Fluent speaker capable of complex conversations and cultural nuances',
      phases: [
        'Learning Basic Vocabulary',
        'Understanding Grammar Rules',
        'Practicing Pronunciation',
        'Building Sentence Structures',
        'Developing Listening Skills',
        'Mastering Conversation Flow',
        'Understanding Cultural Context',
        'Language Fluency Achieved!'
      ],
      category: 'Communication',
      difficulty: 'Advanced'
    },
    {
      id: 'chess',
      title: 'Learning Chess Strategy',
      description: 'Mastering the strategic thinking and tactical patterns of chess gameplay',
      startState: 'Knows basic piece movements but lacks strategic understanding',
      goalState: 'Skilled player capable of complex strategic planning and tactical execution',
      phases: [
        'Understanding Piece Values',
        'Learning Opening Principles',
        'Mastering Tactical Patterns',
        'Developing Positional Awareness',
        'Learning Endgame Techniques',
        'Building Strategic Thinking',
        'Practicing Game Analysis',
        'Chess Mastery Complete!'
      ],
      category: 'Strategic Thinking',
      difficulty: 'Intermediate'
    },
    {
      id: 'music',
      title: 'Learning to Play Piano',
      description: 'Developing musical skills from basic note reading to expressive performance',
      startState: 'No musical experience, unfamiliar with piano and music theory',
      goalState: 'Skilled pianist capable of playing complex pieces with expression',
      phases: [
        'Learning Note Reading',
        'Understanding Rhythm & Timing',
        'Mastering Hand Coordination',
        'Developing Finger Technique',
        'Learning Music Theory',
        'Practicing Scales & Arpeggios',
        'Building Musical Expression',
        'Piano Mastery Achieved!'
      ],
      category: 'Artistic Skills',
      difficulty: 'Intermediate'
    }
  ];

  const phaseColors = [
    'text-blue-400',
    'text-cyan-400', 
    'text-purple-400',
    'text-pink-400',
    'text-green-400',
    'text-yellow-400',
    'text-orange-400',
    'text-emerald-400'
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-400 bg-green-400/20';
      case 'Intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'Advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Initialize learning nodes in a brain-like pattern
  useEffect(() => {
    const nodes: LearningNode[] = [];
    const centerX = 400;
    const centerY = 300;
    
    // Create nodes in concentric circles
    for (let layer = 0; layer < 4; layer++) {
      const radius = 60 + (layer * 40);
      const nodeCount = 6 + (layer * 2);
      
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        nodes.push({
          id: nodes.length,
          x,
          y,
          isActive: false,
          activationTime: 0,
          connections: []
        });
      }
    }
    
    // Add center node
    nodes.push({
      id: nodes.length,
      x: centerX,
      y: centerY,
      isActive: false,
      activationTime: 0,
      connections: []
    });
    
    setLearningNodes(nodes);
  }, []);

  // Generate data streams
  useEffect(() => {
    const generateStream = () => {
      const newStream: DataStream = {
        id: Date.now() + Math.random(),
        x: Math.random() * 800,
        y: Math.random() * 600,
        targetX: 400 + (Math.random() - 0.5) * 100,
        targetY: 300 + (Math.random() - 0.5) * 100,
        color: ['#06b6d4', '#8b5cf6', '#ec4899', '#10b981'][Math.floor(Math.random() * 4)],
        speed: 0.5 + Math.random() * 1.5,
        delay: Math.random() * 2000
      };
      
      setDataStreams(prev => [...prev.slice(-15), newStream]);
    };

    if (isLearning) {
      const interval = setInterval(generateStream, 300);
      return () => clearInterval(interval);
    }
  }, [isLearning]);

  // Learning simulation
  useEffect(() => {
    if (isLearning && currentTask) {
      const interval = setInterval(() => {
        setLearningProgress(prev => {
          const newProgress = prev + 0.5;
          
          // Update phase based on progress
          const newPhase = Math.floor((newProgress / 100) * currentTask.phases.length);
          setCurrentPhase(Math.min(newPhase, currentTask.phases.length - 1));
          
          // Activate nodes progressively
          if (newProgress % 5 === 0) {
            setLearningNodes(prevNodes => 
              prevNodes.map((node, index) => {
                const shouldActivate = index < (newProgress / 100) * prevNodes.length;
                return {
                  ...node,
                  isActive: shouldActivate,
                  activationTime: shouldActivate ? Date.now() : node.activationTime
                };
              })
            );
          }
          
          if (newProgress >= 100) {
            setIsLearning(false);
            return 100;
          }
          
          return newProgress;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isLearning, currentTask]);

  // Update data stream positions
  useEffect(() => {
    if (dataStreams.length === 0) return;

    const interval = setInterval(() => {
      setDataStreams(prev => 
        prev.map(stream => ({
          ...stream,
          x: stream.x + (stream.targetX - stream.x) * 0.02,
          y: stream.y + (stream.targetY - stream.y) * 0.02
        })).filter(stream => {
          const distance = Math.sqrt(
            Math.pow(stream.x - stream.targetX, 2) + 
            Math.pow(stream.y - stream.targetY, 2)
          );
          return distance > 10;
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, [dataStreams]);

  const selectTask = (task: LearningTask) => {
    setCurrentTask(task);
    setIsLearning(false);
    setLearningProgress(0);
    setCurrentPhase(0);
    setDataStreams([]);
    setLearningNodes(prev => prev.map(node => ({ ...node, isActive: false })));
  };

  const startLearning = () => {
    if (currentTask) {
      setIsLearning(true);
      setLearningProgress(0);
      setCurrentPhase(0);
      setDataStreams([]);
      setLearningNodes(prev => prev.map(node => ({ ...node, isActive: false })));
    }
  };

  const resetLearning = () => {
    setIsLearning(false);
    setLearningProgress(0);
    setCurrentPhase(0);
    setDataStreams([]);
    setLearningNodes(prev => prev.map(node => ({ ...node, isActive: false })));
  };

  return (
    <div className="bg-black text-green-400 min-h-screen font-mono overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-20">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`bg-${i}`}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-ping"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: `${3000 + Math.random() * 2000}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Ascend Into The AI
            </h1>
            <p className="text-gray-300 mt-2">Watch your AI agent develop autonomous driving intelligence</p>
          </div>
          <Link 
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
          >
            &lt;- Back to x402labs
          </Link>
        </div>

        {/* Task Selection */}
        {!currentTask && (
          <div className="mb-8">
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Select a Learning Task
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {learningTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => selectTask(task)}
                    className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group hover:bg-gray-800/70"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold group-hover:text-cyan-400 transition-colors">{task.title}</h3>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{task.description}</p>
                    <div className="text-xs text-gray-400 mb-2">
                      <div className="font-semibold text-purple-400">Category:</div>
                      <div>{task.category}</div>
                    </div>
                    <div className="text-xs text-gray-400">
                      <div className="font-semibold text-cyan-400">Phases:</div>
                      <div>{task.phases.length} learning steps</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Task Info */}
        {currentTask && (
          <div className="mb-8">
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-cyan-400 mb-2">{currentTask.title}</h2>
                  <p className="text-gray-300">{currentTask.description}</p>
                </div>
                <div className="flex space-x-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(currentTask.difficulty)}`}>
                    {currentTask.difficulty}
                  </div>
                  <button
                    onClick={() => setCurrentTask(null)}
                    className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm"
                  >
                    Change Task
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-red-400 mb-2">Starting Point:</h4>
                  <p className="text-sm text-gray-300 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {currentTask.startState}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-green-400 mb-2">Goal State:</h4>
                  <p className="text-sm text-gray-300 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                    {currentTask.goalState}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Learning Visualization */}
        {currentTask && (
          <div className="flex justify-center items-center min-h-[600px]">
            <div className="relative">
              {/* AI Brain Container */}
              <div className="relative w-[800px] h-[600px] flex items-center justify-center">
                
                {/* Central AI Brain */}
                <div className="relative">
                  {/* Outer Glow Ring */}
                  <div 
                    className={`absolute inset-0 rounded-full blur-2xl transition-all duration-2000 ${
                      isLearning 
                        ? 'bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-60 animate-pulse' 
                        : 'bg-gradient-to-r from-gray-600 to-gray-800 opacity-20'
                    }`}
                    style={{
                      width: '200px',
                      height: '200px',
                      transform: 'translate(-50%, -50%)',
                      left: '50%',
                      top: '50%'
                    }}
                  />
                  
                  {/* Inner Brain Core */}
                  <div 
                    className={`absolute rounded-full transition-all duration-1000 ${
                      isLearning 
                        ? 'bg-gradient-to-br from-cyan-400 via-purple-600 to-pink-500 shadow-2xl' 
                        : 'bg-gradient-to-br from-gray-700 to-gray-900'
                    }`}
                    style={{
                      width: '120px',
                      height: '120px',
                      transform: 'translate(-50%, -50%)',
                      left: '50%',
                      top: '50%',
                      boxShadow: isLearning ? '0 0 50px rgba(34, 211, 238, 0.8), 0 0 100px rgba(147, 51, 234, 0.4)' : '0 0 20px rgba(0, 0, 0, 0.5)'
                    }}
                  >
                    {/* Brain Pulse Animation */}
                    {isLearning && (
                      <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-ping" />
                    )}
                  </div>
                </div>

                {/* Learning Nodes */}
                {learningNodes.map((node) => (
                  <div
                    key={node.id}
                    className={`absolute w-4 h-4 rounded-full transition-all duration-1000 ${
                      node.isActive 
                        ? 'bg-gradient-to-br from-cyan-400 to-purple-500 shadow-lg animate-pulse' 
                        : 'bg-gray-600'
                    }`}
                    style={{
                      left: node.x - 8,
                      top: node.y - 8,
                      boxShadow: node.isActive ? '0 0 20px rgba(34, 211, 238, 0.8)' : 'none',
                      animationDelay: `${node.id * 100}ms`
                    }}
                  />
                ))}

                {/* Data Streams */}
                {dataStreams.map((stream) => (
                  <div
                    key={stream.id}
                    className="absolute w-2 h-2 rounded-full animate-pulse"
                    style={{
                      left: stream.x - 4,
                      top: stream.y - 4,
                      backgroundColor: stream.color,
                      boxShadow: `0 0 10px ${stream.color}`,
                      animationDelay: `${stream.delay}ms`
                    }}
                  />
                ))}

                {/* Connection Lines */}
                {learningNodes.map((node, index) => {
                  if (!node.isActive) return null;
                  
                  return learningNodes.slice(index + 1).map((otherNode) => {
                    if (!otherNode.isActive) return null;
                    
                    const distance = Math.sqrt(
                      Math.pow(node.x - otherNode.x, 2) + 
                      Math.pow(node.y - otherNode.y, 2)
                    );
                    
                    if (distance < 100) {
                      return (
                        <div
                          key={`connection-${node.id}-${otherNode.id}`}
                          className="absolute h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-60 animate-pulse"
                          style={{
                            left: Math.min(node.x, otherNode.x),
                            top: Math.min(node.y, otherNode.y) + 8,
                            width: distance,
                            transform: `rotate(${Math.atan2(otherNode.y - node.y, otherNode.x - node.x)}rad)`,
                            transformOrigin: 'left center'
                          }}
                        />
                      );
                    }
                    return null;
                  });
                })}
              </div>

              {/* Learning Phase Text */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                <div className={`text-2xl font-bold transition-all duration-500 ${phaseColors[currentPhase]}`}>
                  {currentTask.phases[currentPhase]}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Phase {currentPhase + 1} of {currentTask.phases.length}
                </div>
              </div>

              {/* Progress and Controls Container */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-8">
                {/* Progress Indicator */}
                <div className="w-80">
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-2">
                    <span>Learning Progress</span>
                    <span>{Math.round(learningProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-full transition-all duration-300 relative"
                      style={{ width: `${learningProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={startLearning}
                    disabled={isLearning}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-green-500/25 font-semibold"
                  >
                    {isLearning ? 'Learning...' : 'Start Learning'}
                  </button>
                  <button
                    onClick={resetLearning}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg font-semibold"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Learning Statistics */}
        {currentTask && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {dataStreams.length}
              </div>
              <div className="text-sm text-gray-300">Active Data Streams</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {learningNodes.filter(node => node.isActive).length}
              </div>
              <div className="text-sm text-gray-300">Activated Nodes</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">
                {Math.round(learningProgress)}%
              </div>
              <div className="text-sm text-gray-300">Learning Progress</div>
            </div>
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {currentPhase + 1}
              </div>
              <div className="text-sm text-gray-300">Current Phase</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}