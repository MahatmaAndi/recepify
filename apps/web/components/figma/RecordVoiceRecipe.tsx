'use client';

import { ArrowLeft, Mic, Square, Play, Trash2, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface RecordVoiceRecipeProps {
  onBack: () => void;
  onSave: (transcription: string) => void;
}

export function RecordVoiceRecipe({ onBack, onSave }: RecordVoiceRecipeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasRecording, setHasRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording && !isPaused) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, isPaused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
    setHasRecording(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setHasRecording(true);
  };

  const handleDeleteRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    setHasRecording(false);
  };

  const handleProcessRecording = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSave("Sample transcription from voice recording");
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-1 -ml-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl">Record Voice Recipe</h1>
        </div>
      </div>

      <div className="px-6 py-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-colors ${
            isRecording && !isPaused ? 'bg-red-100 animate-pulse' : 'bg-gray-100'
          }`}>
            <Mic className={`w-10 h-10 ${
              isRecording && !isPaused ? 'text-red-600' : 'text-gray-600'
            }`} />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl mb-2">Voice Recording</h2>
          <p className="text-sm text-gray-600">
            {!isRecording && !hasRecording && "Record yourself reading or describing a recipe"}
            {isRecording && !isPaused && "Recording in progress..."}
            {isPaused && "Recording paused"}
            {hasRecording && !isRecording && "Recording ready to process"}
          </p>
        </div>

        {/* Timer */}
        {(isRecording || hasRecording) && (
          <div className="text-center mb-8">
            <div className="text-5xl mb-2">{formatTime(recordingTime)}</div>
            {isRecording && !isPaused && (
              <div className="flex items-center justify-center gap-2 text-sm text-red-600">
                <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                Recording
              </div>
            )}
            {isPaused && (
              <div className="text-sm text-gray-600">Paused</div>
            )}
          </div>
        )}

        {/* Recording Controls */}
        {!isRecording && !hasRecording && (
          <div className="space-y-4">
            <button
              onClick={handleStartRecording}
              className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              <span>Start Recording</span>
            </button>

            {/* Tips */}
            <div className="mt-8 space-y-3">
              <h3 className="text-xs text-gray-600">Recording tips:</h3>
              <div className="space-y-2">
                {[
                  "Speak clearly and at a normal pace",
                  "Include recipe name, ingredients, and steps",
                  "Mention quantities and cooking times",
                  "Record in a quiet environment"
                ].map((tip, index) => (
                  <div key={index} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-gray-400">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Recording Controls */}
        {isRecording && (
          <div className="space-y-3">
            <button
              onClick={handlePauseResume}
              className="w-full py-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isPaused ? (
                <>
                  <Play className="w-5 h-5" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              onClick={handleStopRecording}
              className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Done Recording
            </button>

            <button
              onClick={handleDeleteRecording}
              className="w-full py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Cancel</span>
            </button>
          </div>
        )}

        {/* Processing Controls */}
        {hasRecording && !isRecording && (
          <div className="space-y-3">
            <button
              onClick={handleProcessRecording}
              disabled={isProcessing}
              className="w-full py-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              <span>{isProcessing ? "Processing..." : "Process Recording"}</span>
            </button>

            <button
              onClick={handleDeleteRecording}
              disabled={isProcessing}
              className="w-full py-3 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete & Start Over</span>
            </button>
          </div>
        )}

        {/* Info */}
        {!isRecording && !hasRecording && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong className="text-gray-900">AI-powered:</strong> We&apos;ll automatically transcribe your recording and extract the recipe details, ingredients, and instructions.
              </p>
          </div>
        )}
      </div>
    </div>
  );
}
