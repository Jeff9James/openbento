import * as webllm from '@mlc-ai/web-llm';

export interface WebLLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  onUpdate?: (partial: string) => void;
}

export type SetupStatus = 'idle' | 'setting-up' | 'ready' | 'error';

class WebLLMService {
  private engine: webllm.MLCEngineInterface | null = null;
  private status: SetupStatus = 'idle';
  private statusListeners: ((status: SetupStatus) => void)[] = [];
  private progressListeners: ((progress: webllm.InitProgressReport) => void)[] = [];

  // Best model for website creation/coding tasks - Qwen2.5-Coder 1.5B
  // Good balance of quality and resource usage (~1.6GB VRAM)
  private readonly MODEL_ID = 'Qwen2.5-Coder-1.5B-Instruct-q4f16_1-MLC';

  public getStatus(): SetupStatus {
    return this.status;
  }

  public onStatusChange(listener: (status: SetupStatus) => void): () => void {
    this.statusListeners.push(listener);
    return () => {
      this.statusListeners = this.statusListeners.filter((l) => l !== listener);
    };
  }

  public onProgress(listener: (progress: webllm.InitProgressReport) => void): () => void {
    this.progressListeners.push(listener);
    return () => {
      this.progressListeners = this.progressListeners.filter((l) => l !== listener);
    };
  }

  private setStatus(status: SetupStatus): void {
    this.status = status;
    this.statusListeners.forEach((listener) => listener(status));
  }

  private notifyProgress(progress: webllm.InitProgressReport): void {
    this.progressListeners.forEach((listener) => listener(progress));
  }

  public async initialize(): Promise<void> {
    if (this.engine) {
      return;
    }

    try {
      this.setStatus('setting-up');

      const initProgressCallback = (progress: webllm.InitProgressReport) => {
        this.notifyProgress(progress);
      };

      this.engine = await webllm.CreateMLCEngine(this.MODEL_ID, {
        initProgressCallback,
      });

      this.setStatus('ready');
    } catch (error) {
      console.error('Failed to initialize WebLLM:', error);
      this.setStatus('error');
      throw error;
    }
  }

  public async generateResponse(
    messages: WebLLMMessage[],
    options: GenerateOptions = {}
  ): Promise<string> {
    if (!this.engine) {
      throw new Error('WebLLM not initialized. Call initialize() first.');
    }

    if (this.status !== 'ready') {
      throw new Error('WebLLM is not ready. Current status: ' + this.status);
    }

    const { temperature = 0.7, maxTokens = 2048, stream = true, onUpdate } = options;

    try {
      if (stream && onUpdate) {
        const completion = await this.engine.chat.completions.create({
          messages: messages as webllm.ChatCompletionMessageParam[],
          temperature,
          max_tokens: maxTokens,
          stream: true,
          stream_options: { include_usage: true },
        });

        let fullResponse = '';
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || '';
          fullResponse += content;
          onUpdate(fullResponse);
        }
        return fullResponse;
      } else {
        const completion = await this.engine.chat.completions.create({
          messages: messages as webllm.ChatCompletionMessageParam[],
          temperature,
          max_tokens: maxTokens,
          stream: false,
        });
        return completion.choices[0]?.message?.content || '';
      }
    } catch (error) {
      console.error('Error generating response:', error);
      throw error;
    }
  }

  public async generateWebsite(
    description: string,
    options: Omit<GenerateOptions, 'maxTokens'> & { maxTokens?: number } = {}
  ): Promise<string> {
    const systemPrompt = `You are an expert web developer specializing in React, TypeScript, and modern CSS. 
Your task is to generate clean, responsive, and modern website code based on the user's description.
Always provide complete, working code with proper structure and best practices.
Use Tailwind CSS for styling when appropriate.
Include comments explaining key parts of the code.`;

    const userPrompt = `Create a website based on this description:

${description}

Please provide:
1. A React component (TypeScript) for the main page
2. Any additional components needed
3. CSS/styling using Tailwind classes
4. Make it responsive and visually appealing

Return the code in a single file format that can be used directly.`;

    const messages: WebLLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return this.generateResponse(messages, {
      ...options,
      maxTokens: 4096,
      temperature: 0.8,
    });
  }

  public async generateComponent(
    componentName: string,
    description: string,
    options: Omit<GenerateOptions, 'maxTokens'> & { maxTokens?: number } = {}
  ): Promise<string> {
    const systemPrompt = `You are an expert React and TypeScript developer.
Create clean, reusable, and well-typed React components.
Use modern React patterns (functional components, hooks).
Style with Tailwind CSS classes.
Include PropTypes or TypeScript interfaces for props.`;

    const userPrompt = `Create a React component named "${componentName}" based on this description:

${description}

Requirements:
- Use TypeScript
- Make it reusable with props
- Include proper types/interfaces
- Use Tailwind CSS for styling
- Add comments for complex logic

Return only the component code.`;

    const messages: WebLLMMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    return this.generateResponse(messages, {
      ...options,
      maxTokens: 2048,
      temperature: 0.7,
    });
  }

  public async unload(): Promise<void> {
    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
      this.setStatus('idle');
    }
  }

  public isReady(): boolean {
    return this.status === 'ready' && this.engine !== null;
  }
}

export const webllmService = new WebLLMService();
