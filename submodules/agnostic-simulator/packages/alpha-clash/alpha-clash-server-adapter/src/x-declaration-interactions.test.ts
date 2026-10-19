import { expect, it } from "vite-plus/test";
import { hydraStrike, skirmisher, tormentor } from "@tcg/alpha-clash-cards";
import { applyCommand } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import { buildInteractionSubmission, type InteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

const seats = { p1: "player-one", p2: "player-two" } as const;
const context = { gameId: "x-declaration", sourceAuthority: "server" as const };
function fixture() {
  const game = Spec.fromFixture({
    playerOne: { hand: [hydraStrike], resource: [skirmisher, skirmisher, skirmisher] },
    playerTwo: { clash: [tormentor, tormentor] },
  });
  return {
    game,
    cardId: game.playerOne.hand(hydraStrike).instanceId,
    targets: game.playerTwo.instances(tormentor).map((card) => card.instanceId),
    engine: new AlphaClashServerEngine(JSON.parse(JSON.stringify(game.state)), seats),
  };
}
function request(
  engine: AlphaClashServerEngine,
  cardId: string,
  values: InteractionSubmission["values"],
) {
  const view = engine.getInteractionView("p1");
  const action = view.actions.find((candidate) => candidate.id === `playCard:${cardId}`);
  if (!action) throw Error("Missing Hydra Strike play action");
  expect(action.inputs.find((input) => input.id === "xValue")).toMatchObject({
    kind: "number",
    required: true,
    min: 0,
    step: 1,
  });
  return engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action, values }),
    context,
  );
}

it.each([0, 2])(
  "declares X=%i for an Action and preserves the selected duplicate and payment after restore",
  (xValue) => {
    const { game, cardId, targets, engine } = fixture();
    expect(
      applyCommand(structuredClone(game.state), {
        type: "playCard",
        playerId: "player-one",
        cardId,
        targetId: targets[1],
        xValue,
      }).success,
    ).toBe(true);
    const result = request(engine, cardId, { targetId: [targets[1]], xValue });
    expect(result.success, JSON.stringify(result)).toBe(true);
    expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
      type: "playCard",
      cardId,
      targetId: targets[1],
      xValue,
    });
    const restored = new AlphaClashServerEngine(JSON.parse(JSON.stringify(engine.state)), seats);
    expect(restored.state.cards[targets[0]].phaseDamage).toBe(0);
    expect(restored.state.cards[targets[1]].phaseDamage).toBe(xValue);
    expect(restored.state.cards[cardId].zone).toBe("oblivion");
    expect(
      Object.values(restored.state.cards).filter(
        (card) => card.controller === "player-one" && card.zone === "resource" && !card.ready,
      ),
    ).toHaveLength(1 + xValue);
  },
);
it.each([undefined, -1, 0.5, 3])(
  "rejects missing, invalid, or unaffordable X (%s) without mutation",
  (xValue) => {
    const { cardId, targets, engine } = fixture();
    const before = structuredClone(engine.state);
    const result = request(engine, cardId, {
      targetId: [targets[1]],
      ...(xValue === undefined ? {} : { xValue }),
    });
    expect(result.success).toBe(false);
    expect(engine.state).toEqual(before);
  },
);

it("projects manual X payment and engages the selected resource rather than the automatic first resource", () => {
  const { cardId, targets, engine } = fixture();
  const resources = Object.values(engine.state.cards).filter(
    (card) => card.controller === "player-one" && card.zone === "resource",
  );
  const action = engine
    .getInteractionView("p1")
    .actions.find((entry) => entry.id === `playCard:${cardId}`)!;
  expect(action.inputs.find((input) => input.id === "xResourcePayment")).toMatchObject({
    kind: "option-selection",
    required: false,
    min: 0,
    max: 3,
  });
  const selected = resources[2].instanceId;
  const result = request(engine, cardId, {
    targetId: [targets[1]],
    xValue: 0,
    xResourcePayment: [JSON.stringify([selected, "red"])],
  });
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(result.acceptedMoveRecord?.processedCommand).toMatchObject({
    resourcePayment: [{ cardId: selected, color: "red" }],
  });
  expect(resources.map((card) => engine.state.cards[card.instanceId].ready)).toEqual([
    true,
    true,
    false,
  ]);
});
it.each([0, 2])(
  "rejects an explicit %i-resource payment for X=2 without silently falling back to automatic payment",
  (count) => {
    const { cardId, targets, engine } = fixture();
    const selected = Object.values(engine.state.cards)
      .filter((card) => card.controller === "player-one" && card.zone === "resource")
      .slice(0, count)
      .map((card) => JSON.stringify([card.instanceId, "red"]));
    const before = structuredClone(engine.state);
    expect(
      request(engine, cardId, { targetId: [targets[1]], xValue: 2, xResourcePayment: selected })
        .success,
    ).toBe(false);
    expect(engine.state).toEqual(before);
  },
);
