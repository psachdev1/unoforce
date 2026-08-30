import type { LeadAction } from "@/lib/coach";

const stageLabel = {
  hot: "Ready now",
  warm: "Keep moving",
  nurture: "Re-open",
  waiting: "Waiting",
};

export function DailyBrief({ actions }: { actions: LeadAction[] }) {
  return (
    <div className="brief-sheet" aria-label="Today's priority leads">
      <div className="brief-header">
        <div>
          <span className="brief-kicker">Today’s field brief</span>
          <strong>{actions.length} conversations worth moving</strong>
        </div>
        <time>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date())}</time>
      </div>
      <ol className="lead-actions">
        {actions.map((action, index) => (
          <li key={action.name}>
            <span className="rank">{String(index + 1).padStart(2, "0")}</span>
            <div className="lead-main">
              <div className="lead-title">
                <strong>{action.name}</strong>
                <span data-stage={action.stage}>{stageLabel[action.stage]}</span>
              </div>
              <p>{action.reason}</p>
              <div className="next-move">
                <span>Next move</span>
                <strong>{action.nextAction}</strong>
              </div>
            </div>
            <span className="due">{action.due}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
