import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, FileText } from 'lucide-react';

const EXAMPLE_TEXTS = [
  {
    label: 'Compliant Text',
    text: 'This is a clean document without any personal information.',
  },
  {
    label: 'Email Violation',
    text: 'Please contact me at john.doe@example.com for more details.',
  },
  {
    label: 'Phone Violation',
    text: 'Call me at +1-555-123-4567 anytime.',
  },
  {
    label: 'Multiple Violations',
    text: 'Contact Sarah at sarah.jones@company.com or call (555) 987-6543.',
  },
  {
    label: 'SSN Example',
    text: 'My social security number is 123-45-6789.',
  },
];

export default function TextAnalyzer({ onAnalyze, isAnalyzing }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isAnalyzing) {
      onAnalyze(text);
    }
  };

  const loadExample = (exampleText) => {
    setText(exampleText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Input */}
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-dark-300 mb-2">
            Text to Analyze
          </label>
          <textarea
            id="text"
            rows={10}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter or paste text to check for compliance violations..."
            className="textarea-field font-mono text-sm"
            disabled={isAnalyzing}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-dark-400">
            <span>{text.length} characters</span>
            {text.length > 0 && (
              <button
                type="button"
                onClick={() => setText('')}
                className="text-danger-400 hover:text-danger-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Example Texts */}
        <div>
          <label className="block text-sm font-medium text-dark-300 mb-2">
            Quick Examples
          </label>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_TEXTS.map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={() => loadExample(example.text)}
                className="px-3 py-1.5 text-xs glass rounded-lg hover:bg-white/10 transition-all duration-200 text-dark-300 hover:text-dark-100"
                disabled={isAnalyzing}
              >
                {example.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!text.trim() || isAnalyzing}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Analyze Text</span>
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}