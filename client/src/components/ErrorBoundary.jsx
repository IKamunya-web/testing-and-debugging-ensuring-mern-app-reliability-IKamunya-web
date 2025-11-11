import React from 'react';
import PropTypes from 'prop-types';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    const errorCount = this.state.errorCount + 1;
    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // You can also log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            border: '2px solid #d32f2f',
            borderRadius: '4px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred in the application.</p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
              <summary>Error details (development only)</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </details>
          )}
          <button
            onClick={this.resetError}
            style={{
              marginTop: '10px',
              padding: '8px 16px',
              backgroundColor: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Try Again
          </button>
          {this.props.showErrorCount && (
            <p style={{ marginTop: '10px', fontSize: '12px' }}>
              Error count: {this.state.errorCount}
            </p>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onError: PropTypes.func,
  showErrorCount: PropTypes.bool
};

ErrorBoundary.defaultProps = {
  onError: null,
  showErrorCount: false
};

export default ErrorBoundary;
