import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { AcTestEngine } from "@tcg/alpha-clash-engine/testing";
import { projectState } from "@tcg/alpha-clash-engine";
import { INTERACTION_PROTOCOL_VERSION, validateInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";
import { alphaClashSubmissionToPayload } from "./interaction-protocol";

function setup(health = 8) {
  const attacker = getCard("ac-ac1-027");
  const payment = getCard("ac-ac5-032");
  const game = AcTestEngine.fromFixture({
    turnNumber: 11,
    playerOne: { contender: getCard("ac-st-001"), clash: [attacker], hand: [attacker] },
    playerTwo: {
      contender: getCard("ac-ac1-096"),
      health,
      hand: [payment],
      resource: Array.from({ length: 5 }, () => payment),
    },
  });
  game.playerOne.attack(attacker, game.playerTwo.contender());
  const engine = new AlphaClashServerEngine(game.state, { p1: "player-one", p2: "player-two" });
  const view = engine.getInteractionView("p2");
  const action = view.actions.find((action) => action.id.startsWith("respond:"));
  if (!action) throw new Error("Missing health-payment action");
  const targetId = game.playerOne.at(attacker, "clash").instanceId;
  const submission = (amount: number) => ({
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    stateVersion: view.stateVersion,
    requestId: action.requestId,
    actionId: action.id,
    values: { healthReduction: amount, targetId: [targetId] },
  });
  return { engine, view, action, targetId, submission };
}
const context = { gameId: "payment", sourceAuthority: "server" as const };
it.each([0, 1, 4])(
  "pays %s health through the production adapter and resolves the real card",
  (amount) => {
    const { engine, action, targetId, submission } = setup();
    expect(action.source).toBeDefined();
    expect(action.inputs.find((input) => input.id === "healthReduction")).toMatchObject({
      kind: "number",
      min: 0,
      max: 4,
      step: 1,
    });
    const paymentId = amount === 0 ? "resourcePayment" : `healthResourcePayment:${amount}`;
    const payment = action.inputs.find((input) => input.id === paymentId);
    if (payment?.kind !== "option-selection") throw new Error("Missing native health quote");
    expect(payment.min).toBe(5 - amount);
    expect(payment.max).toBe(5 - amount);
    expect(payment.requiredWhen).toEqual([
      { all: [{ inputId: "healthReduction", value: amount }] },
    ]);
    const declared = {
      ...submission(amount),
      values: {
        ...submission(amount).values,
        [paymentId]: payment.options.slice(0, 5 - amount).map((option) => option.id),
      },
    };
    const mapped = alphaClashSubmissionToPayload(declared);
    expect(mapped.payload.healthReduction).toBe(amount);
    expect(engine.submitInteraction("p2", declared, context).success).toBe(true);
    expect(engine.state.players["player-two"].health).toBe(8 - amount);
    expect(
      Object.values(engine.state.cards).filter(
        (c) => c.controller === "player-two" && c.zone === "resource" && !c.ready,
      ),
    ).toHaveLength(5 - amount);
    for (let n = 0; n < 10 && engine.state.responseWindow; n++) {
      const actor = engine.getActivePlayerId();
      expect(engine.dispatch("pass", actor!, {}, context).success).toBe(true);
    }
    expect(engine.state.cards[targetId].zone).toBe("oblivion");
    expect(
      Object.values(engine.state.cards).find(
        (c) => c.definitionId === "ac-ac5-032" && c.zone === "banished",
      ),
    ).toBeDefined();
  },
);
it.each([-1, 0.5, 5, NaN, Infinity])(
  "rejects illegal payment %s without changing state, then permits retry",
  (amount) => {
    const { engine, view, submission } = setup();
    expect(validateInteractionSubmission(view, submission(amount)).ok).toBe(false);
    const before = JSON.stringify(engine.state);
    const mapped = alphaClashSubmissionToPayload(submission(amount));
    expect(engine.dispatch(mapped.moveType, "p2", mapped.payload, context).success).toBe(false);
    expect(JSON.stringify(engine.state)).toBe(before);
    const retry = alphaClashSubmissionToPayload(submission(0));
    expect(engine.dispatch(retry.moveType, "p2", retry.payload, context).success).toBe(true);
  },
);
it("caps the payment by current health and keeps the other hand private", () => {
  const { engine, action } = setup(2);
  expect(action.inputs.find((input) => input.id === "healthReduction")).toMatchObject({
    min: 0,
    max: 2,
  });
  const hidden = projectState(engine.state, "player-one").cards.filter(
    (c) => c.controller === "player-two" && c.zone === "hand",
  );
  expect(hidden.every((c) => c.name === null && c.definitionId === null)).toBe(true);
  expect(engine.getInteractionView("p1").actions.some((a) => a.id.startsWith("respond:"))).toBe(
    false,
  );
});

it("rejects the unreduced resource assignment for four health, then accepts the quoted payment", () => {
  const { engine, action, submission } = setup();
  const input = action.inputs.find((candidate) => candidate.id === "healthResourcePayment:4");
  if (input?.kind !== "option-selection") throw new Error("Missing reduced quote");
  const before = structuredClone(engine.state);
  const attempt = (count: number) => ({
    ...submission(4),
    values: {
      ...submission(4).values,
      "healthResourcePayment:4": input.options.slice(0, count).map((option) => option.id),
    },
  });
  expect(engine.submitInteraction("p2", attempt(5), context).success).toBe(false);
  expect(engine.state).toEqual(before);
  expect(engine.submitInteraction("p2", attempt(1), context).success).toBe(true);
  expect(engine.state.players["player-two"].health).toBe(4);
});
