/** Test drivers only. Fixture factories never call these or advance the engine. */
import type { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { playFixtureCardFromHand } from "./prompt-fixture-play";

type Engine = AlphaClashServerEngine;
export function fixtureSubmit(
  engine: Engine,
  actionId: string,
  values: InteractionSubmission["values"] = {},
) {
  const actor = engine.getActivePlayerId()!;
  const view = engine.getInteractionView(actor);
  const action = view.actions.find((entry) => entry.id === actionId);
  if (!action) throw new Error(`No ${actionId} for ${actor}`);
  const result = engine.submitInteraction(
    actor,
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId,
      values,
    },
    { gameId: engine.state.id, sourceAuthority: "server" },
  );
  if (!result.success) throw new Error(`${actionId}: ${result.error}`);
  return result;
}
export function fixtureAnswer(engine: Engine, values: InteractionSubmission["values"]) {
  const action = engine
    .getInteractionView(engine.getActivePlayerId()!)
    .actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!action) throw new Error("No native choice");
  return fixtureSubmit(engine, action.id, values);
}
export function fixturePassResponses(engine: Engine) {
  for (
    let n = 0;
    engine.state.responseWindow && !engine.state.pendingChoices.length && n < 64;
    n++
  ) {
    const action = engine
      .getInteractionView(engine.getActivePlayerId()!)
      .actions.find((a) => a.intent === "pass" && a.enabled);
    if (!action) throw new Error("No pass in response window");
    fixtureSubmit(engine, action.id);
  }
}
export function fixtureAttack(engine: Engine, definitionId = "ac-ac1-027") {
  const seat = engine.state.activePlayer;
  const attacker = Object.values(engine.state.cards).find(
    (c) => c.controller === seat && c.zone === "clash" && c.definitionId === definitionId,
  )!;
  const target = Object.values(engine.state.cards).find(
    (c) => c.controller !== seat && c.zone === "contender",
  )!;
  fixtureSubmit(engine, "initiateClash", {
    attackerId: [attacker.instanceId],
    targetId: [target.instanceId],
  });
}
export function fixtureBeginSearch(engine: Engine, id: string) {
  playFixtureCardFromHand(engine, id.startsWith("search-") ? "ac-ac3-011" : "ac-ac4-005");
  if (!id.endsWith("empty")) fixtureAnswer(engine, { confirm: true });
}
export function fixtureBeginOrdering(engine: Engine, kind: "effects" | "oblivion") {
  if (kind === "effects") fixtureSubmit(engine, "endTurn");
  else playFixtureCardFromHand(engine, "ac-ac1-122");
}
export function fixtureBeginDestination(engine: Engine, id: string) {
  if (id === "destination-discard") {
    playFixtureCardFromHand(engine, "ac-ac1-001");
    fixtureAnswer(engine, { confirm: true });
  } else if (id === "destination-select") playFixtureCardFromHand(engine, "ac-ac5-113");
  else if (id === "destination-banish" || id === "destination-send") {
    const banish = id === "destination-banish";
    const source = Object.values(engine.state.cards).find(
      (c) => c.zone === "clash" && c.definitionId === (banish ? "ac-ac6-181" : "ac-ac4-008"),
    )!;
    const actionId = `activateAbility:${source.instanceId}:${banish ? 1 : 0}`;
    const input = engine
      .getInteractionView(engine.getActivePlayerId()!)
      .actions.find((a) => a.id === actionId)!.inputs[0];
    if (input.kind !== "entity-selection") throw new Error("Missing declared targets");
    const target =
      input.candidates.find(
        (c) => !banish && engine.state.cards[c.entity.instanceId!].owner === "player-two",
      ) ?? input.candidates[0];
    fixtureSubmit(engine, actionId, { [input.id]: [target.entity.instanceId] });
    fixturePassResponses(engine);
  } else if (id === "destination-reveal-hand") {
    fixtureAttack(engine);
    const source = Object.values(engine.state.cards).find(
      (card) => card.zone === "accessory" && card.definitionId === "ac-ac4-023",
    )!;
    const action = engine
      .getInteractionView("bot")
      .actions.find((entry) => entry.id === `respond:${source.instanceId}`)!;
    const values: InteractionSubmission["values"] = { costRoute: ["normal"] };
    for (const input of action.inputs) {
      if (input.kind === "entity-selection") {
        values[input.id] = input.candidates
          .filter((candidate) => candidate.enabled)
          .slice(0, input.min)
          .map((candidate) => candidate.entity.instanceId!);
      } else if (
        input.kind === "option-selection" &&
        ["resourcePayment", "costResources"].includes(input.id)
      ) {
        values[input.id] = input.options
          .filter((option) => option.enabled)
          .slice(0, input.min)
          .map((option) => option.id);
      }
    }
    fixtureSubmit(engine, action.id, values);
    fixturePassResponses(engine);
  } else if (id === "destination-reveal") {
    fixtureBeginShieldForetell(engine);
    const action = engine
      .getInteractionView("bot")
      .actions.find((a) => a.id.startsWith("resolveChoice:"))!;
    const input = action.inputs[0];
    if (input.kind !== "entity-partition") throw new Error("Expected native Foretell partition");
    const ids = input.candidates.map((c) => c.entity.instanceId);
    fixtureAnswer(engine, { deckOrder: { top: [ids[0]], bottom: ids.slice(1) } });
    fixturePassResponses(engine);
  }
}

/** Stop at the private look before Archaic Shield reveals its final top card. */
export function fixtureBeginShieldForetell(engine: Engine) {
  fixtureAttack(engine);
  const source = Object.values(engine.state.cards).find(
    (c) => c.zone === "accessory" && c.definitionId === "ac-ac5-082",
  )!;
  const response = engine
    .getInteractionView("bot")
    .actions.find((a) => a.id === `respond:${source.instanceId}`)!;
  const payment = response.inputs.find(
    (i) => i.kind === "option-selection" && i.id === "resourcePayment",
  );
  if (payment?.kind !== "option-selection") throw new Error("Expected payment");
  fixtureSubmit(engine, response.id, {
    resourcePayment: payment.options.slice(0, payment.min).map((o) => o.id),
  });
  fixturePassResponses(engine);
}
