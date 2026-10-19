import {
  fixtureBeginDestination,
  fixtureBeginShieldForetell,
  fixtureAttack,
  fixtureSubmit,
  fixturePassResponses,
} from "./native-fixture-test-actions";
import { expect, test } from "vite-plus/test";
import { INTERACTION_PROTOCOL_VERSION, type InteractionSubmission } from "@tcg/protocol";
import { createDestinationFixture, destinationFixtures } from "./destination-fixtures";

type Engine = ReturnType<typeof createDestinationFixture>;
function submit(engine: Engine, values: InteractionSubmission["values"], actionId?: string) {
  const actor = engine.getActivePlayerId()!;
  const view = engine.getInteractionView(actor);
  const action = view.actions.find((a) =>
    actionId ? a.id === actionId : a.id.startsWith("resolveChoice:"),
  )!;
  if (!action) throw new Error("Missing native choice");
  return engine.submitInteraction(
    actor,
    {
      protocolVersion: INTERACTION_PROTOCOL_VERSION,
      stateVersion: view.stateVersion,
      requestId: action.requestId,
      actionId: action.id,
      values,
    },
    { gameId: "destination-test", sourceAuthority: "server" },
  );
}
for (const fixture of destinationFixtures)
  test(`${fixture.id} uses real native choices`, () => {
    const engine = createDestinationFixture(fixture.id);
    if (fixture.id !== "destination-send") fixtureBeginDestination(engine, fixture.id);
    const actor = engine.getActivePlayerId()!;
    const view = engine.getInteractionView(actor);
    const action = view.actions.find((a) =>
      fixture.id === "destination-return"
        ? a.text.key.startsWith("Play Rebound")
        : fixture.id === "destination-send"
          ? a.inputs.some((input) => input.id === "sendCostCardIds")
          : a.id.startsWith("resolveChoice:"),
    );
    expect(action).toBeDefined();
    const input =
      fixture.id === "destination-send"
        ? action!.inputs.find((input) => input.id === "sendCostCardIds")!
        : action!.inputs[0];
    if (input.kind !== "entity-selection" && input.kind !== "option-selection")
      throw new Error("Expected card input");
    expect(input.cardDestination).toBeDefined();
  });
for (const [id, zone] of [
  ["discard", "oblivion"],
  ["select", "resource"],
])
  test(`${id} rejects an illegal card then moves only a legal selection`, () => {
    const engine = createDestinationFixture(`destination-${id}`);
    fixtureBeginDestination(engine, `destination-${id}`);
    const choice = engine.state.pendingChoices[0];
    const before = structuredClone(engine.state);
    expect(submit(engine, { selection: ["not-eligible"] }).success).toBe(false);
    expect(engine.state).toEqual(before);
    const action = engine
      .getInteractionView(engine.getActivePlayerId()!)
      .actions.find((a) => a.id.startsWith("resolveChoice:"))!;
    const input = action.inputs[0];
    const entity =
      input.kind === "entity-selection"
        ? input.candidates[0].entity.instanceId
        : input.kind === "option-selection"
          ? input.options[0].entity!.instanceId
          : "";
    const option =
      choice.kind === "target" ? entity : choice.kind === "modal" ? choice.options[0].id : "";
    // Fill every required input: choices may chain a destination pick (e.g.
    // Trugg banishes from Oblivion and then sends the declared card to hand).
    const values: InteractionSubmission["values"] = { selection: [option] };
    for (const extra of action.inputs) {
      if (extra.id === "selection" || !extra.required) continue;
      if (extra.kind !== "entity-selection") continue;
      const candidate = extra.candidates.find((entry) => entry.enabled);
      if (candidate) values[extra.id] = [candidate.entity.instanceId];
    }
    expect(submit(engine, values).success).toBe(true);
    expect(engine.state.cards[entity].zone).toBe(zone);
  });
test("revealed deck card stays in its zone when Archaic Shield is declined", () => {
  const engine = createDestinationFixture("destination-reveal");
  fixtureBeginDestination(engine, "destination-reveal");
  const top = engine.state.deckOrder["player-two"][0];
  expect(engine.state.cards[top].zone).toBe("deck");
  expect(engine.state.moveLog.some((e) => e.type === "effect.reveal")).toBe(true);
  const choice = engine.state.pendingChoices[0];
  if (choice.kind !== "modal") throw new Error("Expected selection");
  expect(
    submit(engine, { selection: [choice.options.find((o) => o.label === "Done")!.id] }).success,
  ).toBe(true);
  expect(engine.state.deckOrder["player-two"][0]).toBe(top);
  expect(engine.state.cards[top].zone).toBe("deck");
});

test("return offers only engaged cards and resolves into the owner's hand", () => {
  const engine = createDestinationFixture("destination-return");
  fixtureBeginDestination(engine, "destination-return");
  const action = engine
    .getInteractionView("human")
    .actions.find((a) => a.text.key.startsWith("Play Rebound"))!;
  const input = action.inputs[0];
  if (input.kind !== "entity-selection") throw new Error("Expected target");
  expect(input.candidates).toHaveLength(1);
  const target = input.candidates[0].entity.instanceId;
  // Playing carries the resource-payment input; assign the cost-slot options.
  const paymentInput = action.inputs.find(
    (entry) => entry.kind === "option-selection" && entry.id === "resourcePayment",
  );
  const payment: string[] = [];
  if (paymentInput?.kind === "option-selection") {
    if (paymentInput.presentation?.kind === "cost-slots")
      for (const slot of paymentInput.presentation.slots) payment.push(slot.optionIds[0]!);
    else
      for (const option of paymentInput.options) {
        if (payment.length >= paymentInput.max) break;
        payment.push(option.id);
      }
  }
  const ready = Object.values(engine.state.cards).find((c) => c.zone === "clash" && c.ready)!;
  expect(submit(engine, { targetId: [ready.instanceId] }, action.id).success).toBe(false);
  expect(submit(engine, { targetId: [target], resourcePayment: payment }, action.id).success).toBe(
    true,
  );
  for (let i = 0; engine.state.responseWindow && i < 10; i++) {
    const actor = engine.getActivePlayerId()!;
    const view = engine.getInteractionView(actor);
    const pass = view.actions.find((a) => a.id === "passCounter")!;
    expect(submit(engine, {}, pass.id).success).toBe(true);
  }
  expect(engine.state.cards[target].zone).toBe("hand");
  expect(engine.state.cards[target].owner).toBe("player-two");
});

test("revealed selection shows only the authorized deck card and hides it after decline", async () => {
  const { projectState } = await import("@tcg/alpha-clash-engine");
  const engine = createDestinationFixture("destination-reveal");
  for (const seat of ["player-one", "player-two", "spectator"] as const) {
    expect(
      projectState(engine.state, seat).cards.filter((c) => c.zone === "deck" && c.definitionId),
    ).toHaveLength(0);
  }
  fixtureBeginDestination(engine, "destination-reveal");
  const top = engine.state.deckOrder["player-two"][0];
  const viewer = projectState(engine.state, "player-two");
  expect(viewer.cards.find((c) => c.instanceId === top)?.name).toBe("Magnate, Cunning Planner");
  expect(viewer.cards.filter((c) => c.zone === "deck" && c.definitionId)).toHaveLength(1);
  expect(projectState(engine.state, "spectator").pendingChoices).toHaveLength(0);
  expect(
    projectState(engine.state, "player-one")
      .cards.filter((c) => c.owner === "player-two" && c.zone === "hand")
      .every((c) => !c.definitionId),
  ).toBe(true);
  const choice = engine.state.pendingChoices[0];
  if (choice.kind !== "modal") throw new Error("Expected modal");
  expect(
    submit(engine, { selection: [choice.options.find((o) => o.label === "Done")!.id] }).success,
  ).toBe(true);
  for (const seat of ["player-one", "player-two", "spectator"] as const) {
    const projection = projectState(engine.state, seat);
    expect(projection.cards.find((c) => c.instanceId === top)?.definitionId).toBeNull();
    expect(projection.cards.filter((c) => c.zone === "deck" && c.definitionId)).toHaveLength(0);
  }
});

// Rule 703.8a: the public face is visible without exposing private choice actions.
test("public reveal face is visible to the non-acting player during the choice", async () => {
  const { projectState } = await import("@tcg/alpha-clash-engine");
  const engine = createDestinationFixture("destination-reveal");
  fixtureBeginDestination(engine, "destination-reveal");
  const top = engine.state.deckOrder["player-two"][0];
  const actorCard = projectState(engine.state, "player-two").cards.find(
    (c) => c.instanceId === top,
  );
  expect(actorCard?.name).toBe("Magnate, Cunning Planner");
  expect(engine.state.pendingChoices).toHaveLength(1);
  const other = projectState(engine.state, "player-one");
  expect(other.pendingChoices).toHaveLength(0);
  expect(
    other.cards.filter((c) => c.zone === "deck" && c.instanceId !== top && c.definitionId),
  ).toHaveLength(0);
  expect(other.cards.find((c) => c.instanceId === top)?.definitionId).toBe(actorCard?.definitionId);
});

test("Archaic Shield can send the revealed card, without moving the rest of the deck", () => {
  const engine = createDestinationFixture("destination-reveal");
  fixtureBeginDestination(engine, "destination-reveal");
  const [top, ...rest] = engine.state.deckOrder["player-two"];
  const input = engine
    .getInteractionView("bot")
    .actions.find((a) => a.id.startsWith("resolveChoice:"))!.inputs[0];
  if (input.kind !== "option-selection") throw new Error("Expected options");
  const option = input.options.find((o) => o.entity?.instanceId === top)!;
  expect(submit(engine, { selection: [option.id] }).success).toBe(true);
  expect(engine.state.cards[top].zone).toBe("oblivion");
  expect(engine.state.deckOrder["player-two"]).toEqual(rest);
});

test("Trugg returns its declared target after a different card is banished", () => {
  const engine = createDestinationFixture("destination-banish");
  fixtureBeginDestination(engine, "destination-banish");
  const choice = engine.state.pendingChoices[0];
  if (choice.kind !== "modal") throw new Error("Expected native banish selection");
  const input = engine
    .getInteractionView("human")
    .actions.find((action) => action.id.startsWith("resolveChoice:"))!.inputs[0];
  if (input.kind !== "option-selection") throw new Error("Expected banish options");
  const candidate = input.options.find(
    (option) =>
      option.entity && engine.state.cards[option.entity.instanceId].definitionId !== "ac-ac3-016",
  )!;
  expect(submit(engine, { selection: [candidate.id] }).success).toBe(true);
  expect(engine.state.cards[candidate.entity!.instanceId].zone).toBe("banished");
  expect(
    Object.values(engine.state.cards).some(
      (card) => card.definitionId === "ac-ac3-016" && card.zone === "hand",
    ),
  ).toBe(true);
});

test("Death pays the selected send cost before resolving its declared banish target", () => {
  const engine = createDestinationFixture("destination-send");
  fixtureBeginDestination(engine, "destination-send");
  expect(
    Object.values(engine.state.cards).some(
      (card) =>
        card.owner === "player-one" &&
        card.definitionId === "ac-ac1-027" &&
        card.zone === "oblivion",
    ),
  ).toBe(true);
  expect(
    Object.values(engine.state.cards).some(
      (card) => card.owner === "player-two" && card.zone === "banished",
    ),
  ).toBe(true);
  expect(engine.state.pendingChoices).toHaveLength(0);
});

test("Portal-open Death rejects short, duplicate and mixed-owner declarations then resolves both same-owner targets", () => {
  const engine = createDestinationFixture("destination-send");
  fixtureSubmit(engine, "activatePortal");
  const source = Object.values(engine.state.cards).find(
    (card) => card.definitionId === "ac-ac4-008" && card.zone === "clash",
  )!;
  const actionId = `activateAbility:${source.instanceId}:0`;
  const action = engine.getInteractionView("human").actions.find((entry) => entry.id === actionId)!;
  const target = action.inputs[0];
  if (target.kind !== "entity-selection") throw new Error("Expected declared targets");
  expect(target.min).toBe(2);
  expect(target.max).toBe(2);
  const own = target.candidates
    .filter((entry) => engine.state.cards[entry.entity.instanceId!].owner === "player-one")
    .map((entry) => entry.entity.instanceId!);
  const opposing = target.candidates.find(
    (entry) => engine.state.cards[entry.entity.instanceId!].owner === "player-two",
  )!.entity.instanceId!;
  expect(own).toHaveLength(2);
  const cost = action.inputs.find((input) => input.id === "sendCostCardIds");
  if (cost?.kind !== "entity-selection") throw new Error("Expected send cost");
  const payment = cost.candidates.find(
    (candidate) => engine.state.cards[candidate.entity.instanceId].definitionId === "ac-ac1-027",
  )!.entity.instanceId;
  const values = { sendCostCardIds: [payment] };
  const before = structuredClone(engine.state);
  // Supply valid payment so each rejection tests its target boundary.
  expect(submit(engine, { ...values, [target.id]: [own[0]] }, actionId).success).toBe(false);
  expect(engine.state).toEqual(before);
  expect(submit(engine, { ...values, [target.id]: [own[0], own[0]] }, actionId).success).toBe(
    false,
  );
  expect(engine.state).toEqual(before);
  expect(submit(engine, { ...values, [target.id]: [own[0], opposing] }, actionId).success).toBe(
    false,
  );
  expect(engine.state).toEqual(before);
  expect(submit(engine, { ...values, [target.id]: own }, actionId).success).toBe(true);
  expect(engine.state.cards[payment].zone).toBe("oblivion");
  fixturePassResponses(engine);
  expect(engine.state.cards[payment].zone).toBe("oblivion");
  expect(own.map((id) => engine.state.cards[id].zone)).toEqual(["banished", "banished"]);
  expect(engine.state.cards[opposing].zone).toBe("oblivion");
  expect(engine.state.pendingChoices).toHaveLength(0);
});

test("Trugg cannot recover its declared card after using that card as banish payment", () => {
  const engine = createDestinationFixture("destination-banish");
  fixtureBeginDestination(engine, "destination-banish");
  const input = engine
    .getInteractionView("human")
    .actions.find((action) => action.id.startsWith("resolveChoice:"))!.inputs[0];
  if (input.kind !== "option-selection") throw new Error("Expected banish options");
  const option = input.options.find(
    (option) =>
      option.entity && engine.state.cards[option.entity.instanceId].definitionId === "ac-ac3-016",
  )!;
  const declared = option.entity!.instanceId;
  const other = input.options.find((entry) => entry.entity && entry.entity.instanceId !== declared)!
    .entity!.instanceId;
  const handBefore = Object.values(engine.state.cards).filter(
    (card) => card.owner === "player-one" && card.zone === "hand",
  ).length;
  expect(submit(engine, { selection: [option.id] }).success).toBe(true);
  expect(engine.state.cards[declared].zone).toBe("banished");
  expect(engine.state.cards[other].zone).toBe("oblivion");
  expect(
    Object.values(engine.state.cards).filter(
      (card) => card.owner === "player-one" && card.zone === "hand",
    ),
  ).toHaveLength(handBefore);
  expect(engine.state.pendingChoices).toHaveLength(0);
});

test.each(["destination-send", "destination-banish"])(
  "%s exposes the activated ability on its inspected source card",
  (id) => {
    const engine = createDestinationFixture(id);
    const definitionId = id === "destination-send" ? "ac-ac4-008" : "ac-ac6-181";
    const source = Object.values(engine.state.cards).find(
      (card) => card.definitionId === definitionId && card.zone === "clash",
    )!;
    const abilityIndex = id === "destination-send" ? 0 : 1;
    const action = engine
      .getInteractionView("human")
      .actions.find(
        (entry) => entry.id === `activateAbility:${source.instanceId}:${abilityIndex}`,
      )!;
    expect(action.enabled).toBe(true);
    expect(action.source).toMatchObject({ kind: "card", instanceId: source.instanceId });
    expect(engine.getInteractionView("bot").actions.some((entry) => entry.id === action.id)).toBe(
      false,
    );
  },
);

test("Archaic Shield Foretell stays private before its later public reveal", async () => {
  const { projectState } = await import("@tcg/alpha-clash-engine");
  const engine = createDestinationFixture("destination-reveal");
  const originalTop = engine.state.deckOrder["player-two"].slice(0, 2);
  fixtureBeginShieldForetell(engine);
  const view = engine.getInteractionView("bot");
  const action = view.actions.find((a) => a.id.startsWith("resolveChoice:"))!;
  const input = action.inputs[0];
  if (input.kind !== "entity-partition") throw new Error("Expected private Foretell");
  expect(input.candidates.map((candidate) => candidate.entity.instanceId)).toEqual(originalTop);
  const actor = projectState(engine.state, "player-two");
  expect(
    actor.cards
      .filter((card) => card.zone === "deck" && card.definitionId)
      .map((card) => card.instanceId)
      .sort(),
  ).toEqual([...originalTop].sort());
  for (const seat of ["player-one", "spectator"] as const) {
    const other = projectState(engine.state, seat);
    expect(other.pendingChoices).toHaveLength(0);
    expect(other.cards.filter((card) => card.zone === "deck" && card.definitionId)).toHaveLength(0);
    expect(
      other.cards.filter(
        (card) => card.owner === "player-two" && card.zone === "hand" && card.definitionId,
      ),
    ).toHaveLength(0);
  }
  const before = structuredClone(engine.state);
  const result = submit(engine, {
    deckOrder: { top: [originalTop[0], originalTop[0]], bottom: [] },
  });
  expect(result.success).toBe(false);
  expect(engine.state).toEqual(before);
});

test("Purging Heat pays the activation discard and restores privacy after the forced discard", async () => {
  const { projectState } = await import("@tcg/alpha-clash-engine");
  const { auditNativeFixtureLegality } = await import("./native-fixture-legality");
  const engine = createDestinationFixture("destination-reveal-hand");
  const audit = auditNativeFixtureLegality(engine.state);
  expect(audit.construction, audit.reason).toBe("valid");
  expect(audit.resourceHistoryGaps).toEqual([]);
  fixtureBeginDestination(engine, "destination-reveal-hand");
  const actor = projectState(engine.state, "player-two");
  const revealed = actor.cards.filter(
    (card) => card.owner === "player-one" && card.zone === "hand",
  );
  expect(revealed).toHaveLength(4);
  expect(revealed.every((card) => card.definitionId)).toBe(true);
  expect(
    actor.cards.filter((card) => card.owner === "player-two" && card.zone === "hand"),
  ).toHaveLength(0);
  expect(
    actor.cards.filter(
      (card) => card.owner === "player-two" && card.zone === "resource" && card.ready,
    ),
  ).toHaveLength(1);
  const choice = engine.state.pendingChoices[0];
  if (choice.kind !== "modal") throw new Error("Expected revealed hand selection");
  expect(choice.options.some((option) => option.label === "Magnate, Cunning Planner")).toBe(false);
  const discard = choice.options.find((option) => option.label === "Denver");
  if (!discard) throw new Error("Expected Denver discard option");
  expect(submit(engine, { selection: [discard.id] }).success).toBe(true);
  const after = projectState(engine.state, "player-two");
  const remaining = after.cards.filter(
    (card) => card.owner === "player-one" && card.zone === "hand",
  );
  expect(remaining).toHaveLength(3);
  expect(remaining.every((card) => card.definitionId === null)).toBe(true);
  expect(
    after.cards.some(
      (card) =>
        card.owner === "player-one" &&
        card.zone === "oblivion" &&
        card.definitionId === "ac-ac1-001",
    ),
  ).toBe(true);
});

test("Purging Heat rejects a missing or non-hand activation discard without paying resources", () => {
  const engine = createDestinationFixture("destination-reveal-hand");
  fixtureAttack(engine);
  const action = engine
    .getInteractionView("bot")
    .actions.find((entry) => entry.id.startsWith("respond:"))!;
  const cost = action.inputs.find((input) => input.id === "activationDiscardIds");
  if (cost?.kind !== "entity-selection") throw new Error("Missing activation discard");
  expect(cost.role).toBe("cost");
  expect(cost.min).toBe(1);
  expect(cost.max).toBe(1);
  expect(
    cost.candidates.map(
      (candidate) => engine.state.cards[candidate.entity.instanceId!].definitionId,
    ),
  ).toEqual(["ac-ac1-001"]);
  const resources = action.inputs.find((input) => input.id === "costResources");
  if (resources?.kind !== "option-selection") throw new Error("Missing resources");
  const target = action.inputs.find((input) => input.id === "targetId");
  if (target?.kind !== "entity-selection") throw new Error("Missing target player");
  const values = {
    costRoute: ["normal"],
    costResources: [resources.options[0].id],
    targetId: [target.candidates[0].entity.instanceId!],
  };
  const before = structuredClone(engine.state);
  expect(submit(engine, values, action.id).success).toBe(false);
  expect(engine.state).toEqual(before);
  const nonHand = Object.values(engine.state.cards).find(
    (card) => card.controller === "player-two" && card.zone === "clash",
  )!;
  expect(
    submit(engine, { ...values, activationDiscardIds: [nonHand.instanceId] }, action.id).success,
  ).toBe(false);
  expect(engine.state).toEqual(before);
});
