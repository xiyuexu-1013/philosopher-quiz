import { PHILOSOPHER_VECTORS } from './philosophers.js';
import { QUESTION_MAPPING } from './questions.js';

export const DIMENSION_WEIGHTS = {
  D1: 1.2,
  D2: 1.0,
  D3: 0.9,
  D4: 1.2,
  D5: 1.0,
  D6: 1.1,
  D7: 1.0,
  D8: 0.9,
};

const DIMENSION_KEYS = ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'];

function computeMaxScores() {
  const maxScores = Object.fromEntries(DIMENSION_KEYS.map((d) => [d, 0]));
  for (const q of Object.values(QUESTION_MAPPING)) {
    for (const choice of Object.values(q)) {
      for (const [dim, score] of Object.entries(choice)) {
        maxScores[dim] = Math.max(maxScores[dim], maxScores[dim] + score);
      }
    }
    const perQuestionMax = Object.fromEntries(DIMENSION_KEYS.map((d) => [d, 0]));
    for (const choice of Object.values(q)) {
      for (const [dim, score] of Object.entries(choice)) {
        perQuestionMax[dim] += score;
      }
    }
    for (const dim of DIMENSION_KEYS) {
      maxScores[dim] = Math.max(maxScores[dim], perQuestionMax[dim]);
    }
  }
  const perQuestionMaxByDim = Object.fromEntries(DIMENSION_KEYS.map((d) => [d, 0]));
  for (const q of Object.values(QUESTION_MAPPING)) {
    for (const dim of DIMENSION_KEYS) {
      let best = 0;
      for (const choice of Object.values(q)) {
        best = Math.max(best, choice[dim] || 0);
      }
      perQuestionMaxByDim[dim] += best;
    }
  }
  return perQuestionMaxByDim;
}

const MAX_SCORES = computeMaxScores();

export function calculateUserVector(answers) {
  const userVector = Object.fromEntries(DIMENSION_KEYS.map((d) => [d, 0]));

  for (const [qId, choice] of Object.entries(answers)) {
    const mapping = QUESTION_MAPPING[qId]?.[choice];
    if (!mapping) continue;
    for (const [dim, score] of Object.entries(mapping)) {
      userVector[dim] += score;
    }
  }

  for (const dim of DIMENSION_KEYS) {
    const max = MAX_SCORES[dim] || 1;
    userVector[dim] = Math.min(10, (userVector[dim] / max) * 10);
  }

  return userVector;
}

export function cosineSimilarity(vecA, vecB, weights = DIMENSION_WEIGHTS) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const d of DIMENSION_KEYS) {
    const w = weights[d] ?? 1;
    dot += w * vecA[d] * vecB[d];
    normA += w * vecA[d] ** 2;
    normB += w * vecB[d] ** 2;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function findBestMatch(userVector) {
  const scores = {};
  for (const [name, philVec] of Object.entries(PHILOSOPHER_VECTORS)) {
    scores[name] = cosineSimilarity(userVector, philVec);
  }
  return Object.entries(scores).sort((a, b) => b[1] - a[1]);
}

export function resolveTie(matches, threshold = 0.01) {
  if (matches.length < 2) {
    return { name: matches[0][0], tie: false };
  }
  if (matches[0][1] - matches[1][1] < threshold) {
    const chosen = Math.random() < 0.5 ? matches[0][0] : matches[1][0];
    return {
      name: chosen,
      tie: true,
      tiedWith: [matches[0][0], matches[1][0]],
    };
  }
  return { name: matches[0][0], tie: false };
}

export function getFinalResult(answers) {
  const userVector = calculateUserVector(answers);
  const matches = findBestMatch(userVector);

  if (matches[0][1] < 0.3) {
    return {
      type: 'pluralistic',
      message: '你的思想图谱很独特，像是多种思想流派的结合体。',
      top3: matches.slice(0, 3).map((m) => m[0]),
      scores: Object.fromEntries(matches.slice(0, 3).map((m) => [m[0], round(m[1])])),
      userVector,
    };
  }

  if (Math.random() < 0.05) {
    return {
      type: 'hidden',
      name: '苏格拉底',
      matchScore: round(matches[0][1]),
      alternative: matches[0][0],
      top3: matches.slice(0, 3).map((m) => m[0]),
      userVector,
    };
  }

  const tieResult = resolveTie(matches);
  const score = matches.find((m) => m[0] === tieResult.name)[1];

  return {
    type: 'normal',
    name: tieResult.name,
    matchScore: round(score),
    tie: tieResult.tie,
    tiedWith: tieResult.tiedWith || [],
    top3: matches.slice(0, 3).map((m) => m[0]),
    top3Scores: Object.fromEntries(matches.slice(0, 3).map((m) => [m[0], round(m[1])])),
    userVector,
  };
}

function round(n) {
  return Math.round(n * 1000) / 1000;
}

export function getConfidenceLabel(score) {
  if (score >= 0.7) return { level: 'high', text: '精准匹配' };
  if (score >= 0.5) return { level: 'medium', text: '你的思想中有多种流派的影子' };
  return { level: 'low', text: '你与多位思想家都有共鸣' };
}
