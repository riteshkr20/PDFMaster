
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ToolPage from './pages/ToolPage';
import SignaturePage from './pages/SignaturePage';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signature-generator" element={<SignaturePage />} />
          <Route path="/:toolId" element={<ToolPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
