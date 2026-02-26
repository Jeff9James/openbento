/// <reference types="vite/client" />

// Environment variables
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_GEMINI_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// MDX/Markdown file imports
declare module '*.md' {
  import type { ComponentType } from 'react';
  const Component: ComponentType;
  export default Component;
}

declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType;
  export default Component;
}
