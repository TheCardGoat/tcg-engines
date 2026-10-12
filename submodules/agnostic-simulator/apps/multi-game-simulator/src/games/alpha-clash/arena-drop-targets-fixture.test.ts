import { expect, test } from "vitest";
import { buildInteractionSubmission } from "@tcg/protocol";
import { autoAssignCostSlots } from "@tcg/simulator-ui";
import { createAlphaClashVisualFixture } from "./visual-fixtures";
import { resourceBoard } from "./resource-step-fixture";

test.each([
  ["Sonoro", "clash", 1],
  ["Webber's Binoculars", "accessory", 1],
  ["Antarctica", "clashground", 2],
] as const)("drop fixture can pay and resolve %s through native actions", (name, zone, cost) => {
  const engine = createAlphaClashVisualFixture("arena-drop-targets");
  const card = resourceBoard(engine).cards.find(
    (card) => card.zone === "hand" && card.name === name,
  )!;
  const view = engine.getInteractionView("human");
  const action = view.actions.find((action) => action.id === `playCard:${card.instanceId}`)!;
  expect(action.enabled).toBe(true);
  const payment = action.inputs.find((input) => input.id === "resourcePayment");
  if (payment?.kind !== "option-selection") throw new Error("Missing native payment");
  const assignment = autoAssignCostSlots(payment, []);
  expect(assignment).toHaveLength(cost);
  expect(
    engine.submitInteraction(
      "human",
      buildInteractionSubmission({
        view,
        action,
        values: { resourcePayment: assignment! },
      }),
      { gameId: "drop-targets", sourceAuthority: "server" },
    ).success,
  ).toBe(true);
  expect(resourceBoard(engine).cards.find((c) => c.instanceId === card.instanceId)?.zone).toBe(
    zone,
  );
  expect(
    resourceBoard(engine).cards.filter(
      (c) => c.controller === "player-one" && c.zone === "resource" && c.ready,
    ),
  ).toHaveLength(6 - cost);
  // The server engine drains both empty response windows in this transition.
  expect(engine.state.responseWindow).toBeNull();
  expect(engine.state.standby).toHaveLength(0);
  expect(resourceBoard(engine).cards.find((c) => c.instanceId === card.instanceId)?.zone).toBe(
    zone,
  );
});
