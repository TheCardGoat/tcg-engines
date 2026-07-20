import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st09ImpulseGundam001 } from "./001-impulse-gundam.ts";
import { st09SwordImpulseGundam006 } from "./006-sword-impulse-gundam.ts";

describe("Sword Impulse Gundam (ST09-006)", () => {
  it("deploys from hand with printed 4 AP/2 HP for Lv.4 and cost 2", () => {
    const engine = GundamTestEngine.create({
      hand: [st09SwordImpulseGundam006],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(st09SwordImpulseGundam006));

    const unitId = p1.getCardsInZone("battleArea")[0]!;
    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 4, effectiveHp: 2 });
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("requires Lv.4", () => {
    const engine = GundamTestEngine.create({
      hand: [st09SwordImpulseGundam006],
      resourceArea: activeResources(3),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st09SwordImpulseGundam006),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires two active resources", () => {
    const engine = GundamTestEngine.create({
      hand: [st09SwordImpulseGundam006],
      resourceArea: restedResources(4),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(st09SwordImpulseGundam006),
      "INSUFFICIENT_RESOURCES",
    );
  });

  it("satisfies its Link Condition with a Coordinator Pilot", () => {
    const pilot = createMockPilot({
      traits: ["coordinator"],
      level: 1,
      cost: 1,
      apBonus: 0,
      effects: [
        {
          type: "constant",
          activation: { conditions: [{ type: "duringLink" }] },
          directives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: 1,
                duration: "permanent",
                target: { owner: "self", cardType: "unit" },
              },
            },
          ],
          sourceText: "【During Link】This Unit gets AP+1.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [st09SwordImpulseGundam006],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5 });
  });

  it("satisfies its other Link Condition with a Minerva Squad Pilot", () => {
    const pilot = createMockPilot({
      traits: ["minerva squad"],
      level: 1,
      cost: 1,
      apBonus: 0,
      effects: [
        {
          type: "constant",
          activation: { conditions: [{ type: "duringLink" }] },
          directives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: 1,
                duration: "permanent",
                target: { owner: "self", cardType: "unit" },
              },
            },
          ],
          sourceText: "【During Link】This Unit gets AP+1.",
        },
      ],
    });
    const engine = GundamTestEngine.create({
      hand: [pilot],
      play: [st09SwordImpulseGundam006],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, unitId));

    expect(p1.getVisibleCard(unitId)).toMatchObject({ effectiveAp: 5 });
  });

  describe("Deploy from trash destroys one enemy Unit at Lv.3 or lower", () => {
    it("publishes an exact controller/source choice containing only eligible enemy Units", () => {
      const firstLow = createMockUnit({ level: 2 });
      const boundary = createMockUnit({ level: 3 });
      const tooHigh = createMockUnit({ level: 4 });
      const friendlyLow = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001, friendlyLow],
          trash: [st09SwordImpulseGundam006],
          resourceArea: activeResources(2),
        },
        { play: [firstLow, boundary, tooHigh] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const impulseId = p1.getCardsInZone("battleArea")[0]!;
      const swordId = p1.getCardsInZone("trash")[0]!;
      const [firstLowId, boundaryId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.activateAbility(impulseId, 0));
      expectSuccess(p1.resolveEffect({ targets: [swordId] }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: swordId,
        minTargets: 1,
        maxTargets: 1,
        legalTargetIds: [firstLowId, boundaryId],
      });
      expectSuccess(p1.resolveEffect({ targets: [boundaryId!] }));

      expect(p1.getCardZone(boundaryId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getCardZone(firstLowId!)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("rejects an enemy Unit above Lv.3", () => {
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [st09SwordImpulseGundam006],
          resourceArea: activeResources(2),
        },
        { play: [createMockUnit({ level: 3 }), createMockUnit({ level: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const impulseId = p1.getCardsInZone("battleArea")[0]!;
      const swordId = p1.getCardsInZone("trash")[0]!;
      const highId = p2.getCardsInZone("battleArea")[1]!;
      expectSuccess(p1.activateAbility(impulseId, 0));
      expectSuccess(p1.resolveEffect({ targets: [swordId] }));
      expectFailure(p1.resolveEffect({ targets: [highId] }), "ILLEGAL_TARGET");
    });

    it("rejects a friendly Lv.3 Unit", () => {
      const friendly = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001, friendly],
          trash: [st09SwordImpulseGundam006],
          resourceArea: activeResources(2),
        },
        { play: [createMockUnit({ level: 3 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const impulseId = p1.getCardsInZone("battleArea")[0]!;
      const friendlyId = p1.getCardsInZone("battleArea")[1]!;
      const swordId = p1.getCardsInZone("trash")[0]!;
      expectSuccess(p1.activateAbility(impulseId, 0));
      expectSuccess(p1.resolveEffect({ targets: [swordId] }));
      expectFailure(p1.resolveEffect({ targets: [friendlyId] }), "ILLEGAL_TARGET");
    });

    it("resolves without a prompt when no eligible enemy Unit exists", () => {
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [st09SwordImpulseGundam006],
          resourceArea: activeResources(2),
        },
        { play: [createMockUnit({ level: 4 })] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const impulseId = p1.getCardsInZone("battleArea")[0]!;
      const swordId = p1.getCardsInZone("trash")[0]!;
      expectSuccess(p1.activateAbility(impulseId, 0));
      expectSuccess(p1.resolveEffect({ targets: [swordId] }));
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(swordId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("does not trigger when deployed from hand", () => {
      const enemy = createMockUnit({ level: 3 });
      const engine = GundamTestEngine.create(
        { hand: [st09SwordImpulseGundam006], resourceArea: activeResources(4) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.deployUnit(st09SwordImpulseGundam006));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
    });
  });
});
