// src/ErrorBoundary.jsx
// Description: React class-based error boundary that catches runtime errors and shows a recovery UI.

import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("🚨 App Runtime Crash:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-red-50 flex flex-col items-center justify-center p-8 text-center border-t-8 border-red-500">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg border border-red-100">
            <span className="text-4xl mb-4 block">⚠️</span>
            <h1 className="text-2xl font-bold text-red-600 mb-2">ระบบเกิดข้อผิดพลาด (System Crash)</h1>
            <p className="text-gray-600 mb-6 text-sm">แอปพลิเคชันของคุณพบปัญหาในระหว่างการรัน โค้ดถูกจับไว้โดย Error Boundary เพื่อป้องกันหน้าจอขาว (White Screen of Death)</p>
            <div className="bg-gray-100 p-4 rounded-xl text-left overflow-auto max-h-40">
              <code className="text-xs text-red-500 font-mono">{this.state.error?.toString()}</code>
            </div>
            <button onClick={() => window.location.reload()} className="mt-6 w-full bg-red-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-red-600 transition-colors">
              รีโหลดแอปพลิเคชัน
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
