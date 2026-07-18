import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Hajrudin018,
  op05BartholomewKuma011,
  op05Hack012,
  op05ItSAWasteOfHumanLife058,
  op05Pell014,
  op05Sabo007,
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
  publicViewer: "north" | "south",
  publicOrderNames: [string, string],
  privateOrderNames: [string, string],
) {
  for (const viewer of [publicViewer, "spectator"] as const) {
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

describe("OP05-058 It's a Waste of Human Life!!", () => {
  test("Main bottoms all low-cost Characters by owner before each player chooses down to 5 hand cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [
          op05ItSAWasteOfHumanLife058,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          op05Pell014,
          op05Hack012,
          op05Sabo007,
        ],
        character: [eb01Doma005, op05Hack012, eb01MountainGod018],
        activeDon: 8,
      },
      {
        hand: [
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
          op05Pell014,
          op05Hack012,
          op05Sabo007,
          op01Hajrudin018,
        ],
        character: [op05BartholomewKuma011, op05Pell014, op01Hajrudin018],
      },
    );
    const southPublicOrder = [
      engine.findCardInZone("south", "character", eb01Doma005),
      engine.findCardInZone("south", "character", op05Hack012),
    ];
    const northPublicOrder = [
      engine.findCardInZone("north", "character", op05BartholomewKuma011),
      engine.findCardInZone("north", "character", op05Pell014),
    ];
    const southCostId = engine.findCardInZone("south", "hand", eb01Doma005);
    const northCostIds = [
      engine.findCardInZone("north", "hand", eb01Doma005),
      engine.findCardInZone("north", "hand", eb01Fourtricks025),
    ];

    engine.playCard(op05ItSAWasteOfHumanLife058);

    expectOrderPromptPrivate(engine, "south");
    expect(pendingOrderIds(engine, "south")).toEqual(southPublicOrder);
    const southOrderDecision = engine.pendingDecision("effectReturnToDeckOwnerOrder", "south");
    engine.expectFailure({
      type: "resolvePrompt",
      seat: "south",
      promptId: southOrderDecision.id,
      selectedIds: [southPublicOrder[0]!, southPublicOrder[0]!],
    });
    const southBottomOrder = [...southPublicOrder].reverse();
    engine.resolveDecision(
      "effectReturnToDeckOwnerOrder",
      { selectedIds: southBottomOrder },
      "south",
    );

    expect(engine.getState().players.south.deck.slice(-2)).toEqual(southBottomOrder);
    const redactedSouthMoveEvents = engine
      .getState()
      .eventHistory.filter(
        (event) =>
          event.type === "cardMoved" &&
          event.payload.fromZone === "character" &&
          event.payload.toZone === "deck" &&
          event.payload.toOwner === "south",
      );
    expect(redactedSouthMoveEvents).toHaveLength(2);
    expect(
      redactedSouthMoveEvents.every(
        (event) => event.sourceCardId === null && event.sourceInstanceId === null,
      ),
    ).toBe(true);
    expect(engine.getState().players.north.deck).not.toEqual(
      expect.arrayContaining(northPublicOrder),
    );
    expectOrderPromptPrivate(engine, "north");
    expect(pendingOrderIds(engine, "north")).toEqual(northPublicOrder);
    expectPublicIdentityButPrivateOrder(
      engine,
      "north",
      [eb01Doma005.name, op05Hack012.name],
      [op05Hack012.name, eb01Doma005.name],
    );

    const northBottomOrder = [...northPublicOrder].reverse();
    engine.resolveDecision(
      "effectReturnToDeckOwnerOrder",
      { selectedIds: northBottomOrder },
      "north",
    );

    expectPublicIdentityButPrivateOrder(
      engine,
      "south",
      [op05BartholomewKuma011.name, op05Pell014.name],
      [op05Pell014.name, op05BartholomewKuma011.name],
    );

    expect(engine.getState().players.north.deck.slice(-2)).toEqual(northBottomOrder);
    expect(engine.getState().players.south.characterArea.filter(Boolean)).toHaveLength(1);
    expect(engine.getState().players.north.characterArea.filter(Boolean)).toHaveLength(1);

    const southDecision = engine.pendingDecision("effectTrashFromHandSelection", "south");
    expect(
      engine.getView("north").decisions.some((decision) => decision.id === southDecision.id),
    ).toBe(false);
    expect(
      engine.getView("spectator").decisions.some((decision) => decision.id === southDecision.id),
    ).toBe(false);
    expect(
      engine.getView("judge").decisions.some((decision) => decision.id === southDecision.id),
    ).toBe(true);
    const southStep = southDecision.steps[0];
    expect(southStep).toMatchObject({ kind: "selectEntity", min: 1, max: 1 });
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [southCostId] }, "south");

    const northDecision = engine.pendingDecision("effectTrashFromHandSelection", "north");
    expect(
      engine.getView("south").decisions.some((decision) => decision.id === northDecision.id),
    ).toBe(false);
    expect(
      engine.getView("spectator").decisions.some((decision) => decision.id === northDecision.id),
    ).toBe(false);
    expect(
      engine.getView("judge").decisions.some((decision) => decision.id === northDecision.id),
    ).toBe(true);
    const northStep = northDecision.steps[0];
    expect(northStep).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: northCostIds }, "north");

    expect(engine.getState().players.south.deck.slice(-2)).toEqual(southBottomOrder);
    expect(engine.getState().players.north.deck.slice(-2)).toEqual(northBottomOrder);
    expect(engine.getView("south").players.south.hand).toHaveLength(5);
    expect(engine.getView("north").players.north.hand).toHaveLength(5);
    expect(engine.getState().players.south.trash).toContain(southCostId);
    expect(engine.getState().players.north.trash).toEqual(expect.arrayContaining(northCostIds));
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("Life Trigger bottoms all cost-2-or-less Characters on both fields without hand reduction", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Pell014],
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          eb01Doma005,
          op05BartholomewKuma011,
          op05Hack012,
        ],
      },
      {
        hand: [op05Pell014],
        life: [op05ItSAWasteOfHumanLife058],
        character: [op05BartholomewKuma011, eb01Doma005, op05Pell014],
      },
      SOUTH_ATTACKS_WITHOUT_TURN_SETUP,
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const southPublicOrder = [
      engine.findCardInZone("south", "character", eb01Doma005),
      engine.findCardInZone("south", "character", op05BartholomewKuma011),
    ];
    const northPublicOrder = [
      engine.findCardInZone("north", "character", op05BartholomewKuma011),
      engine.findCardInZone("north", "character", eb01Doma005),
    ];

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");

    expectOrderPromptPrivate(engine, "south");
    expect(pendingOrderIds(engine, "south")).toEqual(southPublicOrder);
    const southBottomOrder = [...southPublicOrder].reverse();
    engine.resolveDecision(
      "effectReturnToDeckOwnerOrder",
      { selectedIds: southBottomOrder },
      "south",
    );

    expectPublicIdentityButPrivateOrder(
      engine,
      "north",
      [eb01Doma005.name, op05BartholomewKuma011.name],
      [op05BartholomewKuma011.name, eb01Doma005.name],
    );

    expectOrderPromptPrivate(engine, "north");
    expect(pendingOrderIds(engine, "north")).toEqual(northPublicOrder);
    const northBottomOrder = [...northPublicOrder].reverse();
    engine.resolveDecision(
      "effectReturnToDeckOwnerOrder",
      { selectedIds: northBottomOrder },
      "north",
    );

    expectPublicIdentityButPrivateOrder(
      engine,
      "south",
      [op05BartholomewKuma011.name, eb01Doma005.name],
      [eb01Doma005.name, op05BartholomewKuma011.name],
    );

    expect(engine.getState().players.south.deck.slice(-2)).toEqual(southBottomOrder);
    expect(engine.getState().players.north.deck.slice(-2)).toEqual(northBottomOrder);
    expect(engine.getState().players.south.characterArea.filter(Boolean)).toHaveLength(2);
    expect(engine.getState().players.north.characterArea.filter(Boolean)).toHaveLength(1);
    expect(engine.getView("south").players.south.hand).toHaveLength(1);
    expect(engine.getView("north").players.north.hand).toHaveLength(1);
    expect(engine.getView("north").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
