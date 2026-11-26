export const scoreTone = (s: number) => (s >= 8 ? 'good' : s >= 5 ? 'mid' : 'low')

export default function ScoreBadge({ score }: { score: number }) {
  return <span className={`score-badge ${scoreTone(score)}`}>{score}</span>
}

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('he-IL', {
    weekday: 'short',
    day: 'numeric',
    month: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
