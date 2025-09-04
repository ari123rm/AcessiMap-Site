import React from 'react';

interface ScoreBarProps {
  label: string;
  score: number;
}

const ScoreBar = ({ label, score }: ScoreBarProps) => {
  const scoreColor = score > 70 ? '#4caf50' : score > 40 ? '#ff9800' : '#f44336';
  
  const barStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    marginBottom: '10px'
  };

  const progressStyle: React.CSSProperties = {
    width: `${score}%`,
    backgroundColor: scoreColor,
    height: '20px',
    borderRadius: '4px',
    textAlign: 'center',
    color: 'white',
    lineHeight: '20px'
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span>{label}</span>
        <strong>{score.toFixed(1)}</strong>
      </div>
      <div style={barStyle}>
        <div style={progressStyle}>{/* score.toFixed(1) */}</div>
      </div>
    </div>
  );
};

export default ScoreBar;