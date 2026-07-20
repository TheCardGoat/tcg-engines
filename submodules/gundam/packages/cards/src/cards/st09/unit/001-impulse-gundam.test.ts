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

function trashImpulse(overrides = {}) {
  return createMockUnit({
    name: "Force Impulse Gundam",
    level: 4,
    cost: 4,
    ap: 4,
    hp: 4,
    color: "purple",
    ...overrides,
  });
}

describe("Impulse Gundam (ST09-001)", () => {
  describe("Lv.3 cost 2 AP3 HP3 Link Unit", () => {
    it("deploys the exact card at printed stats and pays two Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st09ImpulseGundam001],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const impulseId = p1.getHand()[0]!;
      expectSuccess(p1.deployUnit(impulseId));
      expect(p1.getCardZone(impulseId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(impulseId)).toMatchObject({ effectiveAp: 3, effectiveHp: 3 });
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("cannot deploy below Lv.3 or without two active Resources", () => {
      const low = GundamTestEngine.create({
        hand: [st09ImpulseGundam001],
        resourceArea: activeResources(2),
      }).asPlayer(PLAYER_ONE);
      expectFailure(low.deployUnit(st09ImpulseGundam001), "INSUFFICIENT_RESOURCE_LEVEL");
      const unpaid = GundamTestEngine.create({
        hand: [st09ImpulseGundam001],
        resourceArea: restedResources(3),
      }).asPlayer(PLAYER_ONE);
      expectFailure(unpaid.deployUnit(st09ImpulseGundam001), "INSUFFICIENT_RESOURCES");
      expect(unpaid.getCardZone(st09ImpulseGundam001)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Activate·Main】②, return self to deck bottom: deploy a Lv.4+ Impulse Gundam from trash", () => {
    it("prompts for every legal physical card, then returns self and deploys only the chosen one", () => {
      const engine = GundamTestEngine.create({
        play: [st09ImpulseGundam001],
        trash: [
          trashImpulse({ name: "Force Impulse Gundam" }),
          trashImpulse({ name: "Blast Impulse Gundam", level: 6 }),
        ],
        resourceArea: activeResources(2),
        deck: 2,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const [firstId, secondId] = p1.getCardsInZone("trash");
      const deckBefore = p1.getBoardView().players[PLAYER_ONE]!.deckCount;
      expectSuccess(p1.activateAbility(selfId, 0));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: selfId,
        legalTargetIds: expect.arrayContaining([firstId, secondId]),
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));
      expect(p1.getCardZone(selfId)).toBe(`deck:${PLAYER_ONE}`);
      expect(p1.getCardZone(secondId!)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardZone(firstId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]!.deckCount).toBe(deckBefore + 1);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("returns itself to the bottom, leaving the prior top card to be drawn next turn", () => {
      const sentinel = createMockUnit({ name: "Untouched Top Card" });
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [trashImpulse()],
          resourceArea: activeResources(2),
          deck: [sentinel],
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;
      expectSuccess(p1.activateAbility(selfId, 0, { targets: [targetId] }));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passPhase());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.passActionStep());
      expect(p1.getCardZone(sentinel)).toBe(`hand:${PLAYER_ONE}`);
      expect(p1.getCardZone(selfId)).toBe(`deck:${PLAYER_ONE}`);
    });

    it("deploys the selected trash Unit for free and continues into its Deploy trigger", () => {
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
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const swordId = p1.getCardsInZone("trash")[0]!;
      const [lowEnemyId, highEnemyId] = p2.getCardsInZone("battleArea");
      expectSuccess(p1.activateAbility(selfId, 0, { targets: [swordId] }));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: swordId,
        legalTargetIds: [lowEnemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [lowEnemyId!] }));
      expect(p1.getCardZone(swordId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p2.getCardZone(lowEnemyId!)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardZone(highEnemyId!)).toBe(`battleArea:${PLAYER_TWO}`);
    });

    it("includes name variants and the exact Lv.4 boundary", () => {
      const engine = GundamTestEngine.create({
        play: [st09ImpulseGundam001],
        trash: [trashImpulse({ name: "Sword Impulse Gundam", level: 4 })],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const targetId = p1.getCardsInZone("trash")[0]!;
      expectSuccess(
        p1.activateAbility(p1.getCardsInZone("battleArea")[0]!, 0, { targets: [targetId] }),
      );
      expect(p1.getCardZone(targetId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("rejects a matching Unit below Lv.4 and a Lv.4 Unit without the required name", () => {
      const low = trashImpulse({ level: 3 });
      const wrongName = trashImpulse({ name: "Destiny Gundam", level: 6 });
      const eligible = trashImpulse();
      const engine = GundamTestEngine.create({
        play: [st09ImpulseGundam001],
        trash: [low, wrongName, eligible],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const [lowId, wrongNameId] = p1.getCardsInZone("trash");
      expectSuccess(p1.activateAbility(selfId, 0));
      expectFailure(p1.resolveEffect({ targets: [lowId!] }), "ILLEGAL_TARGET");
      expectFailure(p1.resolveEffect({ targets: [wrongNameId!] }), "ILLEGAL_TARGET");
    });

    it("rejects an opponent's matching trash Unit", () => {
      const engine = GundamTestEngine.create(
        {
          play: [st09ImpulseGundam001],
          trash: [trashImpulse()],
          resourceArea: activeResources(2),
        },
        { trash: [trashImpulse()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("trash")[0]!;
      expectSuccess(p1.activateAbility(selfId, 0));
      expectFailure(p1.resolveEffect({ targets: [enemyId] }), "ILLEGAL_TARGET");
      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
    });

    it("does not treat a Pilot with Impulse Gundam in its name as a Unit card", () => {
      const pilot = createMockPilot({ name: "Impulse Gundam Pilot", level: 4 });
      const engine = GundamTestEngine.create({
        play: [st09ImpulseGundam001],
        trash: [pilot, trashImpulse()],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getCardsInZone("trash")[0]!;
      expectSuccess(p1.activateAbility(selfId, 0));
      expectFailure(p1.resolveEffect({ targets: [pilotId] }), "ILLEGAL_TARGET");
    });

    it("cannot activate when its controller has no legal card in trash", () => {
      const engine = GundamTestEngine.create({
        play: [st09ImpulseGundam001],
        trash: [trashImpulse({ level: 3 })],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      expectFailure(p1.activateAbility(selfId, 0), "NO_LEGAL_TARGETS");
      expect(p1.getCardZone(selfId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(0);
    });

    it("cannot activate without two active Resources", () => {
      const engine = GundamTestEngine.create({
        play: [st09ImpulseGundam001],
        trash: [trashImpulse()],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;
      expectFailure(
        p1.activateAbility(selfId, 0, { targets: [targetId] }),
        "INSUFFICIENT_RESOURCES",
      );
      expect(p1.getCardZone(selfId)).toBe(`battleArea:${PLAYER_ONE}`);
    });

    it("can activate while rested because returning it, not resting it, is the printed self-cost", () => {
      const engine = GundamTestEngine.create({
        play: [{ card: st09ImpulseGundam001, exhausted: true }],
        trash: [trashImpulse()],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;
      expectSuccess(p1.activateAbility(selfId, 0, { targets: [targetId] }));
      expect(p1.getCardZone(selfId)).toBe(`deck:${PLAYER_ONE}`);
    });

    it("cannot activate outside the Main Phase", () => {
      const engine = GundamTestEngine.create({
        play: [st09ImpulseGundam001],
        trash: [trashImpulse()],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const selfId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(p1.activateAbility(selfId, 0), "WRONG_PHASE");
      expect(p1.getCardZone(selfId)).toBe(`battleArea:${PLAYER_ONE}`);
    });
  });
});
