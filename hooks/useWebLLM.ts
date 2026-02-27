import { useState, useEffect, useCallback, useRef } from 'react';
import { webllmService, WebLLMMessage, SetupStatus, GenerateOptions } from '../services/webllmService';

export interface UseWebLLMOptions {
  autoInitialize?: boolean;
}

export interface UseWebLLMReturn {
  status: SetupStatus;
  isReady: boolean;
  isSettingUp: boolean;
  progress: number;
  progressText: string;
  error: string | null;
  initialize: () => Promise<void>;
  generate: (messages: WebLLMMessage[], options?: GenerateOptions) => Promise<string>;
  generateWebsite: (description: string, options?: GenerateOptions) => Promise<string>;
  generateComponent: (componentName: string, description: string, options?: GenerateOptions) => Promise<string>;
  unload: () => Promise<void>;
}

export function useWebLLM(options: UseWebLLMOptions = {}): UseWebLLMReturn {
  const { autoInitialize = false } = options;

  const [status, setStatus] = useState<SetupStatus>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [progressText, setProgressText] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const initializedRef = useRef(false);

  useEffect(() => {
    const unsubscribeStatus = webllmService.onStatusChange((newStatus) => {
      setStatus(newStatus);
      if (newStatus === 'error') {
        setError('Failed to initialize AI. Please check your browser supports WebGPU.');
      } else if (newStatus === 'ready') {
        setError(null);
      }
    });

    const unsubscribeProgress = webllmService.onProgress((report) => {
      setProgress(report.progress);
      setProgressText(report.text);
    });

    return () => {
      unsubscribeStatus();
      unsubscribeProgress();
    };
  }, []);

  useEffect(() => {
    if (autoInitialize && !initializedRef.current && status === 'idle') {
      initializedRef.current = true;
      initialize();
    }
  }, [autoInitialize, status]);

  const initialize = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await webllmService.initialize();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const generate = useCallback(
    async (messages: WebLLMMessage[], options: GenerateOptions = {}): Promise<string> => {
      if (status !== 'ready') {
        throw new Error('AI is not ready yet. Please wait for setup to complete.');
      }
      return webllmService.generateResponse(messages, options);
    },
    [status]
  );

  const generateWebsite = useCallback(
    async (description: string, options: GenerateOptions = {}): Promise<string> => {
      if (status !== 'ready') {
        throw new Error('AI is not ready yet. Please wait for setup to complete.');
      }
      return webllmService.generateWebsite(description, options);
    },
    [status]
  );

  const generateComponent = useCallback(
    async (componentName: string, description: string, options: GenerateOptions = {}): Promise<string> => {
      if (status !== 'ready') {
        throw new Error('AI is not ready yet. Please wait for setup to complete.');
      }
      return webllmService.generateComponent(componentName, description, options);
    },
    [status]
  );

  const unload = useCallback(async (): Promise<void> => {
    await webllmService.unload();
    initializedRef.current = false;
  }, []);

  return {
    status,
    isReady: status === 'ready',
    isSettingUp: status === 'setting-up',
    progress,
    progressText,
    error,
    initialize,
    generate,
    generateWebsite,
    generateComponent,
    unload,
  };
}
