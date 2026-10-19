import type { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";

function respond(
  engine: AlphaClashServerEngine,
  actor: string,
  action: { id: string; requestId: string },
  values: InteractionSubmission["values"],
  gameId: string,
) {
  const view = engine.getInteractionView(actor);
  return engine.submitInteraction(
    actor,
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      actionId: action.id,
      requestId: action.requestId,
      values,
    },
    { gameId, sourceAuthority: "server" },
  );
}

/**
 * Play a hand card through the production adapter and pass the response
 * window, mirroring the board path that raises the card's native prompt.
 * The prompt fixtures open before their card is played, so tests call this
 * before answering the pending choice.
 */
export function playFixtureCardFromHand(
  engine: AlphaClashServerEngine,
  definitionId: string,
  gameId = "native-prompt-fixture",
): void {
  const card = Object.values(engine.state.cards).find(
    (candidate) =>
      candidate.controller === "player-one" &&
      candidate.zone === "hand" &&
      candidate.definitionId === definitionId,
  );
  if (!card) throw new Error(`${definitionId} is not in the fixture hand`);
  const view = engine.getInteractionView("human");
  const action = view.actions.find((candidate) => candidate.id === `playCard:${card.instanceId}`);
  if (!action) throw new Error(`No play action for ${definitionId}`);
  const values: InteractionSubmission["values"] = {};
  for (const input of action.inputs) {
    if (input.kind !== "option-selection") continue;
    if (input.id === "costRoute") values[input.id] = ["normal"];
    if (input.presentation?.kind !== "cost-slots") continue;
    if (!input.required && input.id !== "costResources") continue;
    const usedCards = new Set<string>();
    values[input.id] = input.presentation.slots.map((slot) => {
      const optionId = slot.optionIds.find((id) => {
        const option = input.options.find((entry) => entry.id === id);
        return option?.enabled && option.entity && !usedCards.has(option.entity.instanceId);
      });
      if (!optionId) throw new Error(`No resource available for ${slot.text.key}`);
      const option = input.options.find((entry) => entry.id === optionId)!;
      usedCards.add(option.entity!.instanceId);
      return optionId;
    });
  }
  if (!respond(engine, "human", action, values, gameId).success)
    throw new Error(`Playing ${definitionId} was rejected`);
  for (
    let round = 0;
    round < 64 && engine.state.responseWindow && !engine.state.pendingChoices.length;
    round += 1
  ) {
    const actor = engine.state.responseWindow.openFor === "player-two" ? "bot" : "human";
    const pass = engine
      .getInteractionView(actor)
      .actions.find((candidate) => candidate.intent === "pass");
    if (!pass || !respond(engine, actor, pass, {}, gameId).success) break;
  }
}

/** Start the fixture's native clash and pass responses until its first choice. */
export function beginBarrageFixture(engine: AlphaClashServerEngine): void {
  const actor = engine.getActivePlayerId()!;
  const action = engine
    .getInteractionView(actor)
    .actions.find((entry) => entry.id === "initiateClash");
  if (!action) throw new Error("Fixture has no clash action");
  const values: InteractionSubmission["values"] = {};
  for (const input of action.inputs) {
    if (input.kind !== "entity-selection") continue;
    const candidate = input.candidates.find(
      (entry) =>
        entry.enabled &&
        (input.id !== "attackerId" ||
          engine.state.cards[entry.entity.instanceId].definitionId === "ac-ac1-108"),
    );
    if (candidate) values[input.id] = [candidate.entity.instanceId];
  }
  if (!respond(engine, actor, action, values, "barrage-fixture").success)
    throw new Error("Clash rejected");
  for (
    let n = 0;
    (engine.state.responseWindow || engine.state.clash) &&
    !engine.state.pendingChoices.length &&
    n < 30;
    n++
  ) {
    const active = engine.getActivePlayerId()!;
    const pass = engine
      .getInteractionView(active)
      .actions.find((entry) => entry.intent === "pass" && entry.enabled);
    if (!pass || !respond(engine, active, pass, {}, "barrage-fixture").success)
      throw new Error("Pass rejected");
  }
}
