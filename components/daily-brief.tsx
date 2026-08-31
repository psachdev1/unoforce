import type { LeadAction, Workstream } from "@/lib/coach";

const groups: { key: Workstream; label: string; note: string }[] = [
  { key: "active_opportunity", label: "Active opportunities", note: "Protect momentum" },
  { key: "new_outreach", label: "New outreach", note: "Start conversations" },
  { key: "warm_nurture", label: "Warm nurture", note: "Stay relevant" },
  { key: "overdue", label: "Overdue", note: "Close the loop" },
];

const stageLabel = {
  hot: "Ready now",
  warm: "Keep moving",
  nurture: "Re-open",
  waiting: "Waiting",
};

export function DailyBrief({ actions, onStart }: { actions: LeadAction[]; onStart: (name: string) => void }) {
  return (
    <div className="brief-sheet" aria-label="Today's sales plan">
      <div className="brief-header">
        <div>
          <span className="brief-kicker">Today’s sales plan</span>
          <strong>{actions.length} activities across your book</strong>
        </div>
        <time>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date())}</time>
      </div>
      <div className="plan-groups">
        {groups.map((group) => {
          const groupActions = actions.filter((action) => action.workstream === group.key);
          if (groupActions.length === 0) return null;
          return (
            <section className="plan-group" key={group.key} aria-labelledby={`group-${group.key}`}>
              <div className="group-heading">
                <h3 id={`group-${group.key}`}>{group.label}</h3>
                <span>{group.note} · {groupActions.length}</span>
              </div>
              <ol className="lead-actions">
                {groupActions.map((action, index) => (
                  <li key={action.name}>
                    <span className="rank">{String(index + 1).padStart(2, "0")}</span>
                    <div className="lead-main">
                      <div className="lead-title">
                        <strong>{action.name}</strong>
                        <span data-stage={action.stage}>{stageLabel[action.stage]}</span>
                      </div>
                      <p>{action.reason}</p>
                      <div className="next-move">
                        <span>Recommended · {action.channel}</span>
                        <strong>{action.nextAction}</strong>
                      </div>
                    </div>
                    <div className="activity-actions">
                      <span className="due">{action.due}</span>
                      <button type="button" onClick={() => onStart(action.name)}>Work on this</button>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
