import type { LogEntry } from "@lorcanito/lorcana-engine/types/Log";
import type { Zones } from "@lorcanito/lorcana-engine/types/types";
export declare const privateZones: Zones[];
export declare const createLogEntry: ({ logEntry, sender, newLogKey, }: {
    logEntry: LogEntry;
    sender: string | "system";
    newLogKey?: string | null;
}) => any;
//# sourceMappingURL=gameLog.d.ts.map