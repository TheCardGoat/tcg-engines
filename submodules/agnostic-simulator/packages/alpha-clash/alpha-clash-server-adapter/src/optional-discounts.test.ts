import { expect, it } from "vitest";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const beginning = getCard("ac-ac5-118");
const incoming = getCard("ac-ac6-114");
function setup() {
  const game = Spec.fromFixture({
    playerOne: { hand: [incoming], resource: [beginning, beginning] },
    playerTwo: {
      hand: [beginning],
      resource: Array(4).fill(beginning),
      clash: [getCard("ac-ac2-121"), getCard("ac-ac3-092")],
    },
  });
  game.playerOne.play(incoming);
  return {
    game,
    engine: new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" }),
  };
}
it.each(["all", "none"])(
  "From Beginning to End submits the %s optional reductions route with the matching payment",
  (route) => {
    const { game, engine } = setup();
    const view = engine.getInteractionView("p2");
    const action = view.actions.find(
      (a) => a.id === `respond:${game.playerTwo.hand(beginning).instanceId}`,
    )!;
    expect(action.inputs.find((i) => i.id === "optionalDiscounts")).toBeDefined();
    const paymentKey = route === "all" ? "resourcePayment" : `discountResourcePayment:${route}`;
    const payment = action.inputs.find((i) => i.id === paymentKey);
    if (payment?.kind !== "option-selection") throw new Error("Missing route payment");
    expect(payment.min).toBe(route === "all" ? 1 : 4);
    const ids = payment.options.slice(0, payment.min).map((o) => o.id);
    const result = engine.submitInteraction(
      "p2",
      buildInteractionSubmission({
        view,
        action,
        values: {
          optionalDiscounts: [route],
          targetId: [game.playerOne.at(incoming, "standby").instanceId],
          [paymentKey]: ids,
        },
      }),
      { gameId: "discount", sourceAuthority: "server" },
    );
    expect(result.success).toBe(true);
    expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
      declineSelfCostReduction: route === "none",
    });
    expect(
      Object.values(engine.state.cards).filter(
        (c) => c.controller === "player-two" && c.zone === "resource" && c.ready,
      ),
    ).toHaveLength(route === "all" ? 3 : 0);
  },
);

it.each(["all", "none", "skip:0", "skip:1"])(
  "Anzudak declares independent optional discounts: %s",
  (route) => {
    const card = getCard("ac-sotv-038");
    const g = Spec.fromFixture({
      playerOne: {
        hand: [card],
        resource: Array(6).fill(card),
        clashground: [getCard("ac-ac2-101")],
        accessory: [{ card: getCard("ac-ac1-019"), faceDown: true, setOnTurn: 1 }],
      },
    });
    const engine = new AlphaClashServerEngine(g.state, { p1: "player-one", p2: "player-two" });
    const view = engine.getInteractionView("p1");
    const action = view.actions.find(
      (a) => a.id === `playCard:${g.playerOne.hand(card).instanceId}`,
    )!;
    const reductions = action.inputs.find((i) => i.id === "optionalDiscounts");
    if (reductions?.kind !== "option-selection") throw new Error("Missing discount options");
    expect(new Set(reductions.options.map((o) => o.text.key)).size).toBe(4);
    const key = route === "all" ? "resourcePayment" : `discountResourcePayment:${route}`;
    const payment = action.inputs.find((i) => i.id === key);
    if (payment?.kind !== "option-selection") throw new Error("Missing payment");
    const paid = route === "all" ? 4 : route === "none" ? 6 : 5;
    expect(payment.min).toBe(paid);
    const result = engine.submitInteraction(
      "p1",
      buildInteractionSubmission({
        view,
        action,
        values: {
          optionalDiscounts: [route],
          [key]: payment.options.slice(0, paid).map((o) => o.id),
        },
      }),
      { gameId: "independent-discounts", sourceAuthority: "server" },
    );
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(
      Object.values(engine.state.cards).filter(
        (c) => c.controller === "player-one" && c.zone === "resource" && c.ready,
      ),
    ).toHaveLength(6 - paid);
    if (route.startsWith("skip:"))
      expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
        declinedConditionalDiscounts: [Number(route.slice(5))],
      });
  },
);

it("rejects an unknown discount route or an undersized declined payment without state changes", () => {
  const { game, engine } = setup();
  const view = engine.getInteractionView("p2");
  const action = view.actions.find(
    (a) => a.id === `respond:${game.playerTwo.hand(beginning).instanceId}`,
  )!;
  const payment = action.inputs.find((i) => i.id === "discountResourcePayment:none");
  if (payment?.kind !== "option-selection") throw new Error("Missing payment");
  const before = structuredClone(engine.state);
  for (const route of ["skip:99", "none"]) {
    const result = engine.submitInteraction(
      "p2",
      buildInteractionSubmission({
        view,
        action,
        values: {
          optionalDiscounts: [route],
          targetId: [game.playerOne.at(incoming, "standby").instanceId],
          "discountResourcePayment:none": payment.options.slice(0, 1).map((o) => o.id),
        },
      }),
      { gameId: "invalid-discount", sourceAuthority: "server" },
    );
    expect(result.success).toBe(false);
    expect(engine.state).toEqual(before);
  }
});
