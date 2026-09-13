import { mkdirSync, writeFileSync } from "node:fs";

/** Directory where snapshot-refusal evidence dumps are written (gitignored). */
export const FAB_SNAPSHOT_REFUSAL_REPORT_DIR = "reports/snapshot-fuzz";

export interface FabSnapshotRefusalReportInput {
  /** Stable label identifying the run (seed, bench label, …). */
  readonly label: string;
  readonly message: string;
  readonly issues?: unknown;
  readonly stateSummary?: unknown;
  readonly rejectedSnapshot?: unknown;
  readonly history?: unknown;
}

/**
 * Persist a snapshot-refusal evidence bundle (named invariants, state summary,
 * rejected DTO, replay history) for offline root-causing with
 * `scripts/diagnose-snapshot-dump.ts`. Node-only by design: callers are
 * CLI/test/bench hosts, never the browser engine bundle.
 */
export function writeFabSnapshotRefusalReport(input: FabSnapshotRefusalReportInput): string {
  mkdirSync(FAB_SNAPSHOT_REFUSAL_REPORT_DIR, { recursive: true });
  const path = `${FAB_SNAPSHOT_REFUSAL_REPORT_DIR}/${input.label.replace(/[^a-z0-9-]+/gi, "_")}.json`;
  writeFileSync(
    path,
    JSON.stringify(
      {
        label: input.label,
        message: input.message,
        issues: input.issues ?? null,
        stateSummary: input.stateSummary ?? null,
        rejectedSnapshot: input.rejectedSnapshot ?? null,
        history: input.history ?? null,
      },
      null,
      2,
    ),
  );
  return path;
}
