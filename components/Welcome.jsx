import React from 'react';

export default function Welcome({ onStart }) {
  return (
    <div className="card fade-in">
      <h1 className="title">50位思想家：寻找你的精神镜像</h1>
      <p className="subtitle">
        这不是一个简单的性格测试，而是一次跨越时空的思想对话。
        <br />
        共25道情境选择题，预计耗时5-8分钟。
      </p>
      <button className="primary-btn" onClick={onStart}>
        开始探索
      </button>
    </div>
  );
}
