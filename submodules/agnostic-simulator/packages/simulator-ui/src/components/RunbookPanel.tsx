import type { HarnessFixture } from "@tcg/simulator-contract";

interface RunbookPanelProps {
  fixture: HarnessFixture;
}

export function RunbookPanel({ fixture }: RunbookPanelProps) {
  const eyebrowClass =
    "eyebrow text-[12px] font-extrabold leading-tight tracking-normal text-[var(--game-accent)] uppercase";

  return (
    <aside
      className="runbook-panel min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-[18px] shadow-[var(--shadow)]"
      aria-label="Runbook panel"
    >
      <div className="panel-heading mb-3.5">
        <p className={eyebrowClass}>agent runbook</p>
        <h2 className="mt-1.5 break-words text-[22px] font-extrabold leading-tight text-[var(--text)]">
          Guide steps
        </h2>
      </div>
      <ol className="grid gap-3">
        {fixture.guideSteps.map((step, index) => (
          <li
            key={index}
            className="grid gap-1 rounded-md border border-[var(--border)] bg-[var(--surface-soft)] p-3"
          >
            <span className="text-[11px] font-black text-[var(--game-accent)]">
              Step {index + 1}
            </span>
            <h4 className="text-sm font-black text-[var(--text)]">{step.title}</h4>
            <p className="text-xs leading-snug text-[var(--muted)]">{step.body}</p>
          </li>
        ))}
      </ol>
      {fixture.agentChecks.length > 0 && (
        <div className="mt-4 grid gap-2">
          <p className={eyebrowClass}>agent checks</p>
          <ul className="grid gap-1">
            {fixture.agentChecks.map((check, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-[var(--text)]">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-[var(--game-accent)]" />
                {check}
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
