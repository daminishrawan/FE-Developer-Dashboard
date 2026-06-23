import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in Applet:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#09090b] text-zinc-150 flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-[#18181b] border border-[#27272a] rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3 text-rose-500 mb-4">
              <span className="text-2xl font-bold">⚠️</span>
              <h2 className="text-lg font-bold text-zinc-50">Applet Rendering Aborted</h2>
            </div>
            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              An unexpected script error occurred during runtime render cycles. We've caught it to prevent an empty blank screen.
            </p>
            <div className="p-3 bg-zinc-950 rounded-lg text-[11px] font-mono text-rose-450 overflow-x-auto border border-zinc-800/60 max-h-40">
              {this.state.error?.toString() || 'Unknown Script Error'}
            </div>
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                  } catch(e) {}
                  window.location.reload();
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer transition-colors"
              >
                Clear Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
