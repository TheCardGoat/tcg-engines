// TODO: MOVE TO ENGINE
import { createId } from "@paralleldrive/cuid2";
export const privateZones = ["hand", "deck"];
function isPrivateEntry(newEntry) {
    if (newEntry.type === "MOVE_CARD") {
        if (newEntry.isPrivate) {
            return true;
        }
        return (privateZones.includes(newEntry.to) && privateZones.includes(newEntry.from));
    }
    if (newEntry.type === "MULLIGAN" || newEntry.type === "NEW_TURN") {
        return true;
    }
    return false;
}
export const createLogEntry = ({ logEntry, sender, newLogKey, }) => {
    // @ts-expect-error TODO: fix this PASS_TURN needs to be fixed
    const player = logEntry?.sender || sender || "system";
    const newEntry = {
        ...logEntry,
        sender: player,
        id: newLogKey || createId(),
    };
    const privateLog = isPrivateEntry(newEntry);
    if (privateLog && player && newEntry.instanceId) {
        newEntry.private = {
            [player]: {
                instanceId: newEntry.instanceId,
            },
        };
    }
    return JSON.parse(JSON.stringify(newEntry));
};
//# sourceMappingURL=gameLog.js.map