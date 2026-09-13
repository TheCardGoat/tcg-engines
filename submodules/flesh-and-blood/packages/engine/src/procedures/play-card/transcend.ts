import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import type { FabEvaluatedObject } from "../../rules/rules-view.ts";

export function appendTranscendEventGroup(
  process: FabRulesProcess,
  procedure: Extract<FabRulesProcess["procedure"], { readonly kind: "play-card" }>,
  currentObject: FabEvaluatedObject | null,
): void {
  // Transcend is declared as an ability label (label.name === "transcend")
  // on ENG/MST set cards.
  const hasTranscendLabel =
    currentObject?.current.abilities.some((ability) => ability.label?.name === "transcend") ??
    false;
  if (!hasTranscendLabel) return;
  appendFabEventGroup(process, [
    {
      name: "transcend",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [procedure.object],
      bindings: {},
      data: { actorId: procedure.actorId, object: procedure.object },
    },
  ]);
}
