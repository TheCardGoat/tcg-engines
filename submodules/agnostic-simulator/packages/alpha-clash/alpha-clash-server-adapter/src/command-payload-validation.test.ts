import { expect, it } from "vite-plus/test";
import { bombardier, getCard, previewDeck, skirmisher } from "@tcg/alpha-clash-cards";
import { Spec, specState } from "@tcg/alpha-clash-engine/testing";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const context = { gameId: "command-payload", sourceAuthority: "server" as const };
const seats = { p1: "player-one", p2: "player-two" } as const;
function rejectsUnchanged(
  engine: AlphaClashServerEngine,
  move: string,
  actor: string,
  payload: Record<string, unknown>,
) {
  const before = structuredClone(engine.state);
  const undo = structuredClone(engine.getUndoState());
  expect(engine.dispatch(move, actor, payload, context)).toMatchObject({
    success: false,
    errorCode: "INVALID_ARGUMENTS",
  });
  expect(engine.state).toEqual(before);
  expect(engine.getUndoState()).toEqual(undo);
}
function opening() {
  const g = new Spec(specState({ p1: { deck: previewDeck() }, p2: { deck: previewDeck() } }));
  g.playerOne.declareMulligan(true);
  g.playerTwo.declareMulligan(false);
  return new AlphaClashServerEngine(g.state, seats);
}
it.each([null, "card", 3, ["card", 3]].map((value) => [value]))(
  "rejects malformed mulligan selection %j",
  (cardIds) => {
    const engine = opening();
    rejectsUnchanged(engine, "mulligan", "p1", { cardIds });
    expect(engine.dispatch("mulligan", "p1", { cardIds: [] }, context).success).toBe(true);
    expect(engine.state.players["player-one"].hasMulliganed).toBe(true);
  },
);
function obstruction() {
  const g = Spec.fromFixture({
    playerOne: { clash: [skirmisher] },
    playerTwo: { clash: [skirmisher] },
  });
  g.playerOne.attack(skirmisher, g.playerTwo.contender(), "pending");
  while (g.state.responseWindow) g.asPlayer(g.state.responseWindow.openFor).passRound();
  expect(g.state.clash?.step).toBe("obstruct");
  return {
    engine: new AlphaClashServerEngine(g.state, seats),
    id: g.playerTwo.at(skirmisher, "clash").instanceId,
  };
}
it.each([null, "card", 4, [false]].map((value) => [value]))(
  "rejects malformed obstructor selection %j",
  (obstructorIds) => {
    const { engine } = obstruction();
    rejectsUnchanged(engine, "declareObstructors", "p2", { obstructorIds });
    expect(
      engine.dispatch("declareObstructors", "p2", { obstructorIds: [] }, context).success,
    ).toBe(true);
  },
);
it("does not silently drop an invalid entry from a selected obstruction", () => {
  const { engine, id } = obstruction();
  rejectsUnchanged(engine, "declareObstructors", "p2", { obstructorIds: [id, false] });
  expect(
    engine.dispatch("declareObstructors", "p2", { obstructorIds: [id] }, context).success,
  ).toBe(true);
});
function division() {
  const g = Spec.fromFixture({
    playerOne: { clash: [bombardier] },
    playerTwo: { clash: [skirmisher, skirmisher] },
  });
  g.playerOne.attack(bombardier, g.playerTwo.contender(), "pending");
  expect(g.state.pendingChoices[0]?.kind).toBe("division");
  return {
    engine: new AlphaClashServerEngine(g.state, seats),
    choiceId: g.state.pendingChoices[0].id,
  };
}
it.each([null, false, 4, "allocation", []].map((value) => [value]))(
  "rejects malformed allocation %j without declining Barrage",
  (allocation) => {
    const { engine, choiceId } = division();
    rejectsUnchanged(engine, "resolveChoice", "p1", { choiceId, division: allocation });
    expect(
      engine.dispatch("resolveChoice", "p1", { choiceId, division: {} }, context).success,
    ).toBe(true);
    expect(engine.state.pendingChoices).toHaveLength(0);
  },
);
it.each([null, "order", ["card", false]].map((value) => [value]))(
  "rejects malformed ordered IDs %j",
  (orderedIds) => {
    const { engine, choiceId } = division();
    rejectsUnchanged(engine, "resolveChoice", "p1", { choiceId, orderedIds, division: {} });
  },
);
it.each([null, 4, false].map((value) => [value]))(
  "does not silently decline an optional target for malformed option %j",
  (optionId) => {
    const linn = getCard("ac-ac3-092");
    const victim = getCard("ac-ac1-055");
    const g = Spec.fromFixture({
      playerOne: { hand: [linn], resource: [linn, linn, linn] },
      playerTwo: { clash: [victim], deck: [victim, victim] },
    });
    g.playerOne.play(linn);
    while (g.state.responseWindow && !g.state.pendingChoices.length)
      g.asPlayer(g.state.responseWindow.openFor).passRound();
    const engine = new AlphaClashServerEngine(g.state, seats);
    expect(
      engine.dispatch(
        "resolveChoice",
        "p1",
        { choiceId: engine.state.pendingChoices[0].id, optionId: "player-two" },
        context,
      ).success,
    ).toBe(true);
    const choiceId = engine.state.pendingChoices[0].id;
    rejectsUnchanged(engine, "resolveChoice", "p1", { choiceId, optionId });
    expect(engine.dispatch("resolveChoice", "p1", { choiceId }, context).success).toBe(true);
    expect(engine.state.deckOrder["player-two"]).toHaveLength(1);
  },
);

it.each([null, 7, false].map((value) => [value]))(
  "rejects malformed activation target %j before paying engagement",
  (targetId) => {
    const source = {
      ...skirmisher,
      id: "payload-activation",
      name: "Payload activation",
      abilities: [
        {
          kind: "activated" as const,
          text: "Draw a card",
          cost: { kind: "engage" as const, target: { type: "self" as const } },
          effects: [{ type: "draw" as const, controller: "friendly" as const, amount: 1 }],
        },
      ],
    };
    const g = Spec.fromFixture({
      definitions: [source],
      playerOne: { clash: [source], deck: [skirmisher] },
    });
    const engine = new AlphaClashServerEngine(g.state, seats);
    const cardId = g.playerOne.at(source, "clash").instanceId;
    rejectsUnchanged(engine, "activateAbility", "p1", { cardId, abilityIndex: 0, targetId });
    expect(
      engine.dispatch("activateAbility", "p1", { cardId, abilityIndex: 0 }, context).success,
    ).toBe(true);
    expect(engine.state.cards[cardId].ready).toBe(false);
  },
);

it.each(
  [undefined, null, "2", -1, 1.5, Infinity, Number.MAX_SAFE_INTEGER + 1].map((value) => [value]),
)("rejects invalid divided amount %j", (amount) => {
  const { engine, choiceId } = division();
  const choice = engine.state.pendingChoices[0];
  if (choice.kind !== "division") throw new Error("Missing damage division");
  rejectsUnchanged(engine, "resolveChoice", "p1", {
    choiceId,
    division: { [choice.candidates[0]]: amount },
  });
});

it("preserves valid divided damage after saving the pending choice", () => {
  const { engine: initial, choiceId } = division();
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(initial.state)), seats);
  const choice = engine.state.pendingChoices[0];
  if (choice.kind !== "division") throw new Error("Missing damage division");
  const [first, second] = choice.candidates.filter(
    (id) => engine.state.cards[id].controller === "player-two",
  );
  expect(
    engine.dispatch(
      "resolveChoice",
      "p1",
      { choiceId, division: { [first]: 3, [second]: 1 } },
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.cards[first].zone).toBe("oblivion");
  expect(engine.state.cards[second].phaseDamage).toBe(1);
  expect(engine.state.pendingChoices).toHaveLength(0);
});
