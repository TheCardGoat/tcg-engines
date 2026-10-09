import {
  PreparationCommandResultSchema,
  PreparationSnapshotSchema,
  type PreparationCommand,
  type PreparationCommandResult,
  type PreparationSnapshot,
} from "@tcg/protocol/preparation";
import type { GatewayHandle } from "./types.js";

/** A timeout means unknown outcome. Retry the same commandId through either transport. */
export function sendPreparationCommand(
  handle: GatewayHandle,
  command: PreparationCommand,
  timeoutMs = 4_000,
): Promise<PreparationCommandResult> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error("Preparation acknowledgement timed out."));
    }, timeoutMs);
    const unsubscribe = handle.on("preparation_command_result", (message) => {
      if (message.correlationId !== command.correlationId) return;
      const parsed = PreparationCommandResultSchema.safeParse(message.result);
      if (
        !parsed.success ||
        parsed.data.commandId !== command.commandId ||
        parsed.data.matchId !== command.matchId ||
        parsed.data.gameId !== command.gameId
      )
        return;
      clearTimeout(timer);
      unsubscribe();
      resolve(parsed.data);
    });
    try {
      if (command.type === "confirm_preparation") {
        const { type: _type, ...payload } = command;
        handle.emit("confirm_preparation", payload);
      } else {
        const { type: _type, ...payload } = command;
        handle.emit("choose_preparation_first_player", payload);
      }
    } catch (error) {
      clearTimeout(timer);
      unsubscribe();
      reject(error);
    }
  });
}

export function synchronizePreparation(
  handle: GatewayHandle,
  input: { matchId: string; gameId: string; revision: number },
  timeoutMs = 4_000,
): Promise<PreparationSnapshot> {
  const correlationId = crypto.randomUUID();
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error("Preparation synchronization timed out."));
    }, timeoutMs);
    const unsubscribe = handle.on("preparation_state", (message) => {
      if (message.correlationId !== correlationId) return;
      const parsed = PreparationSnapshotSchema.safeParse(message.snapshot);
      if (!parsed.success || parsed.data.matchId !== input.matchId) return;
      clearTimeout(timer);
      unsubscribe();
      resolve(parsed.data);
    });
    try {
      handle.emit("request_preparation_sync", { ...input, correlationId });
    } catch (error) {
      clearTimeout(timer);
      unsubscribe();
      reject(error);
    }
  });
}
