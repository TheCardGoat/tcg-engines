import { mkdirSync, writeFileSync } from "node:fs";

export const GRAND_ARCHIVE_SNAPSHOT_REFUSAL_REPORT_DIR = "reports/snapshot-fuzz";

export interface GrandArchiveSnapshotRefusalReportInput {
  readonly label: string;
  readonly message: string;
  readonly issues?: unknown;
  readonly stateSummary?: unknown;
  readonly rejectedSnapshot?: unknown;
  readonly history?: unknown;
}

/** Node-only evidence writer used by local fuzz and diagnostic hosts. */
export function writeGrandArchiveSnapshotRefusalReport(
  input: GrandArchiveSnapshotRefusalReportInput,
): string {
  mkdirSync(GRAND_ARCHIVE_SNAPSHOT_REFUSAL_REPORT_DIR, { recursive: true });
  const path = `${GRAND_ARCHIVE_SNAPSHOT_REFUSAL_REPORT_DIR}/${input.label.replace(
    /[^a-z0-9-]+/gi,
    "_",
  )}.json`;
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
