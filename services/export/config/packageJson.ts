/**
 * Generate package.json for exported project with PWA support
 */

export const generatePackageJson = (name: string): string => {
  const safeName = name.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  return JSON.stringify(
    {
      name: safeName || 'my-bento',
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        'react-helmet-async': '^2.0.5',
        'lucide-react': '^0.460.0',
        'react-icons': '^5.3.0',
      },
      devDependencies: {
        '@types/react': '^18.3.12',
        '@types/react-dom': '^18.3.1',
        '@vitejs/plugin-react': '^4.3.3',
        autoprefixer: '^10.4.20',
        postcss: '^8.4.49',
        tailwindcss: '^3.4.15',
        typescript: '^5.6.3',
        vite: '^5.4.11',
        'vite-plugin-pwa': '^0.21.1',
      },
    },
    null,
    2
  );
};
