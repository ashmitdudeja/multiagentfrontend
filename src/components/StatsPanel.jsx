import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

export default function StatsPanel({ stats }) {
  const complianceRate = stats.totalAnalyses > 0 
    ? Math.round((stats.compliant / stats.totalAnalyses) * 100) 
    : 0;
  
  const avgConfidencePercent = Math.round(stats.avgConfidence * 100);

  const statCards = [
    {
      icon: Activity,
      label: 'Total Analyses',
      value: stats.totalAnalyses,
      color: 'primary',
    },
    {
      icon: CheckCircle2,
      label: 'Compliant',
      value: stats.compliant,
      color: 'success',
    },
    {
      icon: XCircle,
      label: 'Non-Compliant',
      value: stats.nonCompliant,
      color: 'danger',
    },
    {
      icon: TrendingUp,
      label: 'Avg Confidence',
      value: `${avgConfidencePercent}%`,
      color: 'primary',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="card"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl bg-${stat.color}-500/10`}>
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-100">{stat.value}</p>
              <p className="text-xs text-dark-400">{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}