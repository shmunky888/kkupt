// App.jsx
// Description: Thin application entry-point. Wraps MainApp inside ErrorBoundary.
// All business logic and UI live in src/. This file is fetched and transpiled by index.html.

import React from 'react';
import ErrorBoundary from './src/ErrorBoundary.jsx';
import MainApp from './src/MainApp.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
