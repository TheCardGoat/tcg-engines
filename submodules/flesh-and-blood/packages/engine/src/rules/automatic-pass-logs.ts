import type { FabMoveLog, FabMoveLogMessage } from "../moves.ts";
import type { FabAutomationAction } from "./automation-drain.ts";

/**
 * Fold the automation fixed point's automatic actions into a command receipt's
 * moveLogs. Each action rides the triggering command's receipt in real commit
 * order — trigger passes, priority passes, and decision answers interleave
 * exactly as the drains committed them — so one accepted command still
 * produces one coherent receipt.
 */
export function automaticPassMoveLogs(
  automaticActions: readonly FabAutomationAction[],
  options: {
    readonly commandId: string;
    readonly timestamp: number;
    readonly turnNumber: number;
    readonly sequenceOffset: number;
  },
): readonly FabMoveLog[] {
  const messages = automaticActions.map(
    (
      automaticAction,
      index,
    ): {
      readonly moveType: FabMoveLog["moveType"];
      readonly actorId: string;
      readonly message: FabMoveLogMessage;
    } => {
      switch (automaticAction.kind) {
        case "trigger":
          return {
            moveType: "pass",
            actorId: automaticAction.actorId,
            message: {
              key: "flesh-and-blood.trigger-automation.auto-pass",
              values: {
                actorId: automaticAction.actorId,
                cardName: automaticAction.cardName,
              },
              defaultMessage: `${automaticAction.actorId} automatically passed priority for ${automaticAction.cardName}.`,
            },
          };
        case "priority":
          return {
            moveType: "pass",
            actorId: automaticAction.actorId,
            message: {
              key: "flesh-and-blood.priority-automation.auto-pass",
              values: {
                actorId: automaticAction.actorId,
              },
              ...(automaticAction.stackWindowId
                ? {
                    activityRef: {
                      kind: "stack-window-event" as const,
                      stackWindowId: automaticAction.stackWindowId,
                    },
                  }
                : {}),
              defaultMessage: `${automaticAction.actorId} passed priority automatically.`,
            },
          };
        case "decision":
          return {
            moveType: "answer-decision",
            actorId: automaticAction.actorId,
            message:
              automaticAction.decisionKind === "entity-target"
                ? {
                    key: "flesh-and-blood.decision-automation.auto-target",
                    values: {
                      actorId: automaticAction.actorId,
                    },
                    defaultMessage: `${automaticAction.actorId} selected all required targets automatically.`,
                  }
                : {
                    key: "flesh-and-blood.decision-automation.auto-order",
                    values: {
                      actorId: automaticAction.actorId,
                      decisionKind: automaticAction.decisionKind,
                    },
                    defaultMessage:
                      automaticAction.decisionKind === "trigger-first-player"
                        ? `${automaticAction.actorId} accepted the default simultaneous-trigger player order automatically.`
                        : `${automaticAction.actorId} accepted the default simultaneous-trigger order automatically.`,
                  },
          };
        default: {
          void index;
          const exhaustive: never = automaticAction;
          return exhaustive;
        }
      }
    },
  );
  return messages.map((entry, index) => ({
    commandId: options.commandId,
    moveType: entry.moveType,
    playerId: entry.actorId,
    timestamp: options.timestamp,
    sequence: options.sequenceOffset + index,
    turnNumber: options.turnNumber,
    public: [entry.message],
  }));
}
