import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Shield,
  FileWarning,
  Info,
  Sparkles,
  Brain
} from 'lucide-react';

// Normalize a violation that may be a plain string or a structured object
function normalizeViolation(violation) {
  if (typeof violation === 'string') {
    // Determine severity from known keywords
    const lower = violation.toLowerCase();
    const severity =
      lower.includes('email') || lower.includes('phone') ? 'HIGH'
      : lower.includes('ssn') || lower.includes('credit') || lower.includes('passport') ? 'HIGH'
      : 'MEDIUM';

    return {
      rule: violation,          // e.g. "Email address detected"
      severity,
      description: violation,
    };
  }
  return violation;             // already an object, pass through
}

function SeverityBadge({ severity }) {
  const config = {
    HIGH: { class: 'badge-danger', icon: XCircle },
    MEDIUM: { class: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', icon: AlertTriangle },
    LOW: { class: 'badge-info', icon: Info },
  };

  const { class: badgeClass, icon: Icon } = config[severity] || config.MEDIUM;

  return (
    <span className={`badge ${badgeClass} flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      {severity}
    </span>
  );
}

function ConfidenceBar({ confidence }) {
  const percent = Math.round(confidence * 100);
  const color =
    percent >= 80 ? 'from-success-500 to-success-400' :
      percent >= 50 ? 'from-amber-500 to-amber-400' :
        'from-danger-500 to-danger-400';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-dark-400">Confidence</span>
        <span className="text-dark-200 font-semibold">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
    </div>
  );
}

function ViolationItem({ violation, index }) {
  const [expanded, setExpanded] = useState(false);
  const normalized = normalizeViolation(violation);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="glass rounded-lg p-4"
    >
      <div
        className="flex items-start justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">
            <FileWarning className="w-4 h-4 text-danger-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <p className="text-sm font-medium text-dark-100">
                {normalized.rule || normalized.rule_id || 'Unknown Rule'}
              </p>
              <SeverityBadge severity={normalized.severity || 'MEDIUM'} />
            </div>
            <p className="text-xs text-dark-400 line-clamp-2">
              {normalized.description || normalized.message || 'Compliance violation detected'}
            </p>
          </div>
        </div>
        <button className="p-1 ml-2 text-dark-400 hover:text-dark-200 transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-white/5 space-y-2"
          >
            {normalized.evidence && (
              <div>
                <p className="text-xs font-medium text-dark-300 mb-1">Evidence</p>
                <p className="text-xs text-dark-400 font-mono bg-dark-800/50 rounded-lg px-3 py-2 break-all">
                  "{normalized.evidence}"
                </p>
              </div>
            )}
            {normalized.location && (
              <div>
                <p className="text-xs font-medium text-dark-300 mb-1">Location</p>
                <p className="text-xs text-dark-400">{normalized.location}</p>
              </div>
            )}
            {normalized.recommendation && (
              <div>
                <p className="text-xs font-medium text-dark-300 mb-1">Recommendation</p>
                <p className="text-xs text-dark-400">{normalized.recommendation}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ResultsPanel({ result }) {
  const [showDetails, setShowDetails] = useState(false);
  const isCompliant = result.status === 'COMPLIANT';
  const violations = result.violations || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      {/* Status Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isCompliant ? 'bg-success-500/10' : 'bg-danger-500/10'}`}>
            {isCompliant ? (
              <CheckCircle2 className="w-6 h-6 text-success-400" />
            ) : (
              <XCircle className="w-6 h-6 text-danger-400" />
            )}
          </div>
          <div>
            <h3 className={`text-lg font-display font-bold ${isCompliant ? 'text-gradient-success' : 'text-gradient-danger'}`}>
              {isCompliant ? 'Compliant' : 'Non-Compliant'}
            </h3>
            <p className="text-xs text-dark-400">
              {isCompliant
                ? 'No violations detected'
                : `${violations.length} violation${violations.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
        </div>
        <div className={`${isCompliant ? 'badge-success' : 'badge-danger'}`}>
          {result.status}
        </div>
      </div>

      {/* Confidence */}
      {result.confidence != null && (
        <div className="mb-5">
          <ConfidenceBar confidence={result.confidence} />
        </div>
      )}

      {/* Explanation / Summary */}
      {(result.explanation || result.summary) && (
        <div className="mb-5 glass rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary-400" />
            <p className="text-sm font-medium text-dark-200">Summary</p>
          </div>
          <p className="text-sm text-dark-400 leading-relaxed">
            {result.explanation || result.summary}
          </p>
        </div>
      )}

      {/* Violations */}
      {violations.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-danger-400" />
            <h4 className="text-sm font-medium text-dark-200">Violations</h4>
          </div>
          <div className="space-y-2">
            {violations.map((violation, index) => (
              <ViolationItem
                key={index}
                violation={violation}
                index={index}
              />
            ))}
          </div>
        </div>
      )}

      {/* Agent Details Toggle */}
      {result.details && (
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between px-4 py-3 glass rounded-lg hover:bg-white/10 transition-all duration-200 text-sm text-dark-300"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary-400" />
              <span>Agent Details</span>
            </div>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 glass rounded-lg p-4"
              >
                <pre className="text-xs text-dark-400 font-mono whitespace-pre-wrap break-all overflow-x-auto">
                  {typeof result.details === 'string'
                    ? result.details
                    : JSON.stringify(result.details, null, 2)}
                </pre>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}