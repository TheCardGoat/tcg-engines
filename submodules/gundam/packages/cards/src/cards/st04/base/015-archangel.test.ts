import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { st04Archangel015 } from "./015-archangel.ts";

function blocker(name: string) {
  return createMockUnit({
    name,
    ap: 2,
    hp: 4,
    keywordEffects: [{ keyword: "Blocker" }],
  });
}

describe("Archangel (ST04-015)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("offers the revealed Shield's owner and deploys the accepted physical card", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04Archangel015] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Archangel's visible Burst choice");
      const revealedId = burst.sourceCardId;
      expect(burst).toMatchObject({
        controllerId: PLAYER_TWO,
        prompt: "【Burst】Deploy this card.",
      });
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(revealedId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getBoardView().players[PLAYER_TWO]?.shieldCount).toBe(0);
      expect(p2.getBoardView().pendingChoice).toBeUndefined();
    });

    it("moves the revealed Shield to trash when its owner declines", () => {
      const attacker = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        { play: [attacker] },
        { shieldArea: [st04Archangel015] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const attackerId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.enterBattle(attackerId, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected Archangel's visible Burst choice");
      const revealedId = burst.sourceCardId;
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: false } }));

      expect(p2.getCardZone(revealedId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("moves one Shield to hand while Archangel enters the Base section", () => {
      const engine = GundamTestEngine.create({
        hand: [st04Archangel015],
        shieldArea: [
          createMockUnit({ name: "First Shield" }),
          createMockUnit({ name: "Second Shield" }),
        ],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(baseId));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(1);
      expect(p1.getHand()).toHaveLength(handBefore);
    });

    it("still deploys when there is no Shield to add", () => {
      const engine = GundamTestEngine.create({
        hand: [st04Archangel015],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;

      expectSuccess(p1.deployBase(baseId));

      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(0);
      expect(p1.getBoardView().players[PLAYER_ONE]?.shieldCount).toBe(0);
    });

    it("cannot deploy below its printed Lv.3 requirement", () => {
      const engine = GundamTestEngine.create({
        hand: [st04Archangel015],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;

      expectFailure(p1.deployBase(baseId), "INSUFFICIENT_RESOURCE_LEVEL");
      expect(p1.getCardZone(baseId)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost 1 with only rested Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st04Archangel015],
        resourceArea: restedResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getHand()[0]!;

      expectFailure(p1.deployBase(baseId), "INSUFFICIENT_RESOURCES");
      expect(p1.getCardZone(baseId)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Activate･Main】【Once per Turn】②：Choose 1 friendly Unit with <Blocker>. Set it as active. It can't attack during this turn.", () => {
    it("pays 2, sets the chosen Blocker active, and prevents only it from attacking", () => {
      const chosen = blocker("Chosen Blocker");
      const other = blocker("Other Blocker");
      const engine = GundamTestEngine.create({
        baseSection: [st04Archangel015],
        play: [
          { card: chosen, exhausted: true },
          { card: other, exhausted: true },
        ],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [chosenId, otherId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateBaseAbility(st04Archangel015, { targets: [chosenId!] }));

      expect(p1.isExhausted(chosenId!)).toBe(false);
      expect(p1.isExhausted(otherId!)).toBe(true);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
      expectFailure(p1.enterBattle(chosenId!, "direct"), "CANNOT_ATTACK");
    });

    it("publishes an exact-one choice containing all friendly Blockers", () => {
      const first = blocker("First Blocker");
      const second = blocker("Second Blocker");
      const nonBlocker = createMockUnit({ name: "Non-Blocker" });
      const engine = GundamTestEngine.create({
        baseSection: [st04Archangel015],
        play: [
          { card: first, exhausted: true },
          { card: second, exhausted: true },
          { card: nonBlocker, exhausted: true },
        ],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstId, secondId] = p1.getCardsInZone("battleArea");
      const baseId = p1.getCardsInZone("baseSection")[0]!;

      expectSuccess(p1.activateBaseAbility(baseId));
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        controllerId: PLAYER_ONE,
        sourceCardId: baseId,
        legalTargetIds: [firstId, secondId],
        minTargets: 1,
        maxTargets: 1,
      });
      expectSuccess(p1.resolveEffect({ targets: [secondId!] }));

      expect(p1.isExhausted(firstId!)).toBe(true);
      expect(p1.isExhausted(secondId!)).toBe(false);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
    });

    it("rejects a friendly Unit without Blocker", () => {
      const legal = blocker("Legal Blocker");
      const nonBlocker = createMockUnit({ name: "Non-Blocker" });
      const engine = GundamTestEngine.create({
        baseSection: [st04Archangel015],
        play: [
          { card: legal, exhausted: true },
          { card: nonBlocker, exhausted: true },
        ],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [, nonBlockerId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.activateBaseAbility(st04Archangel015, { targets: [nonBlockerId!] }),
        "ILLEGAL_TARGET",
      );
      expect(p1.isExhausted(nonBlockerId!)).toBe(true);
    });

    it("rejects an enemy Blocker", () => {
      const friendly = blocker("Friendly Blocker");
      const enemy = blocker("Enemy Blocker");
      const engine = GundamTestEngine.create(
        {
          baseSection: [st04Archangel015],
          play: [{ card: friendly, exhausted: true }],
          resourceArea: activeResources(2),
        },
        { play: [{ card: enemy, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(st04Archangel015, { targets: [enemyId] }),
        "ILLEGAL_TARGET",
      );
      expect(p2.isExhausted(enemyId)).toBe(true);
    });

    it("cannot activate without 2 active Resources", () => {
      const target = blocker("Target Blocker");
      const engine = GundamTestEngine.create({
        baseSection: [st04Archangel015],
        play: [{ card: target, exhausted: true }],
        resourceArea: activeResources(1),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectFailure(
        p1.activateBaseAbility(st04Archangel015, { targets: [targetId] }),
        "INSUFFICIENT_RESOURCES",
      );
      expect(p1.isExhausted(targetId)).toBe(true);
    });

    it("cannot activate twice in the same turn", () => {
      const first = blocker("First Blocker");
      const second = blocker("Second Blocker");
      const engine = GundamTestEngine.create({
        baseSection: [st04Archangel015],
        play: [
          { card: first, exhausted: true },
          { card: second, exhausted: true },
        ],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstId, secondId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.activateBaseAbility(st04Archangel015, { targets: [firstId!] }));
      expectFailure(
        p1.activateBaseAbility(st04Archangel015, { targets: [secondId!] }),
        "ABILITY_LIMIT_REACHED",
      );
      expect(p1.isExhausted(secondId!)).toBe(true);
    });

    it("cannot activate outside Main timing", () => {
      const target = blocker("Target Blocker");
      const engine = GundamTestEngine.create(
        {
          baseSection: [st04Archangel015],
          play: [{ card: target, exhausted: true }],
          resourceArea: activeResources(2),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectFailure(
        p1.activateBaseAbility(st04Archangel015, { targets: [targetId] }),
        "WRONG_PHASE",
      );
    });

    it("allows the chosen Unit to attack again after the turn-scoped restriction expires", () => {
      const target = blocker("Target Blocker");
      const engine = GundamTestEngine.create(
        {
          baseSection: [st04Archangel015],
          play: [{ card: target, exhausted: true }],
          resourceArea: activeResources(2),
          deck: 5,
        },
        { deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const targetId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.activateBaseAbility(st04Archangel015, { targets: [targetId] }));
      expectFailure(p1.enterBattle(targetId, "direct"), "CANNOT_ATTACK");
      passTurnThroughPublicMoves(engine, PLAYER_ONE);
      passTurnThroughPublicMoves(engine, PLAYER_TWO);

      expectSuccess(p1.enterBattle(targetId, "direct"));
      expect(p1.getBoardView().pendingCombat).toMatchObject({ attackerId: targetId });
    });
  });
});
