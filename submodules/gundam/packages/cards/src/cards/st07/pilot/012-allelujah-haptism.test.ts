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
import { st07AllelujahHaptism012 } from "./012-allelujah-haptism.ts";

function revealBurst(): {
  p2: ReturnType<GundamTestEngine["asPlayer"]>;
  sourceCardId: string;
  directiveIndex: number;
} {
  const engine = GundamTestEngine.create(
    { play: [createMockUnit({ ap: 1, hp: 4 })] },
    { shieldArea: [st07AllelujahHaptism012] },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
  const choice = p2.getBoardView().pendingChoice;
  if (choice?.kind !== "optional") throw new Error("Expected Allelujah's Burst choice");
  return { p2, sourceCardId: choice.sourceCardId, directiveIndex: choice.directiveIndex };
}

function resolveBattle(engine: GundamTestEngine): void {
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());
}

describe("Allelujah Haptism (ST07-012)", () => {
  describe("【Burst】Add this card to your hand.", () => {
    it("adds the revealed physical card to its controller's hand when accepted", () => {
      const { p2, sourceCardId, directiveIndex } = revealBurst();
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [directiveIndex]: true } }));
      expect(p2.getCardZone(sourceCardId)).toBe(`hand:${PLAYER_TWO}`);
    });

    it("moves the revealed physical card to trash when declined", () => {
      const { p2, sourceCardId, directiveIndex } = revealBurst();
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [directiveIndex]: false } }));
      expect(p2.getCardZone(sourceCardId)).toBe(`trash:${PLAYER_TWO}`);
    });
  });

  describe("Lv.3 cost 1 Pilot with AP+1/HP+1", () => {
    it("pairs the exact card and visibly applies both printed bonuses", () => {
      const engine = GundamTestEngine.create({
        hand: [st07AllelujahHaptism012],
        play: [createMockUnit({ ap: 2, hp: 3 })],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      expectSuccess(p1.assignPilot(pilotId, hostId));
      expect(p1.getPilotId(hostId)).toBe(pilotId);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
    });

    it("cannot pair below Lv.3 or without an active Resource", () => {
      const low = GundamTestEngine.create({
        hand: [st07AllelujahHaptism012],
        play: [createMockUnit()],
        resourceArea: activeResources(2),
      }).asPlayer(PLAYER_ONE);
      expectFailure(
        low.assignPilot(st07AllelujahHaptism012, low.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
      const unpaid = GundamTestEngine.create({
        hand: [st07AllelujahHaptism012],
        play: [createMockUnit()],
        resourceArea: restedResources(3),
      }).asPlayer(PLAYER_ONE);
      expectFailure(
        unpaid.assignPilot(st07AllelujahHaptism012, unpaid.getCardsInZone("battleArea")[0]!),
        "INSUFFICIENT_RESOURCES",
      );
    });
  });

  describe("battle-damage prevention", () => {
    it("during its controller's turn, a friendly CB Link Unit prevents retaliation from AP3", () => {
      const host = createMockUnit({
        traits: ["cb"],
        linkCondition: "[Allelujah Haptism]",
        ap: 3,
        hp: 5,
      });
      const enemy = createMockUnit({ ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        { hand: [st07AllelujahHaptism012], play: [host], resourceArea: activeResources(3) },
        { play: [{ card: enemy, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st07AllelujahHaptism012, hostId));
      expectSuccess(p1.enterBattle(hostId, enemyId));
      resolveBattle(engine);
      expect(p1.getDamage(hostId)).toBe(0);
      expect(p2.getDamage(enemyId)).toBe(4);
    });

    it("does not prevent battle damage from an enemy Unit with 4 AP", () => {
      const host = createMockUnit({
        traits: ["cb"],
        linkCondition: "[Allelujah Haptism]",
        keywordEffects: [{ keyword: "Blocker" }],
        hp: 6,
      });
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const engine = GundamTestEngine.create(
        { hand: [st07AllelujahHaptism012], play: [host], resourceArea: activeResources(3) },
        { play: [{ card: enemy, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st07AllelujahHaptism012, hostId));
      expectSuccess(p1.enterBattle(hostId, p2.getCardsInZone("battleArea")[0]!));
      resolveBattle(engine);
      expect(p1.getDamage(hostId)).toBe(4);
    });

    it("does not prevent damage when the paired Unit is not linked", () => {
      const host = createMockUnit({ traits: ["cb"], hp: 6 });
      const enemy = createMockUnit({ ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        { hand: [st07AllelujahHaptism012], play: [host], resourceArea: activeResources(3) },
        { play: [{ card: enemy, exhausted: true }], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st07AllelujahHaptism012, hostId));
      expectSuccess(p1.enterBattle(hostId, p2.getCardsInZone("battleArea")[0]!));
      resolveBattle(engine);
      expect(p1.getDamage(hostId)).toBe(3);
    });

    it("does not prevent damage during the opponent's turn", () => {
      const host = createMockUnit({
        traits: ["cb"],
        linkCondition: "[Allelujah Haptism]",
        keywordEffects: [{ keyword: "Blocker" }],
        hp: 6,
      });
      const attacker = createMockUnit({ ap: 3, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [st07AllelujahHaptism012],
          play: [host],
          resourceArea: activeResources(3),
          deck: 5,
        },
        { play: [attacker], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      expectSuccess(p1.assignPilot(st07AllelujahHaptism012, hostId));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.declareBlock(hostId));
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());
      expect(p1.getDamage(hostId)).toBe(3);
    });
  });
});
