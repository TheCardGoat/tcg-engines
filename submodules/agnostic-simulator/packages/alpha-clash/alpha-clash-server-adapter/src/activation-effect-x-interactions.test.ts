import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { applyCommand } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import type { AcAbilityCost, AcClashCard, AcEffect } from "@tcg/alpha-clash-types";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

function fixture(cost: AcAbilityCost, effects: readonly AcEffect[]) {
  const source: AcClashCard = {
    id: "effect-x-contract",
    name: "Effect X contract",
    cardType: "clash",
    colors: ["red"],
    cost: { total: 0 },
    attack: 1,
    defense: 1,
    abilities: [{ kind: "activated", text: "Contract fixture", cost, effects }],
  };
  const filler = getCard("ac-ac6-162");
  const g = Spec.fromFixture({
    definitions: [source],
    playerOne: {
      clash: [source],
      deck: [filler, filler, filler],
    },
  });
  const cardId = g.playerOne.at(source, "clash").instanceId;
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  return { engine, cardId };
}
const engage: AcAbilityCost = { kind: "engage", target: { type: "self" } };
const health: AcAbilityCost = { kind: "health", amount: "x" };
const draw: AcEffect = { type: "draw", amount: "x", controller: "friendly" };
const context = { gameId: "effect-x", sourceAuthority: "server" as const };

it.each([engage, health])(
  "declares X with $kind cost and retains it across a saved optional choice",
  (cost) => {
    let { engine, cardId } = fixture(cost, [
      { type: "optional", prompt: "Draw X?", effects: [draw] },
    ]);
    const startingHealth = engine.state.players["player-one"].health;
    const view = engine.getInteractionView("p1");
    const action = view.actions.find((entry) => entry.id === `activateAbility:${cardId}:0`);
    expect(action?.inputs.find((input) => input.id === "xValue")).toMatchObject({
      kind: "number",
      min: 0,
      step: 1,
      required: true,
    });
    if (!action) throw new Error("Missing activation");
    expect(
      engine.submitInteraction(
        "p1",
        buildInteractionSubmission({ view, action, values: { xValue: 2 } }),
        context,
      ).success,
    ).toBe(true);
    expect(engine.state.players["player-one"].health).toBe(
      startingHealth - (cost.kind === "health" ? 2 : 0),
    );
    for (let i = 0; i < 10 && engine.state.responseWindow; i++)
      expect(engine.dispatch("pass", engine.getActivePlayerId()!, {}, context).success).toBe(true);
    expect(engine.state.pendingChoices).toHaveLength(1);
    engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    const choiceView = engine.getInteractionView("p1");
    const choice = choiceView.actions.find((entry) => entry.id.startsWith("resolveChoice:"));
    if (!choice) throw new Error("Missing optional choice");
    expect(
      engine.submitInteraction(
        "p1",
        buildInteractionSubmission({ view: choiceView, action: choice, values: { confirm: true } }),
        context,
      ).success,
    ).toBe(true);
    expect(
      Object.values(engine.state.cards).filter(
        (card) => card.zone === "hand" && card.controller === "player-one",
      ),
    ).toHaveLength(2);
  },
);

it.each([engage, health])("rejects omitted or invalid X before paying $kind", (cost) => {
  for (const xValue of [undefined, -1, 1.5, NaN, Infinity]) {
    const { engine, cardId } = fixture(cost, [draw]);
    const before = structuredClone(engine.state);
    expect(
      applyCommand(engine.state, {
        type: "activateAbility",
        playerId: "player-one",
        cardId,
        abilityIndex: 0,
        xValue,
      }).success,
    ).toBe(false);
    expect(engine.state).toEqual(before);
  }
});

it("rejects unaffordable health X atomically", () => {
  const { engine, cardId } = fixture(health, [draw]);
  const before = structuredClone(engine.state);
  expect(
    applyCommand(engine.state, {
      type: "activateAbility",
      playerId: "player-one",
      cardId,
      abilityIndex: 0,
      xValue: before.players["player-one"].health + 1,
    }).success,
  ).toBe(false);
  expect(engine.state).toEqual(before);
});

it("does not ask players to declare a text-defined amount", () => {
  const { engine, cardId } = fixture(engage, [
    { type: "draw", amount: { type: "playedThisTurn", cardType: "clash" }, controller: "friendly" },
  ]);
  const action = engine
    .getInteractionView("p1")
    .actions.find((entry) => entry.id === `activateAbility:${cardId}:0`);
  expect(action).toBeDefined();
  expect(action?.inputs.find((input) => input.id === "xValue")).toBeUndefined();
});

it.each([0, 2])("declares health-only X=%i independently of fixed effect amounts", (xValue) => {
  const { engine, cardId } = fixture(health, [{ ...draw, amount: 1 }]);
  const before = engine.state.players["player-one"].health;
  const view = engine.getInteractionView("p1");
  const action = view.actions.find((entry) => entry.id === `activateAbility:${cardId}:0`)!;
  expect(action.inputs.find((input) => input.id === "xValue")).toBeDefined();
  expect(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action, values: { xValue } }),
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.players["player-one"].health).toBe(before - xValue);
});

it("does not borrow X from an ability being granted for a later activation", () => {
  const { engine, cardId } = fixture(engage, [
    {
      type: "grantAbility",
      target: { type: "self" },
      ability: { kind: "activated", text: "Draw X", cost: engage, effects: [draw] },
      duration: "endOfTurn",
    },
  ]);
  const action = engine
    .getInteractionView("p1")
    .actions.find((entry) => entry.id === `activateAbility:${cardId}:0`)!;
  expect(action.inputs.find((input) => input.id === "xValue")).toBeUndefined();
});

const suspendedEffects: readonly AcEffect[] = [
  { type: "chooseOne", options: [{ label: "Draw X", effects: [draw] }] },
  { type: "chooseCount", controller: "friendly", max: 1, then: [draw] },
  {
    type: "selectCards",
    target: { type: "card", controller: "friendly", zones: ["clash"] },
    min: 1,
    max: 1,
    then: [draw],
  },
];
it.each(suspendedEffects)("preserves X through a saved $type decision", (effect) => {
  let { engine, cardId } = fixture(engage, [effect]);
  const view = engine.getInteractionView("p1");
  const action = view.actions.find((entry) => entry.id === `activateAbility:${cardId}:0`)!;
  expect(action.inputs.find((input) => input.id === "xValue")).toBeDefined();
  expect(
    engine.submitInteraction(
      "p1",
      buildInteractionSubmission({ view, action, values: { xValue: 2 } }),
      context,
    ).success,
  ).toBe(true);
  for (let i = 0; i < 10 && engine.state.responseWindow; i++)
    expect(engine.dispatch("pass", engine.getActivePlayerId()!, {}, context).success).toBe(true);
  expect(engine.state.pendingChoices.length).toBeGreaterThan(0);
  for (let i = 0; i < 4 && engine.state.pendingChoices.length; i++) {
    engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
      p1: "player-one",
      p2: "player-two",
    });
    const choiceView = engine.getInteractionView("p1");
    const choice = choiceView.actions.find((entry) => entry.id.startsWith("resolveChoice:"))!;
    const input = choice.inputs[0];
    const values =
      input.kind === "number"
        ? { [input.id]: 1 }
        : input.kind === "option-selection"
          ? { [input.id]: [input.options[0].id] }
          : input.kind === "entity-selection"
            ? { [input.id]: [cardId] }
            : {};
    expect(
      engine.submitInteraction(
        "p1",
        buildInteractionSubmission({ view: choiceView, action: choice, values }),
        context,
      ).success,
    ).toBe(true);
  }
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(
    Object.values(engine.state.cards).filter(
      (card) => card.zone === "hand" && card.controller === "player-one",
    ),
  ).toHaveLength(2);
});
