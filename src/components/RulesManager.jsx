import React, { useState, useEffect } from 'react';

export default function RulesManager() {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState('');

  useEffect(() => {
    // TODO: Fetch rules from API
  }, []);

  const handleAddRule = () => {
    if (newRule.trim()) {
      setRules([...rules, { id: Date.now(), name: newRule }]);
      setNewRule('');
    }
  };

  const handleDeleteRule = (id) => {
    setRules(rules.filter((rule) => rule.id !== id));
  };

  return (
    <div className="rules-manager">
      <h2>Rules Manager</h2>
      <div className="add-rule mb-4">
        <input
          type="text"
          value={newRule}
          onChange={(e) => setNewRule(e.target.value)}
          placeholder="Enter new rule..."
          className="p-2 border rounded"
        />
        <button onClick={handleAddRule} className="ml-2 px-4 py-2 bg-green-500 text-white rounded">
          Add Rule
        </button>
      </div>
      <ul className="rules-list">
        {rules.map((rule) => (
          <li key={rule.id} className="flex justify-between items-center p-2 border-b">
            <span>{rule.name}</span>
            <button
              onClick={() => handleDeleteRule(rule.id)}
              className="px-2 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
