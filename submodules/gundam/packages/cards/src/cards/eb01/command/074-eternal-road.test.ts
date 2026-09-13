import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { eb01EternalRoad074 } from "./074-eternal-road.ts";

describe("Eternal Road (EB01-074)", () => {
  /** @behavioral-proof complete: Burst HP filter plus Main/Action friendly cost and the standard opponent-owned choice are public. */
  it("rests only a chosen enemy Unit with 3 or less HP through Burst", () => {
    const attacker = createMockUnit({ name: "Attacker", ap: 1, hp: 4 });
    const eligible = createMockUnit({ name: "Eligible", hp: 3 });
    const ineligible = createMockUnit({ name: "Ineligible", hp: 4 });
    const engine = GundamTestEngine.create(
      { play: [attacker, eligible, ineligible], deck: 5 },
      { shieldArea: [eb01EternalRoad074], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [, eligibleId, ineligibleId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    const burst = p2.getBoardView().pendingChoice;
    if (burst?.kind !== "optional") throw new Error("Expected Eternal Road's Burst choice");
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p2.resolveEffect({ targets: [eligibleId!] }));

    expect(p1.isExhausted(eligibleId!)).toBe(true);
    expect(p1.isExhausted(ineligibleId!)).toBe(false);
  });

  it("rests a friendly G Generation Unit, then lets the opponent rest one of their own Units", () => {
    const friendly = createMockUnit({ name: "Friendly G Generation", traits: ["g generation"] });
    const p2First = createMockUnit({ name: "P2 First" });
    const p2Second = createMockUnit({ name: "P2 Second" });
    const engine = GundamTestEngine.create(
      {
        hand: [eb01EternalRoad074],
        play: [friendly],
        resourceArea: activeResources(3),
      },
      { play: [p2First, p2Second] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const [p2FirstId, p2SecondId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.playCommand(commandId, { targets: [friendlyId] }));
    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [p2FirstId, p2SecondId],
    });
    expectSuccess(p2.resolveEffect({ targets: [p2SecondId!] }));

    expect(p2.isExhausted(p2FirstId!)).toBe(false);
    expect(p2.isExhausted(p2SecondId!)).toBe(true);
  });

  it("can use the same effect during a legally reached Action step", () => {
    const friendly = createMockUnit({ traits: ["g generation"] });
    const enemy = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [eb01EternalRoad074],
        play: [friendly],
        resourceArea: activeResources(3),
      },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const commandId = p1.getHand()[0]!;
    const friendlyId = p1.getCardsInZone("battleArea")[0]!;
    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.playCommand(commandId, { targets: [friendlyId] }));
    expectSuccess(p2.resolveEffect({ targets: [enemyId] }));

    expect(p1.isExhausted(friendlyId)).toBe(true);
    expect(p2.isExhausted(enemyId)).toBe(true);
  });
});
