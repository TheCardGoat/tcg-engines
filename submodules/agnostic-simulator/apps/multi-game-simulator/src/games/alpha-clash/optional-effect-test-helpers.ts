import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { createOptionalEffectFixture } from "./optional-effect-fixtures";

type Engine = ReturnType<typeof createOptionalEffectFixture>;
export function fixtureAtOptionalChoice(id: string): Engine {
  const engine = createOptionalEffectFixture(id);
  const find = (definitionId: string, zone: string, controller = "player-one") => {
    const card = Object.values(engine.state.cards).find(
      (card) =>
        card.definitionId === definitionId && card.zone === zone && card.controller === controller,
    );
    if (!card) throw new Error(`Missing ${definitionId}`);
    return card.instanceId;
  };
  const perform = (prefix: string, values: InteractionSubmission["values"] = {}) => {
    const actor = engine.getActivePlayerId()!;
    const view = engine.getInteractionView(actor);
    const action = view.actions.find((action) => action.enabled && action.id.startsWith(prefix));
    if (!action) throw new Error(`Missing ${prefix}`);
    const result = engine.submitInteraction(
      actor,
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        requestId: action.requestId,
        actionId: action.id,
        values,
      },
      { gameId: "fixture-start", sourceAuthority: "server" },
    );
    if (!result.success) throw new Error(result.error ?? `${prefix} failed`);
  };
  if (id.startsWith("optional-restore"))
    perform("initiateClash", {
      attackerId: [find("ac-tp1-017", "clash")],
      targetId: [find("ac-ac1-096", "contender", "player-two")],
    });
  else if (id.startsWith("optional-wrath"))
    perform(`activateAbility:${find("ac-ac7-162", "accessory")}`);
  else if (id === "optional-temper")
    perform(`attachWeapon:${find("ac-st2-010", "accessory")}`, {
      targetId: [find("ac-ac7-150", "clash")],
    });
  else if (id.startsWith("optional-void")) perform("endTurn");
  for (let n = 0; n < 16 && !engine.state.pendingChoices.length; n++) perform("pass");
  if (engine.state.pendingChoices[0]?.kind !== "option")
    throw new Error("No optional choice reached");
  return engine;
}
