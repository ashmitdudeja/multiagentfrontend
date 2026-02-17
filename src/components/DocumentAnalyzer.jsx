import React, { useState } from 'react';

export default function DocumentAnalyzer() {
  const [document, setDocument] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocument(file);
      // TODO: Implement document analysis logic
    }
  };

  return (
    <div className="document-analyzer">
      <h2>Document Analyzer</h2>
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".pdf,.doc,.docx,.txt"
        className="block my-2"
      />
      {document && <p>File selected: {document.name}</p>}
      {analysis && <div className="analysis mt-4">{/* Display analysis */}</div>}
    </div>
  );
}
