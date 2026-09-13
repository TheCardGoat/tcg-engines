import type { GundamMoveLog } from "@tcg/gundam-engine";

import type { LiveEngineLogRecord } from "./matchContext.ts";

/**
 * Rebuild native {@link GundamMoveLog} entries from the canonical engine
 * log records the gateway broadcasts.
 *
 * The server adapter flattens each native log into a canonical record
 * (`toCanonicalGundamMoveLog`): `type`/`playerId`/`timestamp`/
 * `turnNumber` become record fields and every remaining native field is
 * preserved in the message `values`. Viewer privacy was already applied
 * server-side (private values only reach entitled viewers), so merging
 * the values back onto the record fields restores exactly the log this
 * viewer is allowed to see.
 */
export function reconstructGundamMoveLogs(
  records: readonly LiveEngineLogRecord[],
): GundamMoveLog[] {
  const logs: GundamMoveLog[] = [];
  for (const record of records) {
    const values = record.log.public.reduce<Record<string, unknown>>(
      (merged, message) => ({ ...merged, ...message.values }),
      {},
    );
    logs.push({
      ...values,
      type: record.log.moveType,
      playerId: record.log.playerId,
      timestamp: record.log.timestamp,
      ...(record.log.turnNumber === undefined ? {} : { turnNumber: record.log.turnNumber }),
    } as GundamMoveLog);
  }
  return logs;
}
