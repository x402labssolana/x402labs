'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Task {
  id: number;
  name: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progress: number;
  status: 'Learning' | 'Completed' | 'Failed' | 'Queued';
  attempts: number;
  successRate: number;
  learningPattern: number[];
}

// AI Agent Training Tasks - defined outside component to prevent re-creation
const availableTasks: Omit<Task, 'progress' | 'status' | 'attempts' | 'successRate' | 'learningPattern'>[] = [
  { id: 1, name: 'Lane Detection', description: 'Identify and follow road lanes', difficulty: 'Easy' },
  { id: 2, name: 'Traffic Light Recognition', description: 'Detect and respond to traffic signals', difficulty: 'Medium' },
  { id: 3, name: 'Obstacle Avoidance', description: 'Navigate around obstacles safely', difficulty: 'Hard' },
  { id: 4, name: 'Speed Control', description: 'Maintain appropriate driving speeds', difficulty: 'Medium' },
  { id: 5, name: 'Parking Maneuvers', description: 'Execute parallel and perpendicular parking', difficulty: 'Hard' },
  { id: 6, name: 'Pedestrian Detection', description: 'Identify and respond to pedestrians', difficulty: 'Easy' },
  { id: 7, name: 'Weather Adaptation', description: 'Drive safely in various weather conditions', difficulty: 'Hard' },
  { id: 8, name: 'Route Planning', description: 'Plan optimal routes to destinations', difficulty: 'Medium' },
];

export default function LearningPage() {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskQueue, setTaskQueue] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [isLearning, setIsLearning] = useState(false);
  const [learningStep, setLearningStep] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize with random tasks (only on client)
  useEffect(() => {
    if (!isClient) return;
    
    const shuffled = [...availableTasks].sort(() => Math.random() - 0.5);
    const initialTasks = shuffled.slice(0, 3).map(task => ({
      ...task,
      progress: 0,
      status: 'Queued' as const,
      attempts: 0,
      successRate: 0,
      learningPattern: Array.from({ length: 10 }, () => Math.random() * 100)
    }));
    setTaskQueue(initialTasks);
  }, [isClient]);

  // Simulate learning process
  useEffect(() => {
    if (currentTask && isLearning) {
      const interval = setInterval(() => {
        setLearningStep(prev => {
          const newStep = prev + 1;
          if (newStep >= 20) {
            // Task completed
            const updatedTask = {
              ...currentTask,
              progress: 100,
              status: 'Completed' as const,
              successRate: Math.min(95 + (isClient ? Math.random() * 5 : 2.5), 100)
            };
            setCompletedTasks(prev => [...prev, updatedTask]);
            setCurrentTask(null);
            setIsLearning(false);
            setLearningStep(0);
            
            // Add new random task to queue
            const remainingTasks = availableTasks.filter(t => 
              !taskQueue.some(q => q.id === t.id) && 
              !completedTasks.some(c => c.id === t.id)
            );
            if (remainingTasks.length > 0) {
              const newTask = remainingTasks[Math.floor((isClient ? Math.random() : 0.5) * remainingTasks.length)];
              const taskWithData = {
                ...newTask,
                progress: 0,
                status: 'Queued' as const,
                attempts: 0,
                successRate: 0,
                learningPattern: Array.from({ length: 10 }, () => isClient ? Math.random() * 100 : 50)
              };
              setTaskQueue(prev => [...prev, taskWithData]);
            }
            return 0;
          }
          return newStep;
        });
      }, 800);

      return () => clearInterval(interval);
    }
  }, [currentTask, isLearning, taskQueue, completedTasks, isClient]);

  const startLearning = (task: Task) => {
    setCurrentTask({ ...task, status: 'Learning', attempts: task.attempts + 1 });
    setIsLearning(true);
    setLearningStep(0);
    setTaskQueue(prev => prev.filter(t => t.id !== task.id));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'Hard': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Learning': return 'text-cyan-400 bg-cyan-400/20';
      case 'Completed': return 'text-green-400 bg-green-400/20';
      case 'Failed': return 'text-red-400 bg-red-400/20';
      case 'Queued': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="bg-black text-green-400 min-h-screen font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-cyan-400 mb-4">Loading AI Training Center...</div>
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-green-400 min-h-screen font-mono">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-10 opacity-30">
          {isClient && Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`bg-particle-${i}`}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
              style={{
                top: `${(i * 7) % 100}%`,
                left: `${(i * 11) % 100}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: `${3000 + (i * 100) % 2000}ms`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AI Training Center
            </h1>
            <p className="text-gray-300 mt-2 text-sm lg:text-base">Train your personal AI agent to master autonomous driving skills</p>
            
            {/* User-Friendly Explanation */}
            <div className="mt-4 lg:mt-6 bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-xl p-4 lg:p-6">
              <h3 className="text-base lg:text-lg font-bold text-cyan-400 mb-3">How AI Training Works</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs lg:text-sm text-gray-300">
                <div>
                  <p className="mb-2">
                    <span className="text-cyan-400 font-semibold">1. Task Selection:</span> Choose a driving skill to train your AI agent
                  </p>
                  <p className="mb-2">
                    <span className="text-purple-400 font-semibold">2. Neural Network:</span> Watch your AI agent&apos;s brain process driving data
                  </p>
                </div>
                <div>
                  <p className="mb-2">
                    <span className="text-pink-400 font-semibold">3. Learning Process:</span> See how your AI learns from driving scenarios
                  </p>
                  <p className="mb-2">
                    <span className="text-green-400 font-semibold">4. Progress Tracking:</span> Monitor your AI&apos;s driving performance and improvement
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-3 italic">
                Tip: The learning process is slowed down so you can observe each step of how AI actually learns!
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto">
            <Link 
              href="/"
              className="px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 text-sm lg:text-base"
            >
              &lt;- x402labs
            </Link>
            <Link 
              href="/ai-process"
              className="px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25 text-sm lg:text-base"
            >
              AI Process -&gt;
            </Link>
          </div>
        </div>

        {/* Current Learning Task */}
        {currentTask && (
          <div className="mb-8">
            <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4 lg:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-4">
                <h2 className="text-xl lg:text-2xl font-bold text-cyan-400">Currently Learning</h2>
                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(currentTask.status)}`}>
                  {currentTask.status}
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Task Info */}
                <div>
                  <h3 className="text-xl font-bold mb-2">{currentTask.name}</h3>
                  <p className="text-gray-300 mb-4">{currentTask.description}</p>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`px-3 py-1 rounded-full text-sm ${getDifficultyColor(currentTask.difficulty)}`}>
                      {currentTask.difficulty}
                    </div>
                    <div className="text-sm text-gray-400">
                      Attempt #{currentTask.attempts}
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Learning Progress</span>
                      <span>{Math.round((learningStep / 20) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${(learningStep / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced AI Learning Visualization */}
                <div className="relative">
                  {/* Neural Network Learning Pattern */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-cyan-400 mb-3">Neural Network Activation</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      Each glowing node represents a neuron firing. Watch as the AI builds connections between neurons to learn the task.
                    </p>
                    <div className="grid grid-cols-6 gap-2">
                      {Array.from({ length: 36 }).map((_, i) => {
                        const isActive = i < (learningStep / 20) * 36;
                        const layer = Math.floor(i / 6);
                        const nodeInLayer = i % 6;
                        return (
                          <div
                            key={`neural-${i}`}
                            className={`h-6 rounded-full transition-all duration-1000 ${
                              isActive 
                                ? 'bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 shadow-lg shadow-cyan-500/50' 
                                : 'bg-gray-700'
                            }`}
                            style={{
                              animationDelay: `${(layer * 200) + (nodeInLayer * 100)}ms`,
                              boxShadow: isActive ? '0 0 15px rgba(34, 211, 238, 0.6)' : 'none'
                            }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Input Layer</span>
                      <span>Hidden Layers</span>
                      <span>Output Layer</span>
                    </div>
                  </div>

                  {/* Data Processing Pipeline */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-purple-400 mb-3">Data Processing Pipeline</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      Watch data flow through each stage of AI processing. Each glowing stage shows where the AI is currently working.
                    </p>
                    <div className="flex items-center justify-between relative">
                      {['Input', 'Feature Extraction', 'Pattern Recognition', 'Decision Making', 'Output'].map((stage, i) => {
                        const isProcessing = i <= Math.floor(learningStep / 4);
                        const stageDescriptions = [
                          'Raw data enters the system',
                          'AI identifies important features',
                          'AI finds patterns in the data',
                          'AI makes decisions based on patterns',
                          'AI produces the final result'
                        ];
                        return (
                          <div key={`stage-${i}`} className="flex flex-col items-center relative">
                            <div className={`w-8 h-8 rounded-full mb-2 transition-all duration-1000 ${
                              isProcessing 
                                ? 'bg-gradient-to-br from-purple-500 to-cyan-400 animate-pulse' 
                                : 'bg-gray-700'
                            }`} />
                            <span className="text-xs text-gray-300 text-center">{stage}</span>
                            <span className="text-xs text-gray-500 text-center mt-1 max-w-16">
                              {stageDescriptions[i]}
                            </span>
                            {i < 4 && (
                              <div className={`absolute w-12 h-0.5 mt-4 ml-8 transition-all duration-1000 ${
                                isProcessing 
                                  ? 'bg-gradient-to-r from-cyan-400 to-purple-500' 
                                  : 'bg-gray-600'
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Learning Curve Visualization */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-pink-400 mb-3">Learning Progress</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      This curve shows how the AI&apos;s accuracy improves over time. The steeper the curve, the faster the AI is learning!
                    </p>
                    <div className="h-24 bg-gray-800/50 rounded-lg p-3 relative overflow-hidden">
                      {/* Background Grid */}
                      <div className="absolute inset-0 opacity-20">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={`grid-h-${i}`} className="absolute w-full h-px bg-gray-600" style={{ top: `${i * 25}%` }} />
                        ))}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={`grid-v-${i}`} className="absolute h-full w-px bg-gray-600" style={{ left: `${i * 12.5}%` }} />
                        ))}
                      </div>
                      
                      {/* Learning Curve */}
                      <svg className="w-full h-full" viewBox="0 0 200 80">
                        <defs>
                          <linearGradient id="learningGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="50%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                        
                        {/* Learning curve path */}
                        <path
                          d={`M 0,70 ${Array.from({ length: 20 }, (_, i) => {
                            const x = (i / 19) * 200;
                            const progress = Math.min(learningStep / 20, 1);
                            const y = 70 - (Math.sin((i / 19) * Math.PI) * 60 * progress);
                            return `L ${x},${y}`;
                          }).join(' ')}`}
                          stroke="url(#learningGradient)"
                          strokeWidth="2"
                          fill="none"
                          className="transition-all duration-1000"
                        />
                        
                        {/* Data points */}
                        {Array.from({ length: Math.min(learningStep + 1, 20) }, (_, i) => {
                          const x = (i / 19) * 200;
                          const progress = Math.min(learningStep / 20, 1);
                          const y = 70 - (Math.sin((i / 19) * Math.PI) * 60 * progress);
                          return (
                            <circle
                              key={`point-${i}`}
                              cx={x}
                              cy={y}
                              r="2"
                              fill="#06b6d4"
                              className="animate-pulse"
                              style={{ animationDelay: `${i * 100}ms` }}
                            />
                          );
                        })}
                      </svg>
                    </div>
                  </div>

                  {/* Real-time Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-cyan-400">
                        {Math.round((learningStep / 20) * 100)}%
                      </div>
                      <div className="text-xs text-gray-400">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">
                        {Math.round((learningStep / 20) * 95 + (isClient ? Math.random() * 5 : 2.5))}%
                      </div>
                      <div className="text-xs text-gray-400">Confidence</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-pink-400">
                        {Math.round((learningStep / 20) * 1000 + (isClient ? Math.random() * 100 : 50))}
                      </div>
                      <div className="text-xs text-gray-400">Iterations</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Task Queue */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Tasks */}
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2 text-cyan-400">Task Queue</h3>
            <p className="text-sm text-gray-400 mb-6">
              Choose a task for the AI to learn. Each task represents a different type of intelligence the AI can develop.
            </p>
            <div className="space-y-4">
              {taskQueue.map((task, index) => (
                <div key={`queue-${task.id}-${index}`} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                      <h4 className="font-semibold group-hover:text-cyan-400 transition-colors">{task.name}</h4>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(task.difficulty)}`}>
                      {task.difficulty}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-4 leading-relaxed">{task.description}</p>
                  
                  {/* Task Preview Visualization */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Task Complexity</span>
                      <span>{task.difficulty === 'Easy' ? '25%' : task.difficulty === 'Medium' ? '60%' : '90%'}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          task.difficulty === 'Easy' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                          task.difficulty === 'Medium' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                          'bg-gradient-to-r from-red-400 to-red-600'
                        }`}
                        style={{ 
                          width: task.difficulty === 'Easy' ? '25%' : task.difficulty === 'Medium' ? '60%' : '90%' 
                        }}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => startLearning(task)}
                    disabled={isLearning}
                    className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-cyan-500/25 group"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {isLearning ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Learning in Progress...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 bg-white rounded-full opacity-80 group-hover:opacity-100 transition-opacity"></div>
                          <span>Start Learning</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-2 text-green-400">Completed Tasks</h3>
            <p className="text-sm text-gray-400 mb-6">
              Tasks the AI has successfully mastered. The success rate shows how well the AI learned each skill.
            </p>
            <div className="space-y-4">
              {completedTasks.map((task, index) => (
                <div key={`completed-${task.id}-${index}`} className="bg-gray-800/50 rounded-lg p-4 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <h4 className="font-semibold text-green-400 group-hover:text-green-300 transition-colors">{task.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-green-400 font-bold">
                        {task.successRate.toFixed(1)}%
                      </div>
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-3 leading-relaxed">{task.description}</p>
                  
                  {/* Success Visualization */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>Learning Success</span>
                      <span>{task.successRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000"
                        style={{ width: `${task.successRate}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-4 text-gray-400">
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>Attempts: {task.attempts}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>{task.difficulty}</span>
                      </span>
                    </div>
                    <div className="text-green-400 font-semibold">
                      Mastered
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Learning Stats */}
        <div className="mt-8 bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6 text-purple-400">Learning Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">
                {completedTasks.length}
              </div>
              <div className="text-sm text-gray-300">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {taskQueue.length}
              </div>
              <div className="text-sm text-gray-300">Tasks Queued</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {completedTasks.length > 0 
                  ? (completedTasks.reduce((sum, task) => sum + task.successRate, 0) / completedTasks.length).toFixed(1)
                  : '0'
                }%
              </div>
              <div className="text-sm text-gray-300">Average Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {completedTasks.reduce((sum, task) => sum + task.attempts, 0)}
              </div>
              <div className="text-sm text-gray-300">Total Attempts</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
