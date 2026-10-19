import { fixtureBeginSearch } from "./native-fixture-test-actions";
import { expect, test } from "vite-plus/test";
import { projectState } from "@tcg/alpha-clash-engine";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { createSearchRetrieveFixture } from "./search-retrieve-fixture";

type Engine = ReturnType<typeof createSearchRetrieveFixture>;
function submit(engine: Engine, values: InteractionSubmission["values"]) {
  const view = engine.getInteractionView("human");
  const action = view.actions.find((entry) => entry.id.startsWith("resolveChoice:"))!;
  return engine.submitInteraction(
    "human",
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
    },
    { gameId: "search-retrieve", sourceAuthority: "server" },
  );
}

test("native search exposes only permitted candidates to its actor, rejects illegal destinations, and reveals the chosen card", () => {
  const engine = createSearchRetrieveFixture("search-deck");
  fixtureBeginSearch(engine, "search-deck");
  const view = engine.getInteractionView("human");
  const action = view.actions.find((entry) => entry.id.startsWith("resolveChoice:"))!;
  const input = action.inputs[0];
  if (input.kind !== "option-selection") throw new Error("Expected search options");
  const candidates = input.options.filter((option) => option.entity);
  // 18 legal Discarded Clash copies across 7 names; the UI stacks them fungibly.
  expect(candidates).toHaveLength(18);
  expect(input.options.some((option) => !option.entity)).toBe(true);
  const krungCopies = candidates.filter(
    (option) => engine.state.cards[option.entity!.instanceId].definitionId === "ac-ac3-010",
  );
  expect(krungCopies).toHaveLength(3);
  const candidate = candidates[0];
  const id = candidate.entity!.instanceId;
  const own = projectState(engine.state, "player-one");
  expect(own.cards.filter((card) => card.zone === "deck" && card.definitionId)).toHaveLength(18);
  for (const viewer of ["player-two", "spectator"] as const) {
    const projected = projectState(engine.state, viewer);
    expect(
      projected.cards
        .filter((card) => card.zone === "deck")
        .every((card) => card.definitionId === null && card.name === null),
    ).toBe(true);
    expect(projected.pendingChoices).toHaveLength(0);
  }
  expect(submit(engine, { selection: ["illegal"], destination: ["player-one:hand"] }).success).toBe(
    false,
  );
  expect(
    submit(engine, { selection: [candidate.id], destination: ["player-two:hand"] }).success,
  ).toBe(false);
  expect(engine.state.cards[id].zone).toBe("deck");
  expect(
    submit(engine, { selection: [candidate.id], destination: ["player-one:hand"] }).success,
  ).toBe(true);
  expect(engine.state.cards[id].zone).toBe("hand");
  expect(engine.state.moveLog.some((entry) => entry.type === "effect.reveal")).toBe(true);
  expect(engine.state.moveLog.some((entry) => entry.type === "effect.shuffle")).toBe(true);
  expect(
    projectState(engine.state, "player-one")
      .cards.filter((card) => card.zone === "deck")
      .every((card) => card.definitionId === null),
  ).toBe(true);
});

test("restricted search can find no card without a destination", () => {
  const engine = createSearchRetrieveFixture("search-deck");
  fixtureBeginSearch(engine, "search-deck");
  const action = engine
    .getInteractionView("human")
    .actions.find((entry) => entry.id.startsWith("resolveChoice:"))!;
  const input = action.inputs[0];
  if (input.kind !== "option-selection") throw new Error("Expected options");
  const done = input.options.find((option) => !option.entity)!;
  expect(submit(engine, { selection: [done.id] }).success).toBe(true);
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(engine.state.moveLog.some((entry) => entry.type === "effect.shuffle")).toBe(true);
});

test("retrieval offers only own Weapons and moves the selection to the native Accessory Zone", () => {
  const engine = createSearchRetrieveFixture("retrieve-oblivion");
  fixtureBeginSearch(engine, "retrieve-oblivion");
  const action = engine
    .getInteractionView("human")
    .actions.find((entry) => entry.id.startsWith("resolveChoice:"))!;
  const input = action.inputs[0];
  if (input.kind !== "entity-selection") throw new Error("Expected retrieval candidates");
  expect(input.candidates).toHaveLength(2);
  const id = input.candidates[1].entity.instanceId;
  const opponent = Object.values(engine.state.cards).find(
    (card) => card.zone === "oblivion" && card.controller === "player-two",
  )!;
  expect(
    submit(engine, { selection: [opponent.instanceId], destination: ["player-one:accessory"] })
      .success,
  ).toBe(false);
  expect(submit(engine, { selection: [id], destination: ["player-one:clash"] }).success).toBe(
    false,
  );
  expect(engine.state.cards[id].zone).toBe("oblivion");
  expect(submit(engine, { selection: [id], destination: ["player-one:accessory"] }).success).toBe(
    true,
  );
  expect(engine.state.cards[id].zone).toBe("accessory");
  expect(engine.state.cards[id].ready).toBe(true);
});

for (const id of ["search-empty", "retrieve-empty"])
  test(`${id} resolves without a false target or a blocked prompt`, () => {
    const engine = createSearchRetrieveFixture(id);
    fixtureBeginSearch(engine, id);
    expect(submit(engine, { confirm: true }).success).toBe(true);
    expect(engine.state.pendingChoices).toHaveLength(0);
    expect(engine.state.moveLog.some((entry) => entry.type === "effect.shuffle")).toBe(
      id === "search-empty",
    );
  });

for (const id of ["search-single", "retrieve-single"])
  test(`${id} exposes exactly one native candidate and completes its native destination`, () => {
    const engine = createSearchRetrieveFixture(id);
    fixtureBeginSearch(engine, id);
    const choice = engine
      .getInteractionView("human")
      .actions.find((a) => a.id.startsWith("resolveChoice:"))!;
    const input = choice.inputs[0];
    const candidates =
      input.kind === "option-selection"
        ? input.options
            .filter((o) => o.entity)
            .map((o) => ({ id: o.id, card: o.entity!.instanceId }))
        : input.kind === "entity-selection"
          ? input.candidates.map((c) => ({ id: c.entity.instanceId, card: c.entity.instanceId }))
          : [];
    expect(candidates).toHaveLength(1);
    const destination = id.startsWith("search") ? "hand" : "accessory";
    expect(
      submit(engine, { selection: [candidates[0].id], destination: [`player-one:${destination}`] })
        .success,
    ).toBe(true);
    expect(engine.state.cards[candidates[0].card].zone).toBe(destination);
    expect(engine.state.pendingChoices).toHaveLength(0);
    expect(engine.state.moveLog.some((e) => e.type === "effect.shuffle")).toBe(
      id.startsWith("search"),
    );
  });
