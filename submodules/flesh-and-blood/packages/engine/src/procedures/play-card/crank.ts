import type { FabRulesProcess } from "../../rules/process.ts";
import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import type { FabEvaluatedObject } from "../../rules/rules-view.ts";

export function appendCrankIntentGroup(
  process: FabRulesProcess,
  procedure: Extract<FabRulesProcess["procedure"], { readonly kind: "play-card" }>,
  currentObject: FabEvaluatedObject | null,
): void {
  if (!procedure.crank) return;
  const hasCrankKeyword =
    currentObject?.current.keywords.some((keyword) => keyword.name === "crank") ?? false;
  if (!hasCrankKeyword) return;
  appendFabEventGroup(process, [
    {
      name: "crank",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [procedure.object],
      bindings: {},
      data: {
        actorId: procedure.actorId,
        object: procedure.object,
        intent: true,
      },
    },
  ]);
}
