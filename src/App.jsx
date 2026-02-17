import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { 
  Shield, 
  FileText, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Sparkles,
  Activity,
  Server
} from 'lucide-react';
import TextAnalyzer from './components/TextAnalyzer';
import DocumentAnalyzer from './components/DocumentAnalyzer';
import RulesManager from './components/RulesManager';
import ResultsPanel from './components/ResultsPanel';
import StatsPanel from './components/StatsPanel';
import { complianceAPI } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [customRules, setCustomRules] = useState([]);
  const [useDefaultRules, setUseDefaultRules] = useState(true);
  const [healthStatus, setHealthStatus] = useState(null);
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    compliant: 0,
    nonCompliant: 0,
    avgConfidence: 0,
  });

  // Check health on mount
  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await complianceAPI.healthCheck();
      setHealthStatus(health);
      toast.success('Connected to compliance service', {
        icon: '🟢',
        duration: 2000,
      });
    } catch (error) {
      toast.error('Failed to connect to compliance service', {
        icon: '🔴',
      });
      setHealthStatus({ status: 'unhealthy' });
    }
  };

  const handleAnalysis = async (text, type = 'text') => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await complianceAPI.analyzeText(
        text,
        customRules.filter(r => r.enabled),
        useDefaultRules
      );

      setResult(response);
      
      // Update stats
      setStats(prev => ({
        totalAnalyses: prev.totalAnalyses + 1,
        compliant: prev.compliant + (response.status === 'COMPLIANT' ? 1 : 0),
        nonCompliant: prev.nonCompliant + (response.status === 'NON_COMPLIANT' ? 1 : 0),
        avgConfidence: ((prev.avgConfidence * prev.totalAnalyses) + response.confidence) / (prev.totalAnalyses + 1),
      }));

      if (response.status === 'COMPLIANT') {
        toast.success('Analysis complete: Compliant ✅', {
          duration: 3000,
        });
      } else {
        toast.error(`Analysis complete: ${response.violations.length} violation(s) found`, {
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error(error.message || 'Analysis failed. Please try again.', {
        duration: 5000,
      });
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDocumentAnalysis = async (file) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await complianceAPI.analyzeDocument(
        file,
        customRules.filter(r => r.enabled),
        useDefaultRules
      );

      setResult(response);
      
      // Update stats
      setStats(prev => ({
        totalAnalyses: prev.totalAnalyses + 1,
        compliant: prev.compliant + (response.status === 'COMPLIANT' ? 1 : 0),
        nonCompliant: prev.nonCompliant + (response.status === 'NON_COMPLIANT' ? 1 : 0),
        avgConfidence: ((prev.avgConfidence * prev.totalAnalyses) + response.confidence) / (prev.totalAnalyses + 1),
      }));

      if (response.status === 'COMPLIANT') {
        toast.success('Document analysis complete: Compliant ✅');
      } else {
        toast.error(`Document analysis: ${response.violations.length} violation(s) found`);
      }
    } catch (error) {
      toast.error(error.message || 'Document analysis failed.');
      console.error('Document analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Animated background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-danger-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-glow">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gradient">
                  Compliance Checker AI
                </h1>
                <p className="text-sm text-dark-400">Multi-agent compliance validation system</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 glass rounded-lg">
                <Server className={`w-4 h-4 ${healthStatus?.status === 'healthy' ? 'text-success-400' : 'text-danger-400'}`} />
                <span className="text-sm text-dark-300">
                  {healthStatus?.status === 'healthy' ? 'Online' : 'Offline'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Input */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats */}
            <StatsPanel stats={stats} />

            {/* Tab Selector */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'text'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
                      : 'glass hover:bg-white/10 text-dark-300'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Text Analysis
                </button>
                <button
                  onClick={() => setActiveTab('document')}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                    activeTab === 'document'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-glow'
                      : 'glass hover:bg-white/10 text-dark-300'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  Document Upload
                </button>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'text' && (
                  <TextAnalyzer
                    key="text"
                    onAnalyze={handleAnalysis}
                    isAnalyzing={isAnalyzing}
                  />
                )}
                {activeTab === 'document' && (
                  <DocumentAnalyzer
                    key="document"
                    onAnalyze={handleDocumentAnalysis}
                    isAnalyzing={isAnalyzing}
                  />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Results */}
            {result && (
              <ResultsPanel result={result} />
            )}
          </div>

          {/* Right Column - Rules */}
          <div className="space-y-6">
            <RulesManager
              customRules={customRules}
              setCustomRules={setCustomRules}
              useDefaultRules={useDefaultRules}
              setUseDefaultRules={setUseDefaultRules}
            />
          </div>
        </div>
      </main>


    </div>
  );
}

export default App;