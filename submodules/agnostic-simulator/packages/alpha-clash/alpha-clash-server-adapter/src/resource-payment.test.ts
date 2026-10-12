import { expect, test } from "vitest";
import { getCard } from "@tcg/alpha-clash-cards";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

test("response slots forward declared payments to the native Trap command", () => {
  const attacker = getCard("ac-ac1-027");
  const missile = getCard("ac-ac1-020");
  const game = Spec.fromFixture({
    turnNumber: 3,
    playerOne: { clash: [attacker] },
    playerTwo: {
      accessory: [{ card: missile, faceDown: true, setOnTurn: 1 }],
      resource: [missile, missile, missile],
    },
  });
  game.playerOne.attack(attacker, game.playerTwo.contender());
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const view = engine.getInteractionView("p2");
  const action = view.actions.find((a) => a.id.startsWith("respond:"))!;
  const payment = action.inputs.find((i) => i.id === "resourcePayment");
  if (payment?.kind !== "option-selection") throw new Error("Missing Trap payment");
  const ids = payment.options.slice(0, payment.min).map((o) => o.id);
  const result = engine.submitInteraction(
    "p2",
    buildInteractionSubmission({
      view,
      action,
      values: {
        targetId: [game.playerOne.at(attacker, "clash").instanceId],
        resourcePayment: ids,
      },
    }),
    { gameId: "payment-response", sourceAuthority: "server" },
  );
  expect(result.success).toBe(true);
  expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
    resourcePayment: ids.map((id) => {
      const [cardId, color] = JSON.parse(id);
      return { cardId, color };
    }),
  });
  expect(ids.every((id) => !engine.state.cards[JSON.parse(id)[0]].ready)).toBe(true);
});

test("malformed raw payment is rejected without state mutation", () => {
  const card = getCard("ac-ac1-027");
  const game = Spec.fromFixture({ playerOne: { hand: [card], resource: [card] } });
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const before = structuredClone(engine.state);
  for (const resourcePayment of ["bad", [{ cardId: "unknown", color: "purple" }], [null]]) {
    expect(
      engine.dispatch(
        "playCard",
        "p1",
        { cardId: game.playerOne.at(card, "hand").instanceId, resourcePayment },
        { gameId: "invalid", sourceAuthority: "server" },
      ).success,
    ).toBe(false);
    expect(engine.state).toEqual(before);
  }
});
