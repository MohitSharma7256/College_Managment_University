import React from "react";

// Simple test component to verify app renders
const TestApp = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>College Management System</h1>
      <p>App is working! This is a test component.</p>
      <button onClick={() => alert('Button clicked!')}>Test Button</button>
    </div>
  );
};

const App = () => {
  return <TestApp />;
};

export default App;
