import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { PHILOSOPHER_META } from '../data/philosophers';

export default function Result({ result, onRestart }) {
  if (!result || result.type === 'pluralistic') {
    return (
      <div className="card fade-in">
        <h1 className="title">多元思想者</h1>
        <p className="subtitle">{result?.message || '你的思想图谱很独特，像是多种思想流派的结合体。'}</p>
        <button className="primary-btn" onClick={onRestart}>重新测试</button>
      </div>
    );
  }

  const meta = PHILOSOPHER_META[result.name];
  
  // 转换用户向量数据以适应 Recharts 雷达图格式
  const dimensionLabels = {
    D1: '理性', D2: '理想', D3: '行动', D4: '个体',
    D5: '情感', D6: '批判', D7: '存在', D8: '共情'
  };

  const radarData = Object.keys(result.userVector).map(key => ({
    subject: dimensionLabels[key],
    A: result.userVector[key],
    fullMark: 10,
  }));

  return (
    <div className="card fade-in result-card">
      {result.type === 'hidden' && <div className="badge">✦ 稀有隐藏人格 ✦</div>}
      
      <h1 className="title">{result.name}</h1>
      <h3 className="tag">「 {meta.tag} 」</h3>
      <blockquote className="quote">"{meta.quote}"</blockquote>
      
      <div className="radar-container">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
            <PolarGrid stroke="#e0e0e0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#555', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar name="我的精神维度" dataKey="A" stroke="#333" fill="#333" fillOpacity={0.2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="meta-info">
        <p><strong>代表作：</strong>{meta.work}</p>
        <p><strong>相似度：</strong>{(result.matchScore * 100).toFixed(1)}%</p>
      </div>

      <div className="action-buttons">
        <button className="primary-btn" onClick={() => window.print()}>保存我的图鉴</button>
        <button className="text-btn" onClick={onRestart}>重新探索</button>
      </div>
    </div>
  );
}
