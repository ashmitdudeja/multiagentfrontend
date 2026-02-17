import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronDown,
  ChevronUp,
  Sparkles,
  Code,
  Brain
} from 'lucide-react';
import { getAllRuleTemplates, getCategoryList, getRulesByCategory } from '../data/ruleTemplates';

export default function RulesManager({ customRules, setCustomRules, useDefaultRules, setUseDefaultRules }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [newRule, setNewRule] = useState({
    id: '',
    name: '',
    description: '',
    pattern: '',
    enabled: true,
  });
  const [isAddingRule, setIsAddingRule] = useState(false);

  const addCustomRule = () => {
    if (newRule.id && newRule.name && newRule.description) {
      setCustomRules([...customRules, { ...newRule, id: newRule.id.toLowerCase().replace(/\s+/g, '_') }]);
      setNewRule({ id: '', name: '', description: '', pattern: '', enabled: true });
      setIsAddingRule(false);
    }
  };

  const removeRule = (id) => {
    setCustomRules(customRules.filter(rule => rule.id !== id));
  };

  const toggleRule = (id) => {
    setCustomRules(customRules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const addTemplateRule = (template) => {
    const exists = customRules.some(rule => rule.id === template.id);
    if (!exists) {
      setCustomRules([...customRules, { ...template }]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="card sticky top-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary-400" />
          <h3 className="text-lg font-display font-semibold text-dark-100">
            Compliance Rules
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 glass rounded-lg hover:bg-white/10 transition-all duration-200 text-dark-300"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Default Rules Toggle */}
            <div className="glass rounded-lg p-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-500/10 rounded-lg">
                    <Sparkles className="w-4 h-4 text-primary-400" />
                  </div>
                  <div>
                    <p className="font-medium text-dark-100 text-sm">Default Rules</p>
                    <p className="text-xs text-dark-400">Email & Phone Detection</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={useDefaultRules}
                    onChange={(e) => setUseDefaultRules(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-dark-700 rounded-full peer peer-checked:bg-primary-500 transition-colors duration-200"></div>
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-5"></div>
                </div>
              </label>
            </div>

            {/* Custom Rules List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-dark-300">Custom Rules ({customRules.length})</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-xs px-3 py-1.5 glass rounded-lg hover:bg-white/10 transition-all duration-200 text-dark-300"
                  >
                    Templates
                  </button>
                  <button
                    onClick={() => setIsAddingRule(!isAddingRule)}
                    className="text-xs px-3 py-1.5 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-all duration-200 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    New
                  </button>
                </div>
              </div>

              {/* Templates Modal */}
              <AnimatePresence>
                {showTemplates && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-3 glass rounded-lg p-4 max-h-64 overflow-y-auto scrollbar-hide"
                  >
                    <h5 className="text-xs font-semibold text-dark-300 mb-2">Rule Templates</h5>
                    <div className="space-y-2">
                      {getCategoryList().map(category => (
                        <div key={category}>
                          <p className="text-xs text-dark-400 uppercase tracking-wider mb-1">{category}</p>
                          {getRulesByCategory(category).map(template => {
                            const exists = customRules.some(r => r.id === template.id);
                            return (
                              <button
                                key={template.id}
                                onClick={() => addTemplateRule(template)}
                                disabled={exists}
                                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all duration-200 flex items-center justify-between ${
                                  exists 
                                    ? 'bg-dark-700/50 text-dark-500 cursor-not-allowed' 
                                    : 'glass hover:bg-white/10 text-dark-300'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {template.pattern ? (
                                    <Code className="w-3 h-3 text-primary-400" />
                                  ) : (
                                    <Brain className="w-3 h-3 text-success-400" />
                                  )}
                                  <span>{template.name}</span>
                                </div>
                                {exists && <span className="text-xs">Added</span>}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add New Rule Form */}
              <AnimatePresence>
                {isAddingRule && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 glass rounded-lg p-4 space-y-3"
                  >
                    <input
                      type="text"
                      placeholder="Rule ID (e.g., no_ssn)"
                      value={newRule.id}
                      onChange={(e) => setNewRule({ ...newRule, id: e.target.value })}
                      className="input-field text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Rule Name"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                      className="input-field text-sm"
                    />
                    <textarea
                      placeholder="Description (what this rule detects)"
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                      className="textarea-field text-sm"
                      rows={2}
                    />
                    <input
                      type="text"
                      placeholder="Pattern (optional regex)"
                      value={newRule.pattern}
                      onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                      className="input-field text-sm font-mono"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={addCustomRule}
                        className="flex-1 px-3 py-2 bg-primary-500/20 text-primary-400 rounded-lg hover:bg-primary-500/30 transition-all duration-200 text-sm"
                      >
                        Add Rule
                      </button>
                      <button
                        onClick={() => setIsAddingRule(false)}
                        className="px-3 py-2 glass rounded-lg hover:bg-white/10 transition-all duration-200 text-sm text-dark-300"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Rules List */}
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-hide">
                <AnimatePresence>
                  {customRules.map((rule) => (
                    <motion.div
                      key={rule.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`glass rounded-lg p-3 transition-all duration-200 ${
                        rule.enabled ? '' : 'opacity-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {rule.pattern ? (
                              <Code className="w-3 h-3 text-primary-400" />
                            ) : (
                              <Brain className="w-3 h-3 text-success-400" />
                            )}
                            <p className="text-sm font-medium text-dark-100">{rule.name}</p>
                          </div>
                          <p className="text-xs text-dark-400 line-clamp-2">{rule.description}</p>
                          {rule.pattern && (
                            <p className="text-xs text-primary-400 font-mono mt-1 truncate">/{rule.pattern}/</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button
                            onClick={() => toggleRule(rule.id)}
                            className="p-1.5 glass rounded hover:bg-white/10 transition-all duration-200"
                          >
                            {rule.enabled ? (
                              <Eye className="w-3.5 h-3.5 text-success-400" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-dark-400" />
                            )}
                          </button>
                          <button
                            onClick={() => removeRule(rule.id)}
                            className="p-1.5 glass rounded hover:bg-danger-500/20 transition-all duration-200 text-dark-400 hover:text-danger-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {customRules.length === 0 && (
                  <div className="text-center py-8 text-dark-400 text-sm">
                    <p>No custom rules added yet</p>
                    <p className="text-xs mt-1">Click "New" or "Templates" to add rules</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}