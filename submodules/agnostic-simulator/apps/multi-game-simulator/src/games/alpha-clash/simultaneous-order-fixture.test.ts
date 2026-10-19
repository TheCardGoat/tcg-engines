import { fixtureBeginOrdering, fixtureSubmit } from "./native-fixture-test-actions";
import { expect, test } from "vitest";
import { applyCommand, projectState } from "@tcg/alpha-clash-engine";
import { INTERACTION_PROTOCOL_VERSION } from "@tcg/protocol";
import { createSimultaneousOrderFixture } from "./simultaneous-order-fixture";

test("effects: the native trigger-order tray preserves IDs, rejects invalid orders, and resolves the batch", () => {
  const engine = createSimultaneousOrderFixture("effects");
  fixtureBeginOrdering(engine, "effects");
  const before = structuredClone(engine.state);
  const choice = before.pendingChoices[0];
  if (choice?.kind !== "modal" || !choice.triggerOrder)
    throw new Error("Missing native trigger order");
  const mine = choice.triggerOrder.batch.filter((trigger) => trigger.controller === "player-one");
  const ids = mine.map((trigger) => trigger.id);
  expect(ids).toHaveLength(3);
  expect(new Set(ids).size).toBe(3);
  expect(before.pendingTriggers).toHaveLength(3);
  expect(projectState(before, "player-two").pendingChoices).toHaveLength(0);
  expect(
    engine
      .getInteractionView("bot")
      .actions.some((action) => action.id === `resolveChoice:${choice.id}`),
  ).toBe(false);
  const view = engine.getInteractionView("human");
  const action = view.actions.find((action) => action.id === `resolveChoice:${choice.id}`)!;
  const ordering = action.inputs.find((input) => input.kind === "ordering");
  if (ordering?.kind !== "ordering") throw new Error("Missing ordering input");
  expect(ordering.candidates.map((candidate) => candidate.entity.instanceId)).toEqual(
    expect.arrayContaining(ids),
  );
  for (const candidate of ordering.candidates) {
    const option = choice.options.find((entry) => entry.id === candidate.entity.instanceId)!;
    const sourceId = mine.find((trigger) => trigger.id === option.id)?.context.sourceId;
    const visible = projectState(before, "player-one").cards.find(
      (card) => card.instanceId === sourceId,
    );
    expect(candidate.entity.definitionId).toBe(visible?.definitionId ?? undefined);
    expect(candidate.text?.key).toBe(option.label);
  }
  const submit = (order: string[]) =>
    engine.submitInteraction(
      "human",
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        actionId: action.id,
        requestId: action.requestId,
        values: { order },
      },
      { gameId: before.id, sourceAuthority: "server" },
    );
  for (const order of [ids.slice(1), [ids[0], ids[0], ids[2]], [...ids.slice(1), "hidden-card"]]) {
    expect(submit(order).success).toBe(false);
    expect(engine.state).toEqual(before);
    expect(
      applyCommand(structuredClone(before), {
        type: "resolveChoice",
        playerId: "player-one",
        choiceId: choice.id,
        orderedIds: order,
      }).success,
    ).toBe(false);
  }
  expect(
    applyCommand(structuredClone(before), {
      type: "resolveChoice",
      playerId: "player-two",
      choiceId: choice.id,
      orderedIds: ids,
    }).success,
  ).toBe(false);
  const ordered = [...ids].reverse();
  const restored = applyCommand(structuredClone(before), {
    type: "resolveChoice",
    playerId: "player-one",
    choiceId: choice.id,
    orderedIds: ordered,
  });
  expect(restored.success).toBe(true);
  expect(submit(ordered).success).toBe(true);
  expect(submit(ordered).success).toBe(false); // stale request cannot resolve twice
  const positions = ordered
    .map((id) => choice.options.findIndex((option) => option.id === id) + 1)
    .join(" → ");
  expect(
    engine.state.moveLog.some(
      (entry) => entry.public && entry.message.includes(`resolve in this order: ${positions}`),
    ),
  ).toBe(true);
  expect(engine.state.pendingTriggers).toHaveLength(0);
  for (const trigger of mine) expect(engine.state.cards[trigger.context.sourceId].ready).toBe(true);
});

test("oblivion: native batch preserves IDs, rejects invalid orders, and accepts a complete order", () => {
  const engine = createSimultaneousOrderFixture("oblivion");
  fixtureBeginOrdering(engine, "oblivion");
  const before = structuredClone(engine.state);
  expect(
    projectState(before, "player-one")
      .cards.filter((card) => card.controller === "player-two" && card.zone === "hand")
      .every((card) => card.definitionId === null && card.name === null),
  ).toBe(true);
  const choice = before.pendingChoices.find((choice) => choice.kind === "ordering")!;
  if (choice.kind !== "ordering") throw new Error("Missing ordering");
  const ids = choice.candidates.map((candidate) => candidate.id);
  expect(ids).toHaveLength(3);
  expect(new Set(ids).size).toBe(3);
  expect(projectState(before, "player-two").pendingChoices).toHaveLength(0);
  expect(
    engine
      .getInteractionView("bot")
      .actions.some((action) => action.id === `resolveChoice:${choice.id}`),
  ).toBe(false);
  const view = engine.getInteractionView("human");
  const action = view.actions.find((action) => action.id === `resolveChoice:${choice.id}`)!;
  const ordering = action.inputs.find((input) => input.kind === "ordering");
  if (ordering?.kind !== "ordering") throw new Error("Missing ordering input");
  for (const candidate of ordering.candidates) {
    const native = choice.candidates.find((entry) => entry.id === candidate.entity.instanceId)!;
    const visible = projectState(before, "player-one").cards.find(
      (card) => card.instanceId === native.cardId,
    );
    expect(candidate.entity.definitionId).toBe(visible?.definitionId ?? undefined);
    expect(candidate.text?.key).toBe(native.label);
  }
  const submit = (order: string[]) =>
    engine.submitInteraction(
      "human",
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        actionId: action.id,
        requestId: action.requestId,
        values: { order },
      },
      { gameId: before.id, sourceAuthority: "server" },
    );
  for (const order of [ids.slice(1), [ids[0], ids[0], ids[2]], [...ids.slice(1), "hidden-card"]]) {
    expect(submit(order).success).toBe(false);
    expect(engine.state).toEqual(before);
    expect(
      applyCommand(structuredClone(before), {
        type: "resolveChoice",
        playerId: "player-one",
        choiceId: choice.id,
        orderedIds: order,
      }).success,
    ).toBe(false);
  }
  expect(
    applyCommand(structuredClone(before), {
      type: "resolveChoice",
      playerId: "player-two",
      choiceId: choice.id,
      orderedIds: ids,
    }).success,
  ).toBe(false);
  const ordered = [...ids].reverse();
  const restored = applyCommand(structuredClone(before), {
    type: "resolveChoice",
    playerId: "player-one",
    choiceId: choice.id,
    orderedIds: ordered,
  });
  expect(restored.success).toBe(true);
  expect(submit(ordered).success).toBe(true);
  expect(submit(ordered).success).toBe(false); // stale request cannot resolve twice
  expect(engine.state.oblivionOrder["player-one"].filter((id) => ids.includes(id))).toEqual(
    ordered,
  );
  expect(engine.state.oblivionOrder["player-one"].at(-1)).toBe(
    before.oblivionOrder["player-one"].at(-1),
  );
});

test("both owners arrange arrivals before the remaining Alpha Aster effect resumes", () => {
  const engine = createSimultaneousOrderFixture("oblivion", true);
  fixtureBeginOrdering(engine, "oblivion");
  const [first, second] = engine.state.pendingChoices;
  if (first?.kind !== "ordering" || second?.kind !== "ordering")
    throw new Error("Missing owner batches");
  expect(first.playerId).toBe("player-one");
  expect(second.playerId).toBe("player-two");
  expect(engine.getInteractionView("bot")).toMatchObject({
    status: "waiting",
    actions: [{ id: "concede" }],
  });
  const before = structuredClone(engine.state);
  expect(
    applyCommand(structuredClone(before), {
      type: "resolveChoice",
      playerId: "player-two",
      choiceId: second.id,
      orderedIds: second.candidates.map((c) => c.id),
    }).success,
  ).toBe(false);
  const firstOrder = first.candidates.map((c) => c.id).reverse();
  fixtureSubmit(engine, `resolveChoice:${first.id}`, { order: firstOrder });
  expect(engine.state.deckOrder).toEqual(before.deckOrder);
  expect(engine.state.pendingChoices.map((c) => c.id)).toEqual([second.id]);
  expect(projectState(engine.state, "player-two").pendingChoices[0].id).toBe(second.id);
  expect(engine.getInteractionView("human")).toMatchObject({
    status: "waiting",
    actions: [{ id: "concede" }],
  });
  const secondOrder = second.candidates.map((c) => c.id).reverse();
  fixtureSubmit(engine, `resolveChoice:${second.id}`, { order: secondOrder });
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(engine.state.oblivionOrder["player-one"].slice(0, firstOrder.length)).toEqual(firstOrder);
  expect(engine.state.oblivionOrder["player-two"]).toEqual(secondOrder);
  expect(engine.state.oblivionOrder["player-one"].at(-1)).toBe(
    before.oblivionOrder["player-one"].at(-1),
  );
  for (const seat of ["player-one", "player-two"] as const) {
    expect(engine.state.deckOrder[seat]).toHaveLength(before.deckOrder[seat].length - 1);
    expect(
      Object.values(engine.state.cards).some(
        (card) =>
          card.controller === seat &&
          card.zone === "clash" &&
          card.instanceId === before.deckOrder[seat][0],
      ),
    ).toBe(true);
  }
});
