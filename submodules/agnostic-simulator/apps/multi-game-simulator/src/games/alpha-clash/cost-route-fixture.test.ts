import { fixtureAttack } from "./native-fixture-test-actions";
import { expect, test } from "vite-plus/test";
import {
  EngineInteractionView,
  INTERACTION_PROTOCOL_VERSION,
  type InteractionSubmission,
} from "@tcg/protocol";
import { createCostRouteFixture } from "./cost-route-fixture";

type Engine = ReturnType<typeof createCostRouteFixture>;
function setup(id = "prompt-cost-routes", definition = "ac-ac2-014") {
  const engine = createCostRouteFixture(id);
  if (id === "prompt-discount-cost") fixtureAttack(engine);
  const view = engine.getInteractionView("human");
  expect(EngineInteractionView.safeParse(view).success).toBe(true);
  const source = Object.values(engine.state.cards).find(
    (c) => c.zone === "hand" && c.controller === "player-one" && c.definitionId === definition,
  )!;
  const action = view.actions.find(
    (a) =>
      a.id === `${id === "prompt-discount-cost" ? "respond" : "playCard"}:${source.instanceId}`,
  )!;
  expect(action).toBeDefined();
  expect(action.source?.instanceId).toBe(source.instanceId);
  const resources = action.inputs.find((i) => i.id === "costResources");
  if (resources?.kind !== "option-selection") throw new Error("Missing resource choices");
  const submit = (values: InteractionSubmission["values"]) =>
    engine.submitInteraction(
      "human",
      {
        protocolVersion: INTERACTION_PROTOCOL_VERSION,
        stateVersion: view.stateVersion,
        requestId: action.requestId,
        actionId: action.id,
        values,
      },
      { gameId: id, sourceAuthority: "server" },
    );
  return { engine, view, action, source, resources: resources.options.map((o) => o.id), submit };
}

test("alternate route requires the right friendly card and pays through the native command", () => {
  const { engine, action, source, submit } = setup();
  const payment = action.inputs.find((i) => i.id === "alternatePayment:0");
  if (payment?.kind !== "entity-selection") throw new Error("Missing alternate payment");
  expect(payment.candidates).toHaveLength(1);
  const target = payment.candidates[0]!.entity.instanceId;
  const before = structuredClone(engine.state);
  expect(submit({ costRoute: ["alternative"] }).success).toBe(false);
  expect(
    submit({
      costRoute: ["alternative"],
      "alternatePayment:0": [source.instanceId],
    }).success,
  ).toBe(false);
  expect(engine.state).toEqual(before);
  expect(submit({ costRoute: ["alternative"], "alternatePayment:0": [target] }).success).toBe(true);
  expect(engine.state.cards[target]?.zone).toBe("hand");
  expect(engine.state.cards[source.instanceId]?.zone).toBe("clash");
  expect(
    Object.values(engine.state.cards)
      .filter((c) => c.zone === "resource")
      .every((c) => c.ready),
  ).toBe(true);
});

test("normal route rejects an incomplete payment without spending; retry succeeds", () => {
  const { engine, submit, resources } = setup();
  const before = structuredClone(engine.state);
  expect(submit({ costRoute: ["normal"], costResources: resources.slice(0, 1) }).success).toBe(
    false,
  );
  expect(engine.state).toEqual(before);
  // Shadowlight, Darkness Rising costs two generic resources.
  expect(submit({ costRoute: ["normal"], costResources: resources.slice(0, 2) })).toMatchObject({
    success: true,
  });
});

test("mandatory discard is not waived by resource payment", () => {
  const { engine, action, source, submit, resources } = setup(
    "prompt-additional-cost",
    "ac-ac7-186",
  );
  const input = action.inputs.find((i) => i.id === "discardCostIds");
  if (input?.kind !== "entity-selection") throw new Error("Missing discard");
  expect(input.candidates.some((c) => c.entity.instanceId === source.instanceId)).toBe(false);
  const target = input.candidates[0]!.entity.instanceId;
  const before = structuredClone(engine.state);
  expect(submit({ costRoute: ["normal"], costResources: resources.slice(0, 3) }).success).toBe(
    false,
  );
  expect(engine.state).toEqual(before);
  expect(
    submit({
      costRoute: ["normal"],
      discardCostIds: [target],
      costResources: resources.slice(0, 3),
    }),
  ).toMatchObject({ success: true });
  expect(engine.state.cards[target]?.zone).toBe("oblivion");
});

test.each(["normal", "additional"])(
  "optional discard route %s uses native Counter payment",
  (route) => {
    const { engine, action, submit, resources } = setup("prompt-discount-cost", "ac-ac2-022");
    const input = action.inputs.find((i) => i.id === "discountDiscardIds");
    if (input?.kind !== "entity-selection") throw new Error("Missing discount discard");
    const target = input.candidates[0]!.entity.instanceId;
    const values = {
      costRoute: [route],
      ...(route === "normal"
        ? { costResources: resources.slice(0, 2) }
        : {
            discountResources: resources.slice(0, 1),
            discountDiscardIds: [target],
          }),
    };
    expect(submit(values)).toMatchObject({ success: true });
    expect(engine.state.cards[target]?.zone).toBe(route === "normal" ? "hand" : "oblivion");
  },
);

test("opponent and spectator projections do not expose the private payment candidates", () => {
  const { engine, action } = setup();
  for (const actor of ["bot", "spectator"]) {
    const view = engine.getInteractionView(actor);
    expect(view.actions.some((a) => a.id === action.id)).toBe(false);
    expect(JSON.stringify(view)).not.toContain("discountDiscardIds");
  }
});

test("direct commands reject malformed, duplicate, enemy and wrong-color resources atomically", () => {
  const { engine, source, resources } = setup();
  const own = JSON.parse(resources[0]!)[0]!;
  const enemy = Object.values(engine.state.cards).find(
    (c) => c.controller === "player-two" && c.zone === "resource",
  )!;
  const before = structuredClone(engine.state);
  for (const payment of [
    "invalid",
    [{ cardId: own, color: "invalid" }],
    [
      { cardId: own, color: "white" },
      { cardId: own, color: "white" },
    ],
    [
      { cardId: own, color: "white" },
      { cardId: enemy.instanceId, color: "green" },
    ],
    [
      { cardId: own, color: "black" },
      { cardId: JSON.parse(resources[1]!)[0], color: "white" },
    ],
  ]) {
    expect(
      engine.dispatch(
        "playCard",
        "human",
        { cardId: source.instanceId, resourcePayment: payment },
        { gameId: "illegal-payment", sourceAuthority: "server" },
      ).success,
    ).toBe(false);
    expect(engine.state).toEqual(before);
  }
});
