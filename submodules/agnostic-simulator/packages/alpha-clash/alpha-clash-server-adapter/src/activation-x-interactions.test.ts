import { expect, it } from "vite-plus/test";
import { getCard } from "@tcg/alpha-clash-cards";
import { applyCommand } from "@tcg/alpha-clash-engine";
import { Spec } from "@tcg/alpha-clash-engine/testing";
import type { AcClashCard } from "@tcg/alpha-clash-types";
import { buildInteractionSubmission } from "@tcg/protocol";
import { AlphaClashServerEngine } from "./alpha-clash-server-engine";

// Contract fixture, not a claim that an unaudited printed card is implemented.
const source: AcClashCard = {
  id: "activation-x-contract",
  name: "Activation X",
  cardType: "clash",
  colors: ["red"],
  cost: { total: 0 },
  attack: 1,
  defense: 1,
  abilities: [
    {
      kind: "activated",
      text: "Pay 1+X: Draw X cards.",
      cost: { kind: "resources", cost: { total: 1, pips: { red: 1 }, x: true } },
      alternateCosts: [{ kind: "resources", cost: { total: 0, x: true } }],
      effects: [{ type: "draw", amount: "x", controller: "friendly" }],
    },
  ],
};
function fixture() {
  const resource = getCard("ac-ac6-162");
  const g = Spec.fromFixture({
    definitions: [source],
    playerOne: {
      clash: [source],
      resource: [resource, resource, resource],
      deck: [resource, resource, resource],
    },
  });
  return { g, cardId: g.playerOne.at(source, "clash").instanceId };
}
it.each([
  [0, 0, 1],
  [0, 2, 3],
  [1, 2, 2],
])("declares activation route %i X=%i and pays %i resources", (costIndex, xValue, paid) => {
  const { g, cardId } = fixture();
  const engine = new AlphaClashServerEngine(JSON.parse(JSON.stringify(g.state)), {
    p1: "player-one",
    p2: "player-two",
  });
  const view = engine.getInteractionView("p1");
  const action = view.actions.find(
    (action) => action.id === `activateAbility:${cardId}:0${costIndex ? `:${costIndex}` : ""}`,
  );
  expect(action?.inputs.find((input) => input.id === "xValue")).toMatchObject({
    kind: "number",
    min: 0,
    step: 1,
    required: true,
  });
  if (!action) throw Error("Missing activation");
  const result = engine.submitInteraction(
    "p1",
    buildInteractionSubmission({ view, action, values: { xValue } }),
    { gameId: "activation-x", sourceAuthority: "server" },
  );
  expect(result.success, JSON.stringify(result)).toBe(true);
  expect(
    Object.values(engine.state.cards).filter((card) => card.zone === "resource" && !card.ready),
  ).toHaveLength(paid);
  for (let i = 0; i < 10 && engine.state.responseWindow; i++)
    expect(
      engine.dispatch(
        "pass",
        engine.getActivePlayerId()!,
        {},
        { gameId: "activation-x", sourceAuthority: "server" },
      ).success,
    ).toBe(true);
  expect(
    Object.values(engine.state.cards).filter(
      (card) => card.zone === "hand" && card.controller === "player-one",
    ),
  ).toHaveLength(xValue);
});
it.each([undefined, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 3])(
  "rejects missing, invalid or unaffordable activation X=%s atomically",
  (xValue) => {
    const { g, cardId } = fixture();
    const before = structuredClone(g.state);
    const result = applyCommand(g.state, {
      type: "activateAbility",
      playerId: "player-one",
      cardId,
      abilityIndex: 0,
      xValue,
    });
    expect(result.success).toBe(false);
    expect(g.state).toEqual(before);
  },
);
