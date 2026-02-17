export const RULE_TEMPLATES = {
  healthcare: [
    {
      id: 'no_ssn',
      name: 'Social Security Number',
      description: 'Detects US Social Security Numbers in format XXX-XX-XXXX',
      pattern: '\\d{3}-\\d{2}-\\d{4}',
      enabled: true,
      category: 'Healthcare',
    },
    {
      id: 'no_phi',
      name: 'Protected Health Information',
      description: 'Detects medical diagnoses, medications, prescriptions, or health conditions that could be PHI under HIPAA',
      enabled: true,
      category: 'Healthcare',
    },
    {
      id: 'no_medical_id',
      name: 'Medical Record Number',
      description: 'Detects patient ID numbers or medical record numbers',
      pattern: 'MRN[\\s:-]?\\d{6,}',
      enabled: true,
      category: 'Healthcare',
    },
  ],
  
  finance: [
    {
      id: 'no_credit_card',
      name: 'Credit Card Number',
      description: 'Detects credit card numbers (Visa, Mastercard, Amex, Discover)',
      pattern: '\\b(?:\\d{4}[\\s-]?){3}\\d{4}\\b',
      enabled: true,
      category: 'Finance',
    },
    {
      id: 'no_bank_account',
      name: 'Bank Account Information',
      description: 'Detects bank account numbers and routing numbers',
      enabled: true,
      category: 'Finance',
    },
    {
      id: 'no_ssn',
      name: 'Social Security Number',
      description: 'Detects US SSN in various formats',
      pattern: '\\b\\d{3}-?\\d{2}-?\\d{4}\\b',
      enabled: true,
      category: 'Finance',
    },
  ],
  
  government: [
    {
      id: 'no_ssn',
      name: 'Social Security Number',
      description: 'Detects US Social Security Numbers',
      pattern: '\\d{3}-\\d{2}-\\d{4}',
      enabled: true,
      category: 'Government',
    },
    {
      id: 'no_passport',
      name: 'Passport Number',
      description: 'Detects US passport numbers',
      pattern: '[A-Z]\\d{9}',
      enabled: true,
      category: 'Government',
    },
    {
      id: 'no_classified',
      name: 'Classified Information',
      description: 'Detects content marked as confidential, secret, or top secret',
      enabled: true,
      category: 'Government',
    },
  ],
  
  technology: [
    {
      id: 'no_api_keys',
      name: 'API Keys & Tokens',
      description: 'Detects API keys, access tokens, and secret keys',
      pattern: '(?:sk-|pk-|key-|token-|secret-)[a-zA-Z0-9]{20,}',
      enabled: true,
      category: 'Technology',
    },
    {
      id: 'no_ip_address',
      name: 'IP Address',
      description: 'Detects IPv4 addresses',
      pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
      enabled: true,
      category: 'Technology',
    },
    {
      id: 'no_aws_keys',
      name: 'AWS Access Keys',
      description: 'Detects AWS access keys and secrets',
      pattern: 'AKIA[0-9A-Z]{16}',
      enabled: true,
      category: 'Technology',
    },
  ],
  
  general: [
    {
      id: 'no_profanity',
      name: 'Inappropriate Language',
      description: 'Detects profanity, offensive language, or discriminatory content',
      enabled: true,
      category: 'General',
    },
    {
      id: 'no_url',
      name: 'URLs',
      description: 'Detects website URLs',
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b',
      enabled: true,
      category: 'General',
    },
  ],
};

export const getAllRuleTemplates = () => {
  return Object.values(RULE_TEMPLATES).flat();
};

export const getRulesByCategory = (category) => {
  return RULE_TEMPLATES[category] || [];
};

export const getCategoryList = () => {
  return Object.keys(RULE_TEMPLATES);
};