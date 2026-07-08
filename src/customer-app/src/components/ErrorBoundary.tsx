import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  errorMessage: string;
  componentStack: string;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    errorMessage: '',
    componentStack: '',
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      errorMessage: error.message || 'An unexpected error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      componentStack: errorInfo.componentStack ?? '',
    });

    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleTryAgain = () => {
    this.setState({
      hasError: false,
      errorMessage: '',
      componentStack: '',
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="page">
          <h1 className="page-title">Something went wrong</h1>
          <p className="status-message error">
            We hit an unexpected error. You can try again or refresh the page.
          </p>
          <p className="status-message error">Error details: {this.state.errorMessage}</p>
          {this.state.componentStack ? (
            <pre className="error-stack">{this.state.componentStack}</pre>
          ) : null}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={this.handleTryAgain}>
              Try Again
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
