import React from 'react';

const isChunkError = (error) =>
  error?.message?.includes('dynamically imported module') ||
  error?.message?.includes('Failed to fetch') ||
  error?.message?.includes('Loading chunk') ||
  error?.name === 'ChunkLoadError';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, isChunk: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error, isChunk: isChunkError(error) };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
    // Chunk load error = stale cache after new deploy. Auto-reload once.
    if (isChunkError(error)) {
      const reloaded = sessionStorage.getItem('chunk_reload');
      if (!reloaded) {
        sessionStorage.setItem('chunk_reload', '1');
        window.location.reload();
      }
    }
  }

  render() {
    if (this.state.hasError) {
      const { isChunk } = this.state;
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
            <div className="text-4xl mb-4">{isChunk ? '🔄' : '⚠️'}</div>
            <h2 className="text-lg font-black text-slate-200 mb-2">
              {isChunk ? 'New version deployed — reloading...' : 'Something went wrong'}
            </h2>
            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
              {isChunk
                ? 'A new version was deployed. Click Reload to get the latest.'
                : (this.state.error?.message || 'An unexpected error occurred.')}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  sessionStorage.removeItem('chunk_reload');
                  window.location.reload();
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
              >
                {isChunk ? '🔄 Reload' : 'Try Again'}
              </button>
              <button
                onClick={() => {
                  sessionStorage.removeItem('chunk_reload');
                  window.location.href = '/';
                }}
                className="px-5 py-2.5 rounded-xl font-bold text-sm border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
