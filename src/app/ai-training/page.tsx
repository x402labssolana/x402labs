'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface Car {
  x: number;
  y: number;
  angle: number;
  speed: number;
  width: number;
  height: number;
}

interface TrackPoint {
  x: number;
  y: number;
  type: 'straight' | 'curve' | 'checkpoint';
}

interface TrainingData {
  input: number[];
  output: number[];
  feedback: 'good' | 'bad' | 'neutral';
  timestamp: number;
}

interface AINeuralNode {
  id: number;
  x: number;
  y: number;
  activation: number;
  connections: { targetId: number; weight: number }[];
  layer: number;
}

export default function AITrainingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const carRef = useRef<Car>({
    x: 100,
    y: 200,
    angle: -1.5,
    speed: 0,
    width: 20,
    height: 12
  });
  const [isClient, setIsClient] = useState(false);
  
  // Car and track state
  const [car, setCar] = useState<Car>({
    x: 124,
    y: 50,
    angle: 0,
    speed: 0,
    width: 40,
    height: 24
  });

  // Update car ref whenever car state changes
  useEffect(() => {
    carRef.current = car;
  }, [car]);
  
  const [trackPoints] = useState<TrackPoint[]>([
    { x: 200, y: 200, type: 'checkpoint' },
    { x: 400, y: 200, type: 'straight' },
    { x: 600, y: 200, type: 'straight' },
    { x: 800, y: 200, type: 'straight' },
    { x: 1000, y: 200, type: 'straight' },
    { x: 1200, y: 200, type: 'curve' },
    { x: 1300, y: 300, type: 'curve' },
    { x: 1300, y: 500, type: 'curve' },
    { x: 1300, y: 700, type: 'curve' },
    { x: 1300, y: 900, type: 'curve' },
    { x: 1200, y: 1000, type: 'curve' },
    { x: 1000, y: 1000, type: 'straight' },
    { x: 800, y: 1000, type: 'straight' },
    { x: 600, y: 1000, type: 'straight' },
    { x: 400, y: 1000, type: 'straight' },
    { x: 200, y: 1000, type: 'curve' },
    { x: 100, y: 900, type: 'curve' },
    { x: 100, y: 700, type: 'curve' },
    { x: 100, y: 500, type: 'curve' },
    { x: 100, y: 300, type: 'curve' }
  ]);

  // AI Training state
  const [isTraining, setIsTraining] = useState(false);
  const [trainingData, setTrainingData] = useState<TrainingData[]>([]);
  const [currentIteration, setCurrentIteration] = useState(0);
  const [aiNodes, setAiNodes] = useState<AINeuralNode[]>([]);
  const [aiWeights, setAiWeights] = useState<number[][]>([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [gameMode, setGameMode] = useState<'demo' | 'manual' | 'training' | null>(null);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [showResetFlash, setShowResetFlash] = useState(false);
  const [trainingPhase, setTrainingPhase] = useState<'waiting' | 'running' | 'rating' | 'reset' | 'next'>('waiting');
  const trainingPhaseRef = useRef<'waiting' | 'running' | 'rating' | 'reset' | 'next'>('waiting');
  const [iterationTimer, setIterationTimer] = useState<NodeJS.Timeout | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(3);
  const [hasRatedCurrentIteration, setHasRatedCurrentIteration] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<'good' | 'bad' | 'neutral' | null>(null);
  const [consecutiveBadFeedback, setConsecutiveBadFeedback] = useState(0);
  const [showHowToUse, setShowHowToUse] = useState(true);

  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [currentCheckpoint, setCurrentCheckpoint] = useState(0);
  const [lapsCompleted, setLapsCompleted] = useState(0);
  const [crashCount, setCrashCount] = useState(0);
  const [bestTime, setBestTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Keyboard event listeners for manual control
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameMode === 'manual') {
        setKeysPressed(prev => new Set(prev).add(event.key.toLowerCase()));
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (gameMode === 'manual') {
        setKeysPressed(prev => {
          const newSet = new Set(prev);
          newSet.delete(event.key.toLowerCase());
          return newSet;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameMode]);

  // Initialize AI neural network (only on client)
  useEffect(() => {
    if (!isClient) return;
    
    const nodes: AINeuralNode[] = [];
    const weights: number[][] = [];
    
    // Input layer (7 nodes: distance to checkpoint, angle to checkpoint, cos angle, track edge distance, track following indicator, track progress, speed)
    for (let i = 0; i < 7; i++) {
      nodes.push({
        id: i,
        x: 50 + i * 25, // Closer spacing for 7 nodes
        y: 100,
        activation: 0,
        connections: [],
        layer: 0
      });
    }
    
    // Hidden layer (6 nodes)
    for (let i = 0; i < 6; i++) {
      nodes.push({
        id: i + 7, // Updated to account for 7 input nodes
        x: 200 + (i % 3) * 40,
        y: 150 + Math.floor(i / 3) * 40,
        activation: 0,
        connections: [],
        layer: 1
      });
    }
    
    // Output layer (4 nodes: forward, backward, left, right)
    for (let i = 0; i < 4; i++) {
      nodes.push({
        id: i + 13, // Updated to account for 7 input + 6 hidden nodes
        x: 350 + i * 30,
        y: 100,
        activation: 0,
        connections: [],
        layer: 2
      });
    }
    
    // Initialize weights with some bias toward forward movement
    for (let i = 0; i < 7; i++) {
      weights[i] = [];
      for (let j = 0; j < 6; j++) {
        // Add slight bias for forward movement (input 0 = distance to checkpoint)
        if (i === 0 && j < 2) {
          weights[i][j] = 0.5 + Math.random() * 0.5; // Positive bias for forward
        } else if (i === 1 && j < 2) {
          // Input 1 = angle to checkpoint, also important for steering
          weights[i][j] = 0.3 + Math.random() * 0.3;
        } else if (i === 4 && j < 2) {
          // Input 4 = track following indicator, important for staying on track
          weights[i][j] = 0.4 + Math.random() * 0.3;
        } else {
          weights[i][j] = Math.random() * 2 - 1;
        }
      }
    }
    
    for (let i = 0; i < 6; i++) {
      weights[i + 7] = [];
      for (let j = 0; j < 4; j++) {
        // Add bias toward forward output (output 0 = forward)
        if (j === 0 && i < 3) {
          weights[i + 7][j] = 0.3 + Math.random() * 0.4; // Positive bias for forward
        } else {
          weights[i + 7][j] = Math.random() * 2 - 1;
        }
      }
    }
    
    setAiNodes(nodes);
    setAiWeights(weights);
  }, [isClient]);

  // Update training phase ref whenever training phase state changes
  useEffect(() => {
    trainingPhaseRef.current = trainingPhase;
  }, [trainingPhase]);


  // Manual controls from keyboard
  const getManualControls = useCallback(() => {
    const controls = [0, 0, 0, 0]; // [forward, backward, left, right]
    
    if (keysPressed.has('w')) controls[0] = 1; // Forward
    if (keysPressed.has('s')) controls[1] = 1; // Backward
    if (keysPressed.has('a')) controls[2] = 1; // Left
    if (keysPressed.has('d')) controls[3] = 1; // Right
    
    return controls;
  }, [keysPressed]);

  // Calculate AI inputs
  const calculateAIInputs = useCallback(() => {
    const currentCar = carRef.current;
    
    // Safety check
    if (!currentCar) {
      return [0, 0, 0, 0];
    }
    
    // Create checkpoint positions for rectangular track
    const trackCenterX = 400;
    const trackCenterY = 300;
    const trackWidth = 700;
    const trackHeight = 500;
    
    const checkpointPositions = [
      { x: trackCenterX - trackWidth/2 + 100, y: trackCenterY - trackHeight/2 }, // Top left
      { x: trackCenterX + trackWidth/2 - 100, y: trackCenterY - trackHeight/2 }, // Top right
      { x: trackCenterX + trackWidth/2, y: trackCenterY }, // Right middle
      { x: trackCenterX + trackWidth/2 - 100, y: trackCenterY + trackHeight/2 }, // Bottom right
      { x: trackCenterX - trackWidth/2 + 100, y: trackCenterY + trackHeight/2 }, // Bottom left
      { x: trackCenterX - trackWidth/2, y: trackCenterY }, // Left middle
    ];
    
    const nextCheckpoint = checkpointPositions[currentCheckpoint];
    
    if (!nextCheckpoint) {
      return [0, 0, 0, 0];
    }
    
    const dx = nextCheckpoint.x - currentCar.x;
    const dy = nextCheckpoint.y - currentCar.y;
    const distanceToCheckpoint = Math.sqrt(dx * dx + dy * dy);
    const angleToCheckpoint = Math.atan2(dy, dx) - currentCar.angle;
    
    // Enhanced track following awareness
    const trackBorderWidth = 100;
    const distanceToLeftEdge = Math.max(0, currentCar.x - (trackCenterX - trackWidth/2 + trackBorderWidth));
    const distanceToRightEdge = Math.max(0, (trackCenterX + trackWidth/2 - trackBorderWidth) - currentCar.x);
    const distanceToTopEdge = Math.max(0, currentCar.y - (trackCenterY - trackHeight/2 + trackBorderWidth));
    const distanceToBottomEdge = Math.max(0, (trackCenterY + trackHeight/2 - trackBorderWidth) - currentCar.y);
    
    // Calculate minimum distance to any track edge (track following indicator)
    const minEdgeDistance = Math.min(distanceToLeftEdge, distanceToRightEdge, distanceToTopEdge, distanceToBottomEdge);
    const isOnTrack = minEdgeDistance > 30; // Car is on track if not too close to edges
    
    // Calculate progress around track (for better path following)
    const totalCheckpoints = checkpointPositions.length;
    const trackProgress = currentCheckpoint / totalCheckpoints;
    
    const inputs = [
      distanceToCheckpoint / 100, // Primary goal: distance to next checkpoint
      Math.sin(angleToCheckpoint), // Primary goal: angle to next checkpoint
      Math.cos(angleToCheckpoint), // Additional angle information for better steering
      minEdgeDistance / 50, // Track following: distance to nearest edge
      isOnTrack ? 1 : -1, // Track following indicator (1 = on track, -1 = off track)
      trackProgress, // Progress around track (helps AI understand path sequence)
      currentCar.speed / 5 // Current speed
    ];
    
    // Safety check for NaN values
    return inputs.map(input => isNaN(input) ? 0 : input);
  }, [currentCheckpoint]);

  // AI decision making
  const getAIDecision = useCallback((inputs: number[]) => {
    if (aiWeights.length === 0) {
      console.log('No AI weights available');
      return [0, 0, 0, 0];
    }
    
    // Safety check for inputs
    if (!inputs || inputs.length !== 7) {
      console.log('Invalid inputs:', inputs);
      return [0, 0, 0, 0];
    }
    
    console.log('AI Decision - inputs:', inputs);
    console.log('AI Decision - weights length:', aiWeights.length);
    
    // Forward pass through neural network
    const hidden = [];
    for (let i = 0; i < 6; i++) {
      let sum = 0;
      for (let j = 0; j < 7; j++) {
        const weight = aiWeights[j] && aiWeights[j][i] ? aiWeights[j][i] : 0;
        const input = isNaN(inputs[j]) ? 0 : inputs[j];
        sum += input * weight;
      }
      hidden[i] = Math.tanh(sum); // Activation function
    }
    console.log('Hidden layer:', hidden);
    
    const outputs = [];
    for (let i = 0; i < 4; i++) {
      let sum = 0;
      for (let j = 0; j < 6; j++) {
        const weight = aiWeights[j + 7] && aiWeights[j + 7][i] ? aiWeights[j + 7][i] : 0;
        const hiddenVal = isNaN(hidden[j]) ? 0 : hidden[j];
        sum += hiddenVal * weight;
      }
      outputs[i] = Math.tanh(sum);
    }
    
    // Safety check for NaN outputs
    const safeOutputs = outputs.map(output => isNaN(output) ? 0 : output);
    
    // Check if all outputs are very small (AI is "stuck")
    const maxOutput = Math.max(...safeOutputs.map(Math.abs));
    console.log('AI outputs:', safeOutputs, 'max output:', maxOutput);
    
    if (maxOutput < 0.05) {
      console.log('AI appears stuck (max output:', maxOutput, ') - adding forward bias');
      // Add forward bias to prevent getting stuck
      return safeOutputs.map((output, i) => {
        if (i === 0) return output + 0.3; // Strong bias toward forward movement
        return output + (Math.random() - 0.5) * 0.1; // Small random bias
      });
    }
    
    // Final safety check - if all outputs are still very small, force forward movement
    const finalMaxOutput = Math.max(...safeOutputs.map(Math.abs));
    if (finalMaxOutput < 0.1) {
      console.log('AI still stuck after bias - forcing forward movement');
      return [0.5, 0, 0, 0]; // Force forward movement
    }
    
    return safeOutputs;
  }, [aiWeights]);

  // Update AI weights based on feedback
  const updateAIWeights = useCallback((feedback: 'good' | 'bad' | 'neutral', inputs: number[], outputs: number[]) => {
    if (feedback === 'neutral') return;
    
    console.log('updateAIWeights called - feedback:', feedback);
    console.log('updateAIWeights - inputs:', inputs);
    console.log('updateAIWeights - outputs:', outputs);
    
    setAiWeights(prevWeights => {
      const newWeights = prevWeights.map(layer => [...layer]); // Deep copy
      
      // Find the strongest output (the action the AI actually took)
      const strongestOutputIndex = outputs.indexOf(Math.max(...outputs));
      
      if (feedback === 'good') {
        // For good feedback, reinforce the current behavior
        const learningRate = 0.01;
        const target = 0.8;
        
        for (let i = 0; i < 6; i++) {
          if (newWeights[i + 7] && newWeights[i + 7][strongestOutputIndex] !== undefined) {
            const error = (target - outputs[strongestOutputIndex]) * learningRate;
            newWeights[i + 7][strongestOutputIndex] += error * 0.1;
            
            // Clamp weights to prevent extreme values
            newWeights[i + 7][strongestOutputIndex] = Math.max(-1, Math.min(1, newWeights[i + 7][strongestOutputIndex]));
          }
        }
        console.log('Good feedback - reinforced output', strongestOutputIndex);
        
      } else if (feedback === 'bad') {
        // For bad feedback, be much more aggressive about changing behavior
        console.log('Bad feedback - strongly discouraging output', strongestOutputIndex, 'and adding heavy exploration');
        
        // 1. Strongly discourage the bad behavior
        for (let i = 0; i < 6; i++) {
          if (newWeights[i + 7] && newWeights[i + 7][strongestOutputIndex] !== undefined) {
            // Reduce the weight that led to the bad behavior by 50%
            newWeights[i + 7][strongestOutputIndex] *= 0.5;
            newWeights[i + 7][strongestOutputIndex] = Math.max(-1, Math.min(1, newWeights[i + 7][strongestOutputIndex]));
          }
        }
        
        // 2. Strongly encourage forward movement (output 0)
        if (strongestOutputIndex !== 0) {
          for (let i = 0; i < 6; i++) {
            if (newWeights[i + 7] && newWeights[i + 7][0] !== undefined) {
              // Add strong positive bias toward forward movement
              newWeights[i + 7][0] += 0.3;
              newWeights[i + 7][0] = Math.max(-1, Math.min(1, newWeights[i + 7][0]));
            }
          }
        }
        
        // 3. Add heavy exploration to other outputs
        for (let outputIndex = 0; outputIndex < 4; outputIndex++) {
          if (outputIndex !== strongestOutputIndex) {
            for (let i = 0; i < 6; i++) {
              if (newWeights[i + 7] && newWeights[i + 7][outputIndex] !== undefined) {
                // Add larger random changes to encourage trying different actions
                const explorationChange = (Math.random() - 0.5) * 0.5;
                newWeights[i + 7][outputIndex] += explorationChange;
                newWeights[i + 7][outputIndex] = Math.max(-1, Math.min(1, newWeights[i + 7][outputIndex]));
              }
            }
          }
        }
        
        // 4. Add randomness to input layer weights
        for (let i = 0; i < 7; i++) {
          for (let j = 0; j < 6; j++) {
            if (newWeights[i] && newWeights[i][j] !== undefined) {
              const explorationChange = (Math.random() - 0.5) * 0.2;
              newWeights[i][j] += explorationChange;
              newWeights[i][j] = Math.max(-1, Math.min(1, newWeights[i][j]));
            }
          }
        }
      }
      
      // Safety check for NaN weights
      for (let layer = 0; layer < newWeights.length; layer++) {
        for (let weight = 0; weight < newWeights[layer].length; weight++) {
          if (isNaN(newWeights[layer][weight])) {
            console.log('NaN weight detected - resetting to small random value');
            newWeights[layer][weight] = (Math.random() - 0.5) * 0.2;
          }
        }
      }
      
      console.log('updateAIWeights completed - feedback:', feedback);
      return newWeights;
    });
  }, []);

  // Car physics and movement
  const updateCar = useCallback((controls: number[]) => {
    const [forward, backward, left, right] = controls;
    
    setCar(prevCar => {
      let newSpeed = prevCar.speed;
      let newAngle = prevCar.angle;
      
      // Speed control (AI outputs are -1 to 1, so use 0 as threshold)
      if (forward > 0) {
        newSpeed = Math.min(newSpeed + 0.15, 1.5);
      }
      if (backward > 0) {
        newSpeed = Math.max(newSpeed - 0.15, -0.75);
      }
      if (forward <= 0 && backward <= 0) {
        newSpeed *= 0.95; // Friction
      }
      
      // Steering (reduced sensitivity for easier control)
      if (left > 0) newAngle -= 0.03;
      if (right > 0) newAngle += 0.03;
      
      // Check for wall collisions BEFORE updating position
      const trackCenterX = 400;
      const trackCenterY = 300;
      const trackWidth = 700;
      const trackHeight = 500;
      const trackBorderWidth = 60;
      
      // Calculate track boundaries
      const outerLeft = trackCenterX - trackWidth/2 - trackBorderWidth;
      const outerRight = trackCenterX + trackWidth/2 + trackBorderWidth;
      const outerTop = trackCenterY - trackHeight/2 - trackBorderWidth;
      const outerBottom = trackCenterY + trackHeight/2 + trackBorderWidth;
      
      const innerLeft = trackCenterX - trackWidth/2 + trackBorderWidth;
      const innerRight = trackCenterX + trackWidth/2 - trackBorderWidth;
      const innerTop = trackCenterY - trackHeight/2 + trackBorderWidth;
      const innerBottom = trackCenterY + trackHeight/2 - trackBorderWidth;
      
      // Calculate new position
      const newX = prevCar.x + Math.cos(newAngle) * newSpeed;
      const newY = prevCar.y + Math.sin(newAngle) * newSpeed;
      
      // Check collision with car's corners (more precise detection)
      const carHalfWidth = prevCar.width / 2;
      const carHalfHeight = prevCar.height / 2;
      
      // Calculate car's corner positions
      const corners = [
        { x: newX - carHalfWidth, y: newY - carHalfHeight }, // Top-left
        { x: newX + carHalfWidth, y: newY - carHalfHeight }, // Top-right
        { x: newX - carHalfWidth, y: newY + carHalfHeight }, // Bottom-left
        { x: newX + carHalfWidth, y: newY + carHalfHeight }  // Bottom-right
      ];
      
      // Check if any corner would be outside the track
      const crashed = corners.some(corner => 
        corner.x < outerLeft || corner.x > outerRight || 
        corner.y < outerTop || corner.y > outerBottom ||
        (corner.x > innerLeft && corner.x < innerRight && 
         corner.y > innerTop && corner.y < innerBottom)
      );
      
      if (crashed) {
        console.log('WALL CRASH DETECTED! newX:', newX, 'newY:', newY);
        // Reset car to starting position immediately
        const resetCar = {
          x: 124,
          y: 50,
          angle: 0,
          speed: 0,
          width: 40,
          height: 24
        };
        carRef.current = resetCar; // Update ref immediately
        setCrashCount(prev => prev + 1);
        return resetCar;
      }
      
      return {
        ...prevCar,
        x: crashed ? prevCar.x : newX,
        y: crashed ? prevCar.y : newY,
        angle: newAngle,
        speed: crashed ? 0 : newSpeed
      };
    });
  }, []);

  // Game loop
  useEffect(() => {
    console.log('Game loop useEffect called - gameStarted:', gameStarted, 'gameMode:', gameMode);
    
    if (!gameStarted || !gameMode) {
      console.log('Game loop useEffect - early return due to conditions');
      return;
    }
    
    console.log('Game loop useEffect started - gameMode:', gameMode, 'trainingPhase:', trainingPhase);
    
    const gameLoop = () => {
      // For training mode, only run when in 'running' phase
      if (gameMode === 'training' && trainingPhase !== 'running') {
        animationRef.current = requestAnimationFrame(gameLoop);
        return;
      }
      
      // Debug logging
      if (gameMode === 'training') {
        console.log('Game loop running - trainingPhase:', trainingPhase);
      }
      
      let controls: number[] = [0, 0, 0, 0];
      
      // Get controls based on current mode
      if (gameMode === 'manual') {
        controls = getManualControls();
      } else if (gameMode === 'training') {
        const inputs = calculateAIInputs();
        controls = getAIDecision(inputs);
        
        // Debug logging
        if (trainingPhase === 'running') {
          console.log('Training mode - inputs:', inputs);
          console.log('Training mode - controls:', controls);
          console.log('Training mode - aiWeights length:', aiWeights.length);
          console.log('Training mode - car position:', carRef.current.x, carRef.current.y);
        }
      }
      
      updateCar(controls);
      
      // Check checkpoint using car ref for current position
      const trackCenterX = 400;
      const trackCenterY = 300;
      const trackWidth = 700;
      const trackHeight = 500;
      
      // Use different checkpoint positions for perfect demo vs other modes
      let checkpointPositions;
      if (gameMode === 'demo') {
        // Safer checkpoints for perfect demo
        const safetyMargin = 80;
        checkpointPositions = [
          { x: trackCenterX - trackWidth/2 + safetyMargin, y: trackCenterY - trackHeight/2 + safetyMargin }, // Top left
          { x: trackCenterX + trackWidth/2 - safetyMargin, y: trackCenterY - trackHeight/2 + safetyMargin }, // Top right
          { x: trackCenterX + trackWidth/2 - safetyMargin, y: trackCenterY }, // Right middle
          { x: trackCenterX + trackWidth/2 - safetyMargin, y: trackCenterY + trackHeight/2 - safetyMargin }, // Bottom right
          { x: trackCenterX - trackWidth/2 + safetyMargin, y: trackCenterY + trackHeight/2 - safetyMargin }, // Bottom left
          { x: trackCenterX - trackWidth/2 + safetyMargin, y: trackCenterY }, // Left middle
        ];
      } else {
        // Original checkpoints for training and manual modes
        checkpointPositions = [
          { x: trackCenterX - trackWidth/2 + 100, y: trackCenterY - trackHeight/2 }, // Top left
          { x: trackCenterX + trackWidth/2 - 100, y: trackCenterY - trackHeight/2 }, // Top right
          { x: trackCenterX + trackWidth/2, y: trackCenterY }, // Right middle
          { x: trackCenterX + trackWidth/2 - 100, y: trackCenterY + trackHeight/2 }, // Bottom right
          { x: trackCenterX - trackWidth/2 + 100, y: trackCenterY + trackHeight/2 }, // Bottom left
          { x: trackCenterX - trackWidth/2, y: trackCenterY }, // Left middle
        ];
      }
      
      const nextCheckpoint = checkpointPositions[currentCheckpoint];
      const distance = Math.sqrt(
        Math.pow(carRef.current.x - nextCheckpoint.x, 2) + 
        Math.pow(carRef.current.y - nextCheckpoint.y, 2)
      );
      
      if (distance < 30) {
        setCurrentCheckpoint(prev => {
          const next = (prev + 1) % checkpointPositions.length;
          if (next === 0) {
            setLapsCompleted(prev => prev + 1);
          }
          return next;
        });
      }
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameStarted, gameMode, trainingPhase, currentCheckpoint, getManualControls, calculateAIInputs, getAIDecision, updateCar, aiWeights.length]);

  // Render canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with simple background
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Create a proper rectangular track with rounded corners
    const createRectangularTrack = (centerX: number, centerY: number, width: number, height: number, cornerRadius: number, trackWidth: number) => {
      // Calculate track boundaries
      const outerWidth = width + trackWidth;
      const outerHeight = height + trackWidth;
      const innerWidth = width - trackWidth;
      const innerHeight = height - trackWidth;
      
      // Draw outer track boundary
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(centerX - outerWidth/2, centerY - outerHeight/2, outerWidth, outerHeight, cornerRadius + trackWidth/2);
      ctx.stroke();
      
      // Draw inner track boundary
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.roundRect(centerX - innerWidth/2, centerY - innerHeight/2, innerWidth, innerHeight, cornerRadius - trackWidth/2);
      ctx.stroke();
      
      // Draw track surface (center line)
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(centerX - width/2, centerY - height/2, width, height, cornerRadius);
      ctx.stroke();
      
      // Draw dashed center line
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.roundRect(centerX - width/2, centerY - height/2, width, height, cornerRadius);
      ctx.stroke();
      ctx.setLineDash([]);
    };
    
    // Create the rectangular track (fills entire canvas background)
    const trackCenterX = 400; // Center of canvas
    const trackCenterY = 300; // Center of canvas
    const trackWidth = 700;   // Track width (fills most of 800px canvas)
    const trackHeight = 500;  // Track height (fills most of 600px canvas)
    const cornerRadius = 80;  // Rounded corners
    const trackBorderWidth = 60; // Width of track surface
    
    createRectangularTrack(trackCenterX, trackCenterY, trackWidth, trackHeight, cornerRadius, trackBorderWidth);
    
    // Checkpoints are now invisible but still functional for AI training
    
    // Draw simple 2D car
    ctx.save();
    ctx.translate(car.x, car.y);
    ctx.rotate(car.angle);
    
    // Car body
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(-car.width/2, -car.height/2, car.width, car.height);
    
    // Car direction indicator
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(car.width/2 - 5, -3, 10, 6);
    
    // Car wheels
    ctx.fillStyle = '#1f2937';
    ctx.fillRect(-car.width/2 - 3, -car.height/2 + 3, 6, 4);
    ctx.fillRect(-car.width/2 - 3, car.height/2 - 7, 6, 4);
    ctx.fillRect(car.width/2 - 3, -car.height/2 + 3, 6, 4);
    ctx.fillRect(car.width/2 - 3, car.height/2 - 7, 6, 4);
    
    ctx.restore();
    
    // Draw AI neural network
    if (isTraining) {
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 2;
      aiNodes.forEach(node => {
        node.connections.forEach(conn => {
          const targetNode = aiNodes.find(n => n.id === conn.targetId);
          if (targetNode) {
            ctx.globalAlpha = Math.abs(conn.weight) * 0.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);
            ctx.stroke();
          }
        });
        
        // Draw node
        ctx.globalAlpha = 1;
        ctx.fillStyle = `rgba(139, 92, 246, ${Math.abs(node.activation)})`;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    
  }, [car, trackPoints, currentCheckpoint, isTraining, aiNodes]);


  const startManual = () => {
    setGameMode('manual');
    setGameStarted(true);
    setCurrentCheckpoint(0);
    setLapsCompleted(0);
    setCrashCount(0);
  };

  const startIterationTimer = () => {
    // Clear any existing timer
    if (iterationTimer) {
      clearInterval(iterationTimer);
    }
    
    setTimeRemaining(3);
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up! Auto-prompt for rating
          clearInterval(timer);
          setTrainingPhase('rating');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setIterationTimer(timer);
  };

  const clearIterationTimer = () => {
    if (iterationTimer) {
      clearInterval(iterationTimer);
      setIterationTimer(null);
    }
    setTimeRemaining(3);
  };

  const startTraining = () => {
    console.log('startTraining called');
    
    // Reset rating flag and feedback for new training session
    setHasRatedCurrentIteration(false);
    setLastFeedback(null);
    setConsecutiveBadFeedback(0);
    
    // Ensure AI weights are initialized
    if (aiWeights.length === 0) {
      // Initialize AI weights if not already done
      const weights: number[][] = [];
      const nodes: AINeuralNode[] = [];
      
      // Initialize input nodes (7 nodes for enhanced track following)
      for (let i = 0; i < 7; i++) {
        nodes.push({
          id: i,
          x: 200 + i * 25, // Closer spacing for 7 nodes
          y: 200,
          activation: 0,
          connections: [],
          layer: 0
        });
      }
      
      // Initialize hidden nodes
      for (let i = 0; i < 6; i++) {
        nodes.push({
          id: i + 7, // Updated to account for 7 input nodes
          x: 200 + i * 30,
          y: 150,
          activation: 0,
          connections: [],
          layer: 1
        });
      }
      
      // Initialize output nodes
      for (let i = 0; i < 4; i++) {
        nodes.push({
          id: i + 13, // Updated to account for 7 input + 6 hidden nodes
          x: 350 + i * 30,
          y: 100,
          activation: 0,
          connections: [],
          layer: 2
        });
      }
      
      // Initialize weights with strong bias toward forward movement
      // First layer: input to hidden (7 inputs -> 6 hidden)
      for (let i = 0; i < 7; i++) {
        weights[i] = [];
        for (let j = 0; j < 6; j++) {
          // Strong bias for forward movement (input 0 = distance to checkpoint)
          if (i === 0 && j < 3) {
            weights[i][j] = 0.6 + Math.random() * 0.3; // Strong positive bias for forward
          } else if (i === 1 && j < 2) {
            // Input 1 = angle to checkpoint, also important for steering
            weights[i][j] = 0.4 + Math.random() * 0.3;
          } else if (i === 4 && j < 2) {
            // Input 4 = track following indicator, important for staying on track
            weights[i][j] = 0.5 + Math.random() * 0.3;
          } else {
            weights[i][j] = (Math.random() - 0.5) * 0.6; // Smaller random weights
          }
        }
      }
      
      // Second layer: hidden to output (6 hidden -> 4 outputs)
      for (let i = 0; i < 6; i++) {
        weights[i + 7] = [];
        for (let j = 0; j < 4; j++) {
          // Strong bias toward forward output (output 0 = forward)
          if (j === 0 && i < 4) {
            weights[i + 7][j] = 0.4 + Math.random() * 0.4; // Strong positive bias for forward
          } else {
            weights[i + 7][j] = (Math.random() - 0.5) * 0.4; // Smaller random weights
          }
        }
      }
      
      console.log('Weight structure check:');
      console.log('weights[0] length:', weights[0]?.length);
      console.log('weights[7] length:', weights[7]?.length);
      console.log('weights[0][0]:', weights[0]?.[0]);
      console.log('weights[7][0]:', weights[7]?.[0]);
      
      setAiNodes(nodes);
      setAiWeights(weights);
      console.log('AI weights initialized:', weights.length, 'layers');
    }
    
    setGameMode('training');
    setIsTraining(true);
    setGameStarted(true);
    setCurrentIteration(1);
    setTrainingData([]);
    setCurrentCheckpoint(0);
    setLapsCompleted(0);
    setCrashCount(0);
    setTrainingPhase('running'); // Automatically start first iteration
    startIterationTimer(); // Start the 5-second timer
    
    console.log('startTraining completed - all states set');
  };

  const stopGame = () => {
    setGameMode(null);
    setIsTraining(false);
    setGameStarted(false);
    setKeysPressed(new Set());
    setTrainingPhase('waiting');
    clearIterationTimer();
  };

  const giveFeedback = (feedback: 'good' | 'bad' | 'neutral') => {
    if (!isTraining || hasRatedCurrentIteration) return;
    
    const inputs = calculateAIInputs();
    const outputs = getAIDecision(inputs);
    
    const newTrainingData: TrainingData = {
      input: inputs,
      output: outputs,
      feedback,
      timestamp: Date.now()
    };
    
    setTrainingData(prev => [...prev, newTrainingData]);
    updateAIWeights(feedback, inputs, outputs);
    
    // Update training progress
    const goodFeedback = trainingData.filter(d => d.feedback === 'good').length;
    const totalFeedback = trainingData.length + 1;
    setSuccessRate((goodFeedback / totalFeedback) * 100);
    setTrainingProgress(Math.min((totalFeedback / 50) * 100, 100));
    
    // Track consecutive bad feedback
    if (feedback === 'bad') {
      setConsecutiveBadFeedback(prev => prev + 1);
    } else {
      setConsecutiveBadFeedback(0);
    }
    
    // If we have too many consecutive bad feedbacks, reset the AI weights
    if (feedback === 'bad' && consecutiveBadFeedback >= 3) {
      console.log('Too many consecutive bad feedbacks - resetting AI weights');
      setConsecutiveBadFeedback(0);
      
      // Show reset message to user
      setTimeout(() => {
        alert('AI was struggling with the same behavior. I\'ve reset it with a fresh start and stronger forward bias!');
      }, 100);
      
      // Reset AI weights with strong forward bias
      const weights: number[][] = [];
      for (let i = 0; i < 7; i++) {
        weights[i] = [];
        for (let j = 0; j < 6; j++) {
          if (i === 0 && j < 3) {
            weights[i][j] = 0.4 + Math.random() * 0.3; // Strong positive bias for forward
          } else if (i === 1 && j < 2) {
            // Input 1 = angle to checkpoint, also important for steering
            weights[i][j] = 0.3 + Math.random() * 0.2;
          } else if (i === 4 && j < 2) {
            // Input 4 = track following indicator, important for staying on track
            weights[i][j] = 0.4 + Math.random() * 0.2;
          } else {
            weights[i][j] = (Math.random() - 0.5) * 0.4; // Smaller random weights
          }
        }
      }
      for (let i = 0; i < 6; i++) {
        weights[i + 7] = [];
        for (let j = 0; j < 4; j++) {
          if (j === 0 && i < 4) {
            weights[i + 7][j] = 0.3 + Math.random() * 0.4; // Strong bias for forward
          } else {
            weights[i + 7][j] = (Math.random() - 0.5) * 0.3; // Smaller random weights
          }
        }
      }
      setAiWeights(weights);
    }
    
    // Mark this iteration as rated and move to reset phase
    setHasRatedCurrentIteration(true);
    setLastFeedback(feedback);
    clearIterationTimer();
    setTrainingPhase('reset');
    console.log('giveFeedback - trainingPhase set to reset, iteration rated');
    
    // Flash the reset button
    setShowResetFlash(true);
    setTimeout(() => setShowResetFlash(false), 1000);
  };

  const resetCar = () => {
    const resetCarState = {
      x: 124,
      y: 50,
      angle: 0,
      speed: 0,
      width: 40,
      height: 24
    };
    
    setCar(resetCarState);
    carRef.current = resetCarState; // Update ref immediately
    setCurrentCheckpoint(0);
    if (gameMode === 'training') {
      setTrainingPhase('reset');
    }
  };

  const startAgain = () => {
    console.log('startAgain called - iteration:', currentIteration + 1);
    console.log('startAgain - aiWeights length:', aiWeights.length);
    console.log('startAgain - trainingData length:', trainingData.length);
    
    // Reset the rating flag for the new iteration
    setHasRatedCurrentIteration(false);
    
    // Check if AI weights are corrupted and reset if necessary
    if (aiWeights.length > 0) {
      const hasCorruptedWeights = aiWeights.some(layer => 
        layer.some(weight => isNaN(weight) || Math.abs(weight) > 5)
      );
      
      // Also check if AI is producing very small outputs (stuck)
      const testInputs = [1, 0, 0, 0, 1, 0, 0]; // Test with simple input (7 inputs)
      const testOutputs = getAIDecision(testInputs);
      const maxTestOutput = Math.max(...testOutputs.map(Math.abs));
      const isStuck = maxTestOutput < 0.05;
      
      if (hasCorruptedWeights || isStuck) {
        console.log('AI weights corrupted or stuck - resetting AI weights');
        console.log('Corrupted:', hasCorruptedWeights, 'Stuck:', isStuck, 'Max output:', maxTestOutput);
        
        // Reset AI weights to initial values with better bias
        const weights: number[][] = [];
        for (let i = 0; i < 7; i++) {
          weights[i] = [];
          for (let j = 0; j < 6; j++) {
            if (i === 0 && j < 2) {
              weights[i][j] = 0.3 + Math.random() * 0.4; // Positive bias for forward
            } else if (i === 1 && j < 2) {
              // Input 1 = angle to checkpoint, also important for steering
              weights[i][j] = 0.2 + Math.random() * 0.3;
            } else if (i === 4 && j < 2) {
              // Input 4 = track following indicator, important for staying on track
              weights[i][j] = 0.3 + Math.random() * 0.3;
            } else {
              weights[i][j] = (Math.random() - 0.5) * 0.8; // Smaller random weights
            }
          }
        }
        for (let i = 0; i < 6; i++) {
          weights[i + 7] = [];
          for (let j = 0; j < 4; j++) {
            if (j === 0 && i < 3) {
              weights[i + 7][j] = 0.2 + Math.random() * 0.3; // Positive bias for forward
            } else {
              weights[i + 7][j] = (Math.random() - 0.5) * 0.6; // Smaller random weights
            }
          }
        }
        setAiWeights(weights);
      }
    }
    
    // Reset car position but keep all training data and progress
    const resetCarState = {
      x: 124,
      y: 50,
      angle: 0,
      speed: 0,
      width: 40,
      height: 24
    };
    
    setCar(resetCarState);
    carRef.current = resetCarState; // Update ref immediately
    setCurrentCheckpoint(0);
    setCurrentIteration(prev => prev + 1);
    
    // Ensure game is started
    setGameStarted(true);
    
    // Start the next iteration with improved AI
    setTrainingPhase('running');
    startIterationTimer(); // Start new 5-second timer
    
    console.log('startAgain - iteration started, trainingPhase set to running');
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (iterationTimer) {
        clearInterval(iterationTimer);
      }
    };
  }, [iterationTimer]);

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="bg-black text-green-400 min-h-screen font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400 mb-4">Loading AI Training Lab...</div>
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-green-400 min-h-screen font-mono overflow-hidden">
      {/* How to Use Popup */}
      {showHowToUse && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-green-500 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto glow-border">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-green-400 mb-2">How to Train Your AI</h2>
              <p className="text-gray-300">Learn how to teach your AI car to drive like a pro!</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-xl p-6 border border-green-500/30">
                <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center">
                  <span className="bg-green-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">1</span>
                  Start Training
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Click the <span className="text-green-400 font-bold">&quot;Train AI&quot;</span> button to begin. Your AI will start driving the car automatically and you&apos;ll see it learn in real-time!
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-green-500/30">
                <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center">
                  <span className="bg-green-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">2</span>
                  Watch & Rate
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  Watch how your AI drives for 3 seconds, then rate its performance:
                </p>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-green-400">Good</span>
                    <span className="text-gray-400 text-sm">- AI is driving well, staying on track</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-yellow-400">Neutral</span>
                    <span className="text-gray-400 text-sm">- AI is okay, could be better</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-red-400">Bad</span>
                    <span className="text-gray-400 text-sm">- AI is crashing, going wrong way, or stuck</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-green-500/30">
                <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center">
                  <span className="bg-green-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">3</span>
                  Reset & Repeat
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  After rating, click <span className="text-green-400 font-bold">&quot;Reset Car&quot;</span> to start a new attempt, then <span className="text-green-400 font-bold">&quot;Next Iteration&quot;</span> to continue training.
                </p>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-6 border border-green-500/30">
                <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center">
                  <span className="bg-green-500 text-black rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">4</span>
                  Pro Tips
                </h3>
                <div className="text-gray-300 space-y-2">
                  <p>- <span className="text-green-400">Be patient</span> - AI learning takes time!</p>
                  <p>- <span className="text-green-400">Give consistent feedback</span> - Rate similar behaviors the same way</p>
                  <p>- <span className="text-green-400">Don&apos;t worry about crashes</span> - The AI will automatically reset after 3 bad attempts</p>
                  <p>- <span className="text-green-400">Try manual mode first</span> - Use WASD keys to see how the car should drive</p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <button
                onClick={() => setShowHowToUse(false)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200 glow-border"
              >
                Start Training!
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes matrix-rain {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00; }
          50% { text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 30px #00ff00; }
        }
        .glow-text {
          animation: glow 2s ease-in-out infinite alternate;
        }
        .glow-border {
          box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
        }
      `}</style>
      {/* Matrix-style background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-transparent to-green-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff00' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
        
        {/* Matrix rain effect */}
        {isClient && Array.from({ length: 15 }).map((_, i) => (
          <div
            key={`rain-${i}`}
            className="absolute text-green-400 text-xs opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              animation: `matrix-rain ${3 + Math.random() * 2}s linear infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          >
            {Array.from({ length: 15 }).map((_, j) => (
              <div key={j} className="mb-1">
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-green-400 glow-text">
              AI TRAINING LAB
            </h1>
            <p className="text-green-300 mt-2">Train your AI to drive like a pro</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowHowToUse(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 glow-border"
            >
              Show Instructions
            </button>
            <Link 
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-green-500/25 glow-border"
            >
              &lt;- Back to x402labs
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Training Canvas */}
          <div className="lg:col-span-2">
            <div className="bg-black/80 backdrop-blur-sm border border-green-500/50 rounded-2xl p-6 glow-border">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-bold text-green-400">Training Track</h2>
                  
                  {/* Manual Control Instructions */}
                  {gameMode === 'manual' && (
                    <div className="text-sm text-green-300">
                      Manual Controls - Use WASD keys to control the car
                    </div>
                  )}
                  
                  {/* Training Controls - inline with header */}
                  {gameMode === 'training' && (
                    <div className="flex items-center space-x-3">
                      {trainingPhase === 'running' && (
                        <div className="flex items-center space-x-2 text-sm text-gray-300">
                          <span>AI is driving...</span>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${timeRemaining > 2 ? 'bg-green-400' : timeRemaining > 1 ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`}></div>
                            <span className="text-xs font-mono">{timeRemaining}s</span>
                          </div>
                        </div>
                      )}
                      {trainingPhase === 'rating' && !hasRatedCurrentIteration && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-300">Rate this iteration:</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => giveFeedback('good')}
                              className="px-2 py-1 bg-green-600 rounded text-xs hover:bg-green-700 transition-colors"
                            >
                              Good
                            </button>
                            <button
                              onClick={() => giveFeedback('neutral')}
                              className="px-2 py-1 bg-yellow-600 rounded text-xs hover:bg-yellow-700 transition-colors"
                            >
                              Neutral
                            </button>
                            <button
                              onClick={() => giveFeedback('bad')}
                              className="px-2 py-1 bg-red-600 rounded text-xs hover:bg-red-700 transition-colors"
                            >
                              Bad
                            </button>
                          </div>
                        </div>
                      )}
                      {trainingPhase === 'rating' && hasRatedCurrentIteration && (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-green-300">Iteration rated! Click Reset Car, then Next Iteration</span>
                        </div>
                      )}
                      {trainingPhase === 'running' && (
                        <div className="flex items-center space-x-2">
                          {consecutiveBadFeedback >= 2 ? (
                            <span className="text-sm text-red-300">AI struggling - will reset after 3 bad attempts</span>
                          ) : lastFeedback === 'bad' ? (
                            <span className="text-sm text-yellow-300">AI is trying new behaviors after bad feedback...</span>
                          ) : lastFeedback === 'good' ? (
                            <span className="text-sm text-green-300">AI is reinforcing good behavior...</span>
                          ) : (
                            <span className="text-sm text-gray-300">AI is learning and exploring...</span>
                          )}
                        </div>
                      )}
                        {trainingPhase === 'reset' && (
                          <span className="text-sm text-green-300">Click Reset Car, then Next Iteration</span>
                        )}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <div className="text-sm text-gray-300">
                    Mode: <span className="font-semibold text-green-400">
                      {gameMode === 'manual' ? 'Manual Control' : 
                       gameMode === 'training' ? 'AI Training' : 'None'}
                    </span>
                  </div>
                  {gameStarted && gameMode === 'training' && trainingPhase === 'reset' && (
                    <button
                      onClick={startAgain}
                      className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300 text-sm font-semibold"
                    >
                      Next Iteration
                    </button>
                  )}
                  <button
                    onClick={resetCar}
                      className="px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold glow-border bg-green-600 hover:bg-green-700"
                  >
                    Reset Car
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="border border-gray-700 rounded-lg bg-gray-900"
                />
                


                {/* Demo Mode Overlay */}
              </div>
            </div>
          </div>

          {/* Training Panel */}
          <div className="space-y-6">
            {/* Training Status */}
              <div className="bg-black/80 backdrop-blur-sm border border-green-500/50 rounded-2xl p-6 glow-border">
                <h3 className="text-lg font-bold text-green-400 mb-4">Training Status</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(trainingProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300"
                      style={{ width: `${trainingProgress}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-1">
                    <span>Success Rate</span>
                    <span>{Math.round(successRate)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${successRate}%` }}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-300">{lapsCompleted}</div>
                    <div className="text-gray-400">Laps</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{crashCount}</div>
                    <div className="text-gray-400">Crashes</div>
                  </div>
                  {gameMode === 'training' && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">{currentIteration}</div>
                      <div className="text-gray-400">Iteration</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Game Mode Controls */}
            <div className="bg-black/80 backdrop-blur-sm border border-green-500/50 rounded-2xl p-6 glow-border">
              <h3 className="text-lg font-bold text-green-400 mb-4">Game Modes</h3>
              
              <div className="space-y-4">
                {!gameStarted ? (
                  <div className="space-y-3">
                    
                    <button
                      onClick={startManual}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 font-semibold"
                    >
                      Manual Control
                    </button>
                    <div className="text-xs text-green-300 text-center">
                      Use WASD keys to control the car
                    </div>
                    
                    <button
                      onClick={startTraining}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold"
                    >
                      Train AI
                    </button>
                    <div className="text-xs text-green-300 text-center">
                      Train the AI by giving feedback
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={stopGame}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-red-500/25 font-semibold glow-border"
                  >
                    Stop Game
                  </button>
                )}
                
                
                <div className="text-sm text-gray-300">
                  <div className="font-semibold text-green-300 mb-2">Controls:</div>
                  <ul className="space-y-1 text-xs">
                    <li>- <strong>W:</strong> Forward</li>
                    <li>- <strong>S:</strong> Backward</li>
                    <li>- <strong>A:</strong> Left</li>
                    <li>- <strong>D:</strong> Right</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* AI Neural Network */}
            <div className="bg-black/80 backdrop-blur-sm border border-green-500/50 rounded-2xl p-6 glow-border">
              <h3 className="text-lg font-bold text-green-400 mb-4">AI Neural Network</h3>
              
              <div className="space-y-3">
                <div className="text-sm text-gray-300">
                  <div className="font-semibold text-green-300 mb-1">Input Layer (7 nodes):</div>
                  <div className="text-xs space-y-1">
                    <div>- Distance to checkpoint (primary goal)</div>
                    <div>- Angle to checkpoint (steering)</div>
                    <div>- Cos angle to checkpoint (better steering)</div>
                    <div>- Distance to nearest track edge</div>
                    <div>- Track following indicator (on/off track)</div>
                    <div>- Track progress (path sequence)</div>
                    <div>- Current speed</div>
                  </div>
                </div>
                
                <div className="text-sm text-gray-300">
                  <div className="font-semibold text-green-400 mb-1">Hidden Layer (6 nodes):</div>
                  <div className="text-xs">Processing and pattern recognition</div>
                </div>
                
                <div className="text-sm text-gray-300">
                  <div className="font-semibold text-green-400 mb-1">Output Layer (4 nodes):</div>
                  <div className="text-xs space-y-1">
                    <div>- Forward</div>
                    <div>- Backward</div>
                    <div>- Left</div>
                    <div>- Right</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Debug Info */}
            <div className="bg-black/80 backdrop-blur-sm border border-green-500/50 rounded-2xl p-6 glow-border">
              <h3 className="text-lg font-bold text-green-400 mb-4">Debug Info</h3>
              
              {gameStarted && (
                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-gray-400 mb-1">Current Controls:</div>
                    <div className="bg-gray-800/50 rounded p-2">
                      {gameMode === 'manual' && (
                        <>
                          <div>Forward: {getManualControls()[0].toFixed(3)}</div>
                          <div>Backward: {getManualControls()[1].toFixed(3)}</div>
                          <div>Left: {getManualControls()[2].toFixed(3)}</div>
                          <div>Right: {getManualControls()[3].toFixed(3)}</div>
                        </>
                      )}
                      {gameMode === 'training' && (
                        <>
                          <div>Forward: {getAIDecision(calculateAIInputs())[0].toFixed(3)}</div>
                          <div>Backward: {getAIDecision(calculateAIInputs())[1].toFixed(3)}</div>
                          <div>Left: {getAIDecision(calculateAIInputs())[2].toFixed(3)}</div>
                          <div>Right: {getAIDecision(calculateAIInputs())[3].toFixed(3)}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 mb-1">Car State:</div>
                    <div className="bg-gray-800/50 rounded p-2">
                      <div>Speed: {car.speed.toFixed(2)}</div>
                      <div>Angle: {car.angle.toFixed(2)}</div>
                      <div>Position: ({car.x.toFixed(0)}, {car.y.toFixed(0)})</div>
                      <div>Checkpoint: {currentCheckpoint + 1}/6</div>
                    </div>
                  </div>
                  {gameMode === 'manual' && (
                    <div>
                      <div className="text-gray-400 mb-1">Keys Pressed:</div>
                      <div className="bg-gray-800/50 rounded p-2">
                        {Array.from(keysPressed).length > 0 ? 
                          Array.from(keysPressed).join(', ').toUpperCase() : 
                          'None'
                        }
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {!gameStarted && (
                <div className="text-gray-400 text-sm text-center">
                  Start a game mode to see debug information
                </div>
              )}
            </div>

            {/* Training Data */}
            {isTraining && (
              <div className="bg-black/80 backdrop-blur-sm border border-green-500/50 rounded-2xl p-6 glow-border">
                <h3 className="text-lg font-bold text-green-400 mb-4">Training Data</h3>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {trainingData.slice(-10).map((data, index) => (
                    <div key={index} className="text-xs bg-gray-800/50 rounded p-2">
                      <div className="flex justify-between items-center">
                        <span className={`font-semibold ${
                          data.feedback === 'good' ? 'text-green-400' :
                          data.feedback === 'bad' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {data.feedback.toUpperCase()}
                        </span>
                        <span className="text-gray-500">
                          {new Date(data.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-gray-400 mt-1">
                        Output: [{data.output.map(o => o.toFixed(2)).join(', ')}]
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
