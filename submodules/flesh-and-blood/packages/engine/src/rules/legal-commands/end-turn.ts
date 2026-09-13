import { arsenalHasRoom } from "../arsenal-capacity.ts";
import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabRulesView } from "../rules-view.ts";
import { evaluatedObject, shortId, type FabLegalCommand } from "./shared.ts";

/** Instantiates end-turn commands, including the CR 4.4.3b arsenal declaration. */
export function instantiateEndTurnLegalCommands(context: {
  readonly state: FabRulesSnapshot;
  readonly view: FabRulesView;
  readonly actorId: string;
  readonly push: (command: FabLegalCommand) => void;
}): void {
  const { state, view, actorId, push } = context;
  push({
    move: "end-turn",
    payload: { chooseArsenal: true },
    label: "End turn",
  });
  // CR 4.4.3b: the turn player may put a hand card into arsenal when it has room.
  if (arsenalHasRoom(state, actorId)) {
    for (const instanceId of state.containers.zonesByPlayerId[actorId]!.hand) {
      const name =
        evaluatedObject(state, view, instanceId)?.current.names.join(" // ") || shortId(instanceId);
      push({
        move: "end-turn",
        payload: { arsenalInstanceId: instanceId },
        label: `End turn, arsenal ${name}`,
      });
    }
  }
}
