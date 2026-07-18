import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, eb01MountainGod018, op04Mr2BonKureiBentham069 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const baroqueWorksPowerSupport: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP04-069-BAROQUE-WORKS-POWER-SUPPORT",
  canonicalId: "TEST-OP04-069-BAROQUE-WORKS-POWER-SUPPORT",
  name: "Baroque Works Power Support",
  traits: ["Test"],
  effects: {
    permanentEffects: [
      {
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: { amount: "all" },
              filters: [{ filter: "trait", value: "Baroque Works", match: "includes" }],
            },
            value: 1000,
            duration: "permanent",
          },
        ],
      },
    ],
  },
};

registerCards([baroqueWorksPowerSupport]);

function payWithActiveDon(engine: OnePieceTestEngine, seat: "south" | "north") {
  const payment = engine.pendingDecision("effectCostReturnDon", seat).steps[0];
  expect(payment?.kind).toBe("payCost");
  if (payment?.kind !== "payCost") throw new Error("Expected Mr.2's DON!! payment.");
  const activeDon = payment.candidates.find((candidate) =>
    candidate.ref.id.startsWith("active-don"),
  );
  expect(activeDon).toBeDefined();
  engine.resolveDecision("effectCostReturnDon", { selectedIds: [activeDon!.ref.id] }, seat);
}

describe("OP04-069 Mr.2.Bon.Kurei (Bentham)", () => {
  test("copies the attacking Character's current power as base while preserving other modifiers", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op04Mr2BonKureiBentham069, baroqueWorksPowerSupport],
        activeDon: 1,
        restedDon: 1,
      },
      {
        character: [
          { card: eb01MountainGod018, attachedDon: 2, playedOnTurn: 0 },
          { card: eb01Doma005, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr2Id = engine.findCardInZone("south", "character", op04Mr2BonKureiBentham069);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const attackerPower = engine
      .getView("south")
      .players.north.characters.find((card) => card?.instanceId === attackerId)?.power;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    payWithActiveDon(engine, "south");

    expect(
      engine
        .getState()
        .promptQueue.some(
          (prompt) =>
            prompt.status === "pending" &&
            prompt.resolutionContext?.intent === "effectTargetSelection",
        ),
    ).toBe(false);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mr2Id)
        ?.power,
    ).toBe((attackerPower ?? 0) + 1000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);

    engine.endTurn("north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mr2Id)
        ?.power,
    ).toBe(5000);
  });

  test("copies the attacking Leader's current power without offering other opposing cards", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Mr2BonKureiBentham069], activeDon: 1 },
      { character: [eb01Doma005], activeDon: 2 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr2Id = engine.findCardInZone("south", "character", op04Mr2BonKureiBentham069);
    const leaderId = engine.leader("north");
    engine.attachDon(leaderId, 2, "north");
    const leaderPower = engine.getView("south").players.north.leader.power;

    engine.declareAttack(leaderId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mr2Id)
        ?.power,
    ).toBe(leaderPower);
    expect(
      engine
        .getState()
        .promptQueue.some(
          (prompt) =>
            prompt.status === "pending" &&
            prompt.resolutionContext?.intent === "effectTargetSelection",
        ),
    ).toBe(false);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline without returning DON!! or changing its base power", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op04Mr2BonKureiBentham069], activeDon: 1 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const mr2Id = engine.findCardInZone("south", "character", op04Mr2BonKureiBentham069);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mr2Id)
        ?.power,
    ).toBe(4000);
  });

  test("Life Trigger may return DON!! only when it plays the resolving physical card", () => {
    const accepted = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04Mr2BonKureiBentham069], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const acceptedAttacker = accepted.findCardInZone("south", "character", eb01MountainGod018);
    const acceptedId = accepted.findCardInZone("north", "life", op04Mr2BonKureiBentham069);
    accepted.declareAttack(acceptedAttacker, accepted.leader("north"), "south");
    accepted.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    accepted.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    expect(
      accepted
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === acceptedId),
    ).toBe(true);
    expect(accepted.getView("north").players.north.activeDon).toBe(0);
    expect(
      accepted.getView("north").players.north.trash.map((card) => card.instanceId),
    ).not.toContain(acceptedId);

    const declined = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { life: [op04Mr2BonKureiBentham069], activeDon: 1 },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const declinedAttacker = declined.findCardInZone("south", "character", eb01MountainGod018);
    const declinedId = declined.findCardInZone("north", "life", op04Mr2BonKureiBentham069);
    declined.declareAttack(declinedAttacker, declined.leader("north"), "south");
    declined.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = declined.getView("north");
    expect(view.players.north.activeDon).toBe(1);
    expect(view.players.north.characters.some((card) => card?.instanceId === declinedId)).toBe(
      false,
    );
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(declinedId);
  });
});
