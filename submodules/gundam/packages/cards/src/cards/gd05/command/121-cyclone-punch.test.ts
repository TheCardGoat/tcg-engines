import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05CyclonePunch121 } from "./121-cyclone-punch.ts";

describe("Cyclone Punch (GD05-121)", () => {
  /** @behavioral-proof complete: enemy targeting, AP duration, optional MF pairing, decline, and target ownership are public. */
  it("gives the chosen enemy Unit AP-2 during this turn", () => {
    const enemy = createMockUnit({ name: "Enemy", ap: 5, hp: 6 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05CyclonePunch121],
        resourceArea: activeResources(3),
        deck: 5,
      },
      { play: [enemy], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05CyclonePunch121));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(3);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(5);
  });

  it("may pair itself from the trash with a friendly MF Unit after resolving Main", () => {
    const host = createMockUnit({
      name: "MF Host",
      traits: ["mf"],
      effects: [
        {
          type: "triggered",
          activation: { timing: ["whenPaired"] },
          directives: [{ action: { action: "draw", count: 1 } }],
          sourceText: "【When Paired】Draw 1.",
        },
      ] as CardEffect[],
    });
    const enemy = createMockUnit({ name: "Enemy", ap: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05CyclonePunch121],
        play: [host],
        resourceArea: activeResources(3),
        deck: 2,
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(commandId));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    const optionalChoice = p1.getBoardView().pendingChoice;
    if (optionalChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional pairing choice");
    }
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: true } }));
    expectSuccess(p1.resolveEffect({ targets: [hostId] }));

    expect(p1.getPilotId(hostId)).toBe(commandId);
    expect(p1.getHand()).toHaveLength(1);
  });

  it("may decline pairing after resolving Main", () => {
    const host = createMockUnit({ name: "MF Host", traits: ["mf"] });
    const enemy = createMockUnit({ name: "Enemy", ap: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05CyclonePunch121],
        play: [host],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05CyclonePunch121));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));
    const optionalChoice = p1.getBoardView().pendingChoice;
    if (optionalChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional pairing choice");
    }
    expectSuccess(
      p1.resolveEffect({ optionalAnswers: { [optionalChoice.directiveIndex]: false } }),
    );

    expect(p1.getPilotId(hostId)).toBeUndefined();
  });

  it("offers and accepts only MF Units that can legally receive a Pilot", () => {
    const openHost = createMockUnit({ name: "Open MF Host", traits: ["mf"] });
    const occupiedHost = createMockUnit({ name: "Occupied MF Host", traits: ["mf"] });
    const restrictedHost = createMockUnit({
      name: "Restricted MF Host",
      traits: ["mf"],
      effects: [
        {
          type: "constant",
          activation: {},
          directives: [
            {
              action: {
                action: "restrictUnit",
                target: { owner: "self", cardType: "unit", count: 1 },
                restrictions: ["cannotPairPilot"],
                duration: "permanent",
              },
            },
          ],
          sourceText: "This Unit can't be paired with a Pilot.",
        },
      ] as CardEffect[],
    });
    const existingPilot = createMockPilot({ name: "Existing Pilot", level: 0, cost: 0 });
    const enemy = createMockUnit({ name: "Enemy", ap: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05CyclonePunch121, existingPilot],
        play: [openHost, occupiedHost, restrictedHost],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const existingPilotId = p1.getHand()[1]!;
    const [openHostId, occupiedHostId, restrictedHostId] = p1.getCardsInZone("battleArea");
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(existingPilotId, occupiedHostId!));
    expectSuccess(p1.playCommand(commandId));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    const pairChoice = p1.getBoardView().pendingChoice;
    if (pairChoice?.kind !== "targetSelection") {
      throw new Error("Expected the optional pairing choice");
    }
    expect(pairChoice.legalTargetIds).toEqual([openHostId]);
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [pairChoice.directiveIndex]: true } }));
    expectFailure(p1.resolveEffect({ targets: [occupiedHostId!] }), "ILLEGAL_TARGET");
    expectFailure(p1.resolveEffect({ targets: [restrictedHostId!] }), "ILLEGAL_TARGET");
    expectSuccess(p1.resolveEffect({ targets: [openHostId!] }));

    expect(p1.getPilotId(openHostId!)).toBe(commandId);
    expect(p1.getPilotId(occupiedHostId!)).toBe(existingPilotId);
    expect(p1.getPilotId(restrictedHostId!)).toBeUndefined();
  });

  it("cannot choose a friendly Unit for the AP reduction", () => {
    const friendly = createMockUnit({ name: "Friendly", ap: 4 });
    const enemy = createMockUnit({ name: "Enemy", ap: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05CyclonePunch121],
        play: [friendly],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05CyclonePunch121));
    expectFailure(p1.resolveEffect({ targets: [friendlyId] }), "ILLEGAL_TARGET");
    expect(p1.getVisibleCard(friendlyId)?.effectiveAp).toBe(4);
  });
});
