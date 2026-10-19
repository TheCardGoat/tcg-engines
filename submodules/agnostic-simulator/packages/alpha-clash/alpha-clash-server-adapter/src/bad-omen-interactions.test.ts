import { expect, it } from "vite-plus/test";
import { action, getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
const omen = getCard("ac-cd1-005"),
  green = getCard("ac-ac2-025"),
  black = getCard("ac-ac4-008");
const draw = action({
  id: "adapter-omen-draw",
  name: "Draw two",
  colors: [],
  cost: { total: 0 },
  subtype: "basic",
  effects: [{ type: "draw", controller: "friendly", amount: 2 }],
});
const context = { gameId: "bad-omen-audit", sourceAuthority: "server" as const };
function fixture() {
  const g = Spec.fromFixture({
    definitions: [draw],
    playerOne: { hand: [draw], resource: [black, green], deck: [green, black] },
    playerTwo: { clash: [omen], resource: [green] },
  });
  const own = g.playerOne.at(green, "resource").instanceId,
    other = g.playerOne.at(black, "resource").instanceId,
    opposing = g.playerTwo.at(green, "resource").instanceId;
  g.playerOne.play(draw);
  for (let n = 0; n < 20 && g.state.responseWindow && !g.state.pendingChoices.length; n++)
    g.asPlayer(g.state.responseWindow.openFor).passRound();
  return {
    engine: new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
      p1: "player-one",
      p2: "player-two",
    }),
    own,
    other,
    opposing,
  };
}
function submit(engine: AlphaClashServerEngine, values: InteractionSubmission["values"]) {
  const view = engine.getInteractionView("p1"),
    action = view.actions.find((a) => a.id.startsWith("resolveChoice:"));
  if (!action) throw Error("Expected choice");
  return engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action, values }),
    context,
  );
}
it("Bad Omen exposes exact resource payment only when accepting, and records the selected resource across JSON", () => {
  let { engine, own, other } = fixture();
  const action = engine
    .getInteractionView("p1")
    .actions.find((a) => a.id.startsWith("resolveChoice:"))!;
  const payment = action.inputs.find((i) => i.id === "resourcePayment");
  expect(payment).toMatchObject({
    kind: "option-selection",
    required: false,
    min: 1,
    max: 1,
    requiredWhen: [{ all: [{ inputId: "confirm", value: true }] }],
  });
  if (payment?.kind !== "option-selection") throw Error("Expected payment");
  expect(payment.options.map((o) => o.id)).toEqual([
    JSON.stringify([other, "black"]),
    JSON.stringify([own, "green"]),
  ]);
  const before = structuredClone(engine.state);
  expect(submit(engine, { confirm: true }).success).toBe(false);
  expect(engine.state).toEqual(before);
  const result = submit(engine, {
    confirm: true,
    resourcePayment: [JSON.stringify([own, "green"])],
  });
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
    resourcePayment: [{ cardId: own, color: "green" }],
  });
  expect(engine.state.cards[own].ready).toBe(false);
  expect(engine.state.cards[other].ready).toBe(true);
  expect(Spec.fromState(engine.state).playerOne.handCount()).toBe(1);
  engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  expect(
    submit(engine, { confirm: true, resourcePayment: [JSON.stringify([other, "black"])] }).success,
  ).toBe(true);
  expect(Spec.fromState(engine.state).playerOne.handCount()).toBe(2);
  expect(engine.state.pendingChoices).toHaveLength(0);
});
it.each([false, true])(
  "declining Bad Omen requires no resource payment and ignores an earlier selected payment (%s)",
  (stale) => {
    const { engine, own, other } = fixture();
    expect(
      submit(engine, {
        confirm: false,
        ...(stale ? { resourcePayment: [JSON.stringify([own, "green"])] } : {}),
      }).success,
    ).toBe(true);
    expect(engine.state.cards[own].ready).toBe(true);
    expect(engine.state.cards[other].ready).toBe(true);
    expect(Spec.fromState(engine.state).playerOne.handCount()).toBe(0);
    expect(submit(engine, { confirm: false }).success).toBe(true);
    expect(engine.state.pendingChoices).toHaveLength(0);
  },
);
it.each(["opponent", "wrong-color", "duplicate"])(
  "Bad Omen rejects a forged %s payment without consuming the choice",
  (reason) => {
    const { engine, own, opposing } = fixture();
    const value = JSON.stringify([
      reason === "opponent" ? opposing : own,
      reason === "wrong-color" ? "black" : "green",
    ]);
    const before = structuredClone(engine.state);
    expect(
      submit(engine, {
        confirm: true,
        resourcePayment: reason === "duplicate" ? [value, value] : [value],
      }).success,
    ).toBe(false);
    expect(engine.state).toEqual(before);
  },
);
it("the raw choice command preserves explicit payments and still supports automatic payment when omitted", () => {
  const { engine, own, other } = fixture();
  const choice = engine.state.pendingChoices[0];
  expect(
    engine.dispatch(
      "resolveChoice",
      "p1",
      { choiceId: choice.id, optionId: "yes", resourcePayment: [{ cardId: own, color: "green" }] },
      context,
    ).success,
  ).toBe(true);
  expect(engine.state.cards[own].ready).toBe(false);
  expect(engine.state.cards[other].ready).toBe(true);
  expect(
    engine.dispatch(
      "resolveChoice",
      "p1",
      { choiceId: engine.state.pendingChoices[0].id, optionId: "yes" },
      context,
    ).success,
  ).toBe(true);
  expect(Spec.fromState(engine.state).playerOne.handCount()).toBe(2);
});
