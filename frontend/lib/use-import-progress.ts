import { useEffect, useState } from "react";

export interface ImportProgressStage {
  delay: number;
  progress: number;
  message: string;
}

export interface ImportProgressState {
  progress: number;
  message: string;
}

const idleState: ImportProgressState = { progress: 0, message: "" };

export function useImportProgress(
  isActive: boolean,
  stages: ImportProgressStage[],
  initialStage: ImportProgressState
): ImportProgressState {
  const [state, setState] = useState<ImportProgressState>(idleState);

  useEffect(() => {
    if (!isActive) {
      setState(idleState);
      return;
    }

    setState(initialStage);

    const timers = stages.map((stage) =>
      setTimeout(() => {
        setState({ progress: stage.progress, message: stage.message });
      }, stage.delay)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [isActive, stages, initialStage]);

  return state;
}
