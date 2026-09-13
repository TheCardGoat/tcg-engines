import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05GravitonHammer122 } from "./122-graviton-hammer.ts";

describe("Graviton Hammer (GD05-122)", () => {
  /** @behavioral-proof complete: enemy Lv. gate, rest, optional self-pairing, decline, and MF ownership are public. */
  it("rests the chosen enemy Unit that is Lv.4 or lower", () => {
    const enemy = createMockUnit({ name: "Enemy", level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05GravitonHammer122],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05GravitonHammer122));
    expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

    expect(p2.isExhausted(enemyId)).toBe(true);
  });

  it("cannot choose an enemy Unit above Lv.4", () => {
    const tooHigh = createMockUnit({ name: "Too High", level: 5 });
    const eligible = createMockUnit({ name: "Eligible", level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05GravitonHammer122],
        resourceArea: activeResources(4),
      },
      { play: [tooHigh, eligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const tooHighId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05GravitonHammer122));
    expectFailure(p1.resolveEffect({ targets: [tooHighId] }), "ILLEGAL_TARGET");
  });

  it("may pair itself from the trash with a friendly MF Unit", () => {
    const host = createMockUnit({ name: "MF Host", traits: ["mf"] });
    const enemy = createMockUnit({ name: "Enemy", level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05GravitonHammer122],
        play: [host],
        resourceArea: activeResources(4),
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
  });

  it("may decline pairing after resting the enemy", () => {
    const host = createMockUnit({ name: "MF Host", traits: ["mf"] });
    const enemy = createMockUnit({ name: "Enemy", level: 4 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05GravitonHammer122],
        play: [host],
        resourceArea: activeResources(4),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd05GravitonHammer122));
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
});
