import type { FabRulesSnapshot } from "../../kernel/transaction-kernel.ts";
import type { FabLegalCommand } from "./shared.ts";

/** Instantiates the pass command; during defense declaration it means "do not defend". */
export function instantiatePassLegalCommands(context: {
  readonly state: FabRulesSnapshot;
  readonly actorId: string;
  readonly push: (command: FabLegalCommand) => void;
}): void {
  const { state, actorId, push } = context;
  const passDeclaresNoDefense =
    state.combat?.step === "defend" &&
    state.combat.defenseDeclarationPending &&
    state.combat.activeLink?.defendingPlayerId === actorId;
  push({
    move: "pass",
    payload: {},
    label: passDeclaresNoDefense ? "Do not defend" : "Pass",
  });
}

/** Instantiates the concede command when the host opts into last-resort bots. */
export function instantiateConcedeLegalCommands(context: {
  readonly includeConcede: boolean;
  readonly push: (command: FabLegalCommand) => void;
}): void {
  const { includeConcede, push } = context;
  if (includeConcede) {
    push({ move: "concede", payload: {}, label: "Concede" });
  }
}
