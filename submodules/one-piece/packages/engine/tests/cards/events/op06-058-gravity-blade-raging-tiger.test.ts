import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op01Crocodile067,
  op05BartholomewKuma011,
  op05Sabo007,
  op06GravityBladeRagingTiger058,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";
import { SOUTH_ATTACKS_WITHOUT_TURN_SETUP } from "./battle-fixture.shared.ts";

function pendingOrderIds(engine: OnePieceTestEngine, seat: "south" | "north") {
  const decision = engine.pendingDecision("effectReturnToDeckOwnerOrder", seat);
  const step = decision.steps[0];
  expect(step).toMatchObject({ kind: "orderItems", min: 2, max: 2 });
  if (!step || step.kind !== "orderItems") {
    throw new Error(`Expected a return-to-deck order step for ${seat}.`);
  }
  return step.candidates.map((candidate) => candidate.ref.id);
}

function expectOrderPromptPrivate(engine: OnePieceTestEngine, seat: "south" | "north") {
  const opponent = seat === "south" ? "north" : "south";
  const decision = engine.pendingDecision("effectReturnToDeckOwnerOrder", seat);
  expect(engine.getView(seat).decisions).toHaveLength(1);
  expect(engine.getView(opponent).decisions).toHaveLength(0);
  expect(engine.getView("spectator").decisions).toHaveLength(0);
  expect(engine.getView("judge").decisions.some((candidate) => candidate.id === decision.id)).toBe(
    true,
  );
}

function expectPublicIdentityButPrivateOrder(
  engine: OnePieceTestEngine,
  publicOrderNames: [string, string],
  privateOrderNames: [string, string],
) {
  for (const viewer of ["south", "spectator"] as const) {
    const message = engine
      .getView(viewer)
      .logs.filter(
        (entry) =>
          entry.message.includes(publicOrderNames[0]) &&
          entry.message.includes(publicOrderNames[1]) &&
          entry.message.includes("deck"),
      )
      .at(-1)?.message;
    expect(message).toBeDefined();
    expect(message).not.toContain("Order:");
    expect(message!.indexOf(publicOrderNames[0])).toBeLessThan(
      message!.indexOf(publicOrderNames[1]),
    );
  }
  const judgeMessage = engine
    .getView("judge")
    .logs.filter(
      (entry) =>
        entry.message.includes("Order:") &&
        entry.message.includes(privateOrderNames[0]) &&
        entry.message.includes(privateOrderNames[1]),
    )
    .at(-1)?.message;
  expect(judgeMessage).toBeDefined();
  const privateOrderText = judgeMessage!.slice(judgeMessage!.indexOf("Order:"));
  expect(privateOrderText.indexOf(privateOrderNames[0])).toBeLessThan(
    privateOrderText.indexOf(privateOrderNames[1]),
  );
}

describe("OP06-058 Gravity Blade Raging Tiger", () => {
  test("the owner privately orders two selected opposing Characters without leaking that order", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06GravityBladeRagingTiger058],
        activeDon: 7,
      },
      {
        character: [eb01Doma005, op05BartholomewKuma011, op01Crocodile067],
      },
    );
    const publicOrder = [
      engine.findCardInZone("north", "character", eb01Doma005),
      engine.findCardInZone("north", "character", op05BartholomewKuma011),
    ];
    const excludedId = engine.findCardInZone("north", "character", op01Crocodile067);

    engine.playCard(op06GravityBladeRagingTiger058);

    const targetDecision = engine.pendingDecision("effectTargetSelection", "south");
    const targetStep = targetDecision.steps[0];
    expect(targetStep).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (targetStep?.kind !== "selectEntity") {
      throw new Error("Expected the controller's up-to-2 Character selection.");
    }
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).toEqual(publicOrder);
    expect(targetStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: publicOrder }, "south");

    expectOrderPromptPrivate(engine, "north");
    expect(pendingOrderIds(engine, "north")).toEqual(publicOrder);
    const orderDecision = engine.pendingDecision("effectReturnToDeckOwnerOrder", "north");
    engine.expectFailure({
      type: "resolvePrompt",
      seat: "north",
      promptId: orderDecision.id,
      selectedIds: [publicOrder[0]!, publicOrder[0]!],
    });

    const privateBottomOrder = [...publicOrder].reverse();
    engine.resolveDecision(
      "effectReturnToDeckOwnerOrder",
      { selectedIds: privateBottomOrder },
      "north",
    );

    expect(engine.getState().players.north.deck.slice(-2)).toEqual(privateBottomOrder);
    expectPublicIdentityButPrivateOrder(
      engine,
      [eb01Doma005.name, op05BartholomewKuma011.name],
      [op05BartholomewKuma011.name, eb01Doma005.name],
    );
    const redactedMoveEvents = engine
      .getState()
      .eventHistory.filter(
        (event) =>
          event.type === "cardMoved" &&
          event.payload.fromZone === "character" &&
          event.payload.toZone === "deck" &&
          event.payload.toOwner === "north",
      );
    expect(redactedMoveEvents).toHaveLength(2);
    expect(
      redactedMoveEvents.every(
        (event) => event.sourceCardId === null && event.sourceInstanceId === null,
      ),
    ).toBe(true);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Main offers both fields and routes each chosen cost-6 Character to its owner's deck", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op06GravityBladeRagingTiger058],
        character: [op05Sabo007],
        activeDon: 7,
      },
      {
        character: [op05Sabo007, op01Crocodile067],
      },
    );
    const selfId = engine.findCardInZone("south", "character", op05Sabo007);
    const opponentId = engine.findCardInZone("north", "character", op05Sabo007);
    const excludedId = engine.findCardInZone("north", "character", op01Crocodile067);

    engine.playCard(op06GravityBladeRagingTiger058);

    const returnDecision = engine.pendingDecision("effectTargetSelection", "south");
    const returnStep = returnDecision.steps[0];
    expect(returnStep).toMatchObject({ kind: "selectEntity", min: 0, max: 2 });
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected up to 2 owner-neutral cost-6 Character choices.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([
      selfId,
      opponentId,
    ]);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opponentId, selfId] }, "south");

    expect(engine.getState().players.south.deck.at(-1)).toBe(selfId);
    expect(engine.getState().players.north.deck.at(-1)).toBe(opponentId);
    expect(() => engine.pendingDecision("effectReturnToDeckOwnerOrder", "south")).toThrow();
    expect(() => engine.pendingDecision("effectReturnToDeckOwnerOrder", "north")).toThrow();
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger returns an owner-neutral cost-5 Character without Main payment", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }, op05Sabo007],
      },
      {
        life: [op06GravityBladeRagingTiger058],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const targetId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const excludedId = engine.findCardInZone("south", "character", op05Sabo007);

    engine.declareAttack(targetId, engine.leader("north"), "south");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    const returnDecision = engine.pendingDecision("effectTargetSelection", "north");
    const returnStep = returnDecision.steps[0];
    expect(returnStep?.kind).toBe("selectEntity");
    if (returnStep?.kind !== "selectEntity") {
      throw new Error("Expected the Trigger's owner-neutral cost-5 return choice.");
    }
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).toEqual([targetId]);
    expect(returnStep.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "north");

    expect(engine.getState().players.south.deck.at(-1)).toBe(targetId);
    expect(() => engine.pendingDecision("effectReturnToDeckOwnerOrder", "south")).toThrow();
    expect(() => engine.pendingDecision("effectReturnToDeckOwnerOrder", "north")).toThrow();
    expect(engine.getView("north").players.north.activeDon).toBe(0);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
