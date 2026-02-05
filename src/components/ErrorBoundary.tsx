import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: string | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('[3D Render Error]', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-[#1A1F2A]">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-2xl">!</span>
            </div>
            <h2 className="text-white text-lg font-semibold mb-2">Rendering Error</h2>
            <p className="text-white/60 text-sm mb-4">
              The 3D scene failed to render. This may be due to WebGL not being supported.
            </p>
            <p className="text-white/40 text-xs font-mono bg-white/5 rounded p-3 break-all">
              {this.state.error}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
