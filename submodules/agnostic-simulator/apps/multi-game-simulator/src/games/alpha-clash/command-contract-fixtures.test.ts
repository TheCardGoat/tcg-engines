import { expect, it } from "vite-plus/test";
import { createCommandContractFixture } from "./command-contract-fixtures";
import { fixtureAnswer, fixturePassResponses, fixtureSubmit } from "./native-fixture-test-actions";

it("pays Magnate's alternative activation despite its engaged source", () => {
  const engine = createCommandContractFixture("activation-cost-routes");
  const source = Object.values(engine.state.cards).find((card) => card.zone === "clash")!;
  const replacement = Object.values(engine.state.cards).find((card) => card.zone === "hand")!;
  const actions = engine.getInteractionView("human").actions;
  expect(
    actions.find((action) => action.id === `activateAbility:${source.instanceId}:1`)?.enabled,
  ).toBe(false);
  fixtureSubmit(engine, `activateAbility:${source.instanceId}:1:1`);
  fixturePassResponses(engine);
  fixtureAnswer(engine, { selection: ["0"] });
  expect(engine.state.cards[source.instanceId].zone).toBe("oblivion");
  expect(engine.state.cards[replacement.instanceId].zone).toBe("clash");
  expect(
    Object.values(engine.state.cards).filter((card) => card.zone === "resource" && card.ready),
  ).toHaveLength(0);
});

it("sends only the selected native Nova and resolves Flare's activation", () => {
  const engine = createCommandContractFixture("activation-send-cost");
  const action = engine
    .getInteractionView("human")
    .actions.find((entry) => entry.inputs.some((input) => input.id === "sendCostCardIds"))!;
  const cost = action.inputs.find((input) => input.id === "sendCostCardIds");
  if (cost?.kind !== "entity-selection") throw new Error("Missing Nova cost");
  const [kept, spent] = cost.candidates.map((candidate) => candidate.entity.instanceId);
  const target = Object.values(engine.state.cards).find(
    (card) => card.zone === "contender" && card.controller === "player-two",
  )!;
  fixtureSubmit(engine, action.id, { targetId: [target.instanceId], sendCostCardIds: [spent] });
  fixturePassResponses(engine);
  expect(engine.state.cards[kept]?.zone).toBe("accessory");
  expect(engine.state.cards[spent]?.zone).not.toBe("accessory");
  expect(engine.state.players["player-one"].health).toBe(29);
  expect(engine.state.players["player-two"].health).toBe(28);
});

it.each([false, true])("nested X optional payment accepts=%s", (accept) => {
  const engine = createCommandContractFixture("activation-nested-x");
  const source = Object.values(engine.state.cards).find(
    (card) => card.definitionId === "nested-x-contract",
  )!;
  fixtureSubmit(engine, `activateAbility:${source.instanceId}:0`, { xValue: 2 });
  fixturePassResponses(engine);
  const payment = engine
    .getInteractionView("human")
    .actions.flatMap((action) => action.inputs)
    .find((input) => input.id === "resourcePayment");
  if (payment?.kind !== "option-selection") throw new Error("Missing optional payment");
  fixtureAnswer(engine, {
    confirm: accept,
    ...(accept ? { resourcePayment: payment.options.map((option) => option.id) } : {}),
  });
  expect(
    Object.values(engine.state.cards).filter(
      (card) => card.controller === "player-one" && card.zone === "hand",
    ),
  ).toHaveLength(accept ? 2 : 0);
  expect(
    Object.values(engine.state.cards).filter((card) => card.zone === "resource" && card.ready),
  ).toHaveLength(accept ? 0 : 3);
  expect(engine.state.pendingChoices).toHaveLength(0);
});
