export default function parseInferResult(vec: number[]) {
  const first10 = vec.slice(0, 10).map(v => v.toFixed(6));

  const indexed = vec.map((score, idx) => ({ idx, score }));
  indexed.sort((a, b) => b.score - a.score);

  const top5 = indexed.slice(0, 5).map(x => ({
    idx: x.idx,
    score: x.score.toFixed(6),
  }));

  return { first10, top5 };
}