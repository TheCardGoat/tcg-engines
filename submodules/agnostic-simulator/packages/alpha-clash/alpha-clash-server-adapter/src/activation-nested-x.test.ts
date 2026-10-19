import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import type { AcAbility, AcClashCard, AcEffect } from "@tcg/alpha-clash-types";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const context = { gameId: "nested-x", sourceAuthority: "server" as const };
const draw: AcEffect = { type: "draw", amount: "x", controller: "friendly" };
const optionalPayment: AcEffect = {
  type: "optional",
  prompt: "Pay 1+X to draw X?",
  cost: { kind: "resources", cost: { total: 1, pips: { red: 1 }, x: true } },
  effects: [draw],
};
function fixture(effects: readonly AcEffect[], followup?: AcAbility) {
  const source: AcClashCard = {
    id: "nested-x-contract",
    name: "Nested X contract",
    cardType: "clash",
    colors: ["red"],
    cost: { total: 0 },
    attack: 3,
    defense: 3,
    abilities: [
      { kind: "activated", text: "Declare X", oncePerTurn: true, effects },
      ...(followup ? [followup] : []),
    ],
  };
  const filler = getCard("ac-ac6-162");
  const g = Spec.fromFixture({
    turnNumber: 3,
    definitions: [source],
    playerOne: {
      clash: [source],
      resource: [filler, filler, filler],
      deck: [filler, filler, filler],
    },
  });
  return {
    engine: new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" }),
    cardId: g.playerOne.at(source, "clash").instanceId,
  };
}
function submit(
  engine: AlphaClashServerEngine,
  actionId: string,
  values: InteractionSubmission["values"] = {},
) {
  const player = engine.getActivePlayerId()!;
  const view = engine.getInteractionView(player);
  const action = view.actions.find((entry) => entry.id === actionId);
  if (!action) throw new Error(`Missing ${actionId}: ${view.actions.map((entry) => entry.id)}`);
  return engine.submitInteraction(
    player,
    buildInteractionSubmission({ view, action, values }),
    context,
  );
}
function resolveWindows(engine: AlphaClashServerEngine) {
  for (let i = 0; i < 10 && engine.state.responseWindow; i++)
    expect(submit(engine, "pass").success).toBe(true);
}
function restore(engine: AlphaClashServerEngine) {
  return new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
    p1: "player-one",
    p2: "player-two",
  });
}
function handSize(engine: AlphaClashServerEngine) {
  return Object.values(engine.state.cards).filter(
    (card) => card.zone === "hand" && card.controller === "player-one",
  ).length;
}
it.each([0, 2])("quotes and pays nested 1+X resources for X=%i after restore", (xValue) => {
  let { engine, cardId } = fixture([{ ...optionalPayment, effects: [{ ...draw, amount: 1 }] }]);
  expect(submit(engine, `activateAbility:${cardId}:0`, { xValue }).success).toBe(true);
  resolveWindows(engine);
  engine = restore(engine);
  const choice = engine
    .getInteractionView("p1")
    .actions.find((entry) => entry.id.startsWith("resolveChoice:"))!;
  const payment = choice.inputs.find((input) => input.id === "resourcePayment");
  expect(payment).toMatchObject({ kind: "option-selection", min: 1 + xValue, max: 1 + xValue });
  if (payment?.kind !== "option-selection") throw new Error("Missing payment");
  const ids = payment.options
    .filter((option) => JSON.parse(option.id)[1] === "red")
    .slice(0, 1 + xValue)
    .map((option) => option.id);
  if (xValue > 0) {
    const before = structuredClone(engine.state);
    expect(
      submit(engine, choice.id, { confirm: true, resourcePayment: ids.slice(0, 1) }).success,
    ).toBe(false);
    expect(engine.state).toEqual(before);
  }
  const result = submit(engine, choice.id, { confirm: true, resourcePayment: ids });
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(
    Object.values(engine.state.cards).filter((card) => card.zone === "resource" && !card.ready),
  ).toHaveLength(1 + xValue);
  expect(handSize(engine)).toBe(1);
});
it("does not offer an unaffordable nested X resource payment", () => {
  const { engine, cardId } = fixture([optionalPayment]);
  expect(submit(engine, `activateAbility:${cardId}:0`, { xValue: 3 }).success).toBe(true);
  resolveWindows(engine);
  expect(engine.state.pendingChoices).toHaveLength(0);
  expect(handSize(engine)).toBe(0);
  expect(
    Object.values(engine.state.cards).filter((card) => card.zone === "resource" && card.ready),
  ).toHaveLength(3);
});
it("declines nested X payment without spending or drawing", () => {
  let { engine, cardId } = fixture([optionalPayment]);
  expect(submit(engine, `activateAbility:${cardId}:0`, { xValue: 2 }).success).toBe(true);
  resolveWindows(engine);
  engine = restore(engine);
  const choice = engine
    .getInteractionView("p1")
    .actions.find((entry) => entry.id.startsWith("resolveChoice:"))!;
  expect(submit(engine, choice.id, { confirm: false }).success).toBe(true);
  expect(handSize(engine)).toBe(0);
  expect(
    Object.values(engine.state.cards).filter((card) => card.zone === "resource" && card.ready),
  ).toHaveLength(3);
});

it.each(["watchDefeat", "watchDamageToContender", "watchClashDamageToContender"] as const)(
  "retains declared X for %s after saving the delayed effect",
  (type) => {
    const watcher: AcEffect =
      type === "watchDefeat"
        ? { type, target: { type: "self" }, effects: [draw] }
        : { type, target: { type: "self" }, effects: [draw], duration: "endOfTurn" };
    const followup: AcAbility = {
      kind: "activated",
      text: "Cause watched event",
      effects:
        type === "watchDefeat"
          ? [{ type: "defeat", target: { type: "self" } }]
          : [
              {
                type: "dealDamage",
                target: { type: "contender", controller: "opponent" },
                amount: 10,
                damageType: "non-clash",
              },
            ],
    };
    let { engine, cardId } = fixture([watcher], followup);
    expect(submit(engine, `activateAbility:${cardId}:0`, { xValue: 2 }).success).toBe(true);
    resolveWindows(engine);
    engine = restore(engine);
    if (type === "watchClashDamageToContender") {
      const target = Object.values(engine.state.cards).find(
        (card) => card.zone === "contender" && card.controller === "player-two",
      )!;
      expect(
        submit(engine, "initiateClash", { attackerId: [cardId], targetId: [target.instanceId] })
          .success,
      ).toBe(true);
      for (let i = 0; i < 20 && engine.state.phase.name === "clash"; i++) {
        const view = engine.getInteractionView(engine.getActivePlayerId()!);
        if (view.actions.some((action) => action.id === "declareObstructors"))
          expect(submit(engine, "declareObstructors", { obstructorIds: [] }).success).toBe(true);
        else
          expect(
            submit(
              engine,
              view.actions.some((action) => action.id === "passClashStep")
                ? "passClashStep"
                : "pass",
            ).success,
          ).toBe(true);
      }
    } else {
      expect(submit(engine, `activateAbility:${cardId}:1`).success).toBe(true);
      resolveWindows(engine);
    }
    expect(handSize(engine)).toBe(2);
  },
);
