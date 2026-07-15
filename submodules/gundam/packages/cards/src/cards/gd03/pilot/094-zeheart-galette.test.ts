import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03ZeheartGalette094 } from "./094-zeheart-galette.ts";

describe("Zeheart Galette (GD03-094)", () => {
  it("【Burst】 adds this card to hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { shieldArea: [gd03ZeheartGalette094] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03ZeheartGalette094)).toBe(`hand:${PLAYER_TWO}`);
  });

  describe("【When Paired】Place the top 2 cards of your deck into your trash. If you placed a (Vagan) card with this effect, choose 1 enemy Unit. It gets AP-2 during this turn.", () => {
    it("mills 2 and gives an enemy Unit AP-2 when one milled card is Vagan", () => {
      const host = createMockUnit({ name: "Zeheart Host", ap: 2, hp: 4 });
      const vaganCard = createMockUnit({ name: "Vagan Mill", traits: ["vagan"] });
      const filler = createMockUnit({ name: "Filler", traits: ["zeon"] });
      const bottomSentinel = createMockUnit({ name: "Bottom Sentinel" });
      const enemy = createMockUnit({ ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03ZeheartGalette094],
          play: [host],
          deck: [bottomSentinel, filler, vaganCard],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));
      expect(p1.getCardZone(vaganCard)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(filler)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: pilotId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(2);
      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());

      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
    });

    it("mills 2 without applying AP-2 when no milled card is Vagan", () => {
      const host = createMockUnit({ name: "Zeheart Host", ap: 2, hp: 4 });
      const filler1 = createMockUnit({ name: "Filler 1", traits: ["zeon"] });
      const filler2 = createMockUnit({ name: "Filler 2", traits: ["clan"] });
      const bottomSentinel = createMockUnit({ name: "Bottom Sentinel" });
      const enemy = createMockUnit({ ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03ZeheartGalette094],
          play: [host],
          deck: [bottomSentinel, filler1, filler2],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));

      expect(p1.getCardZone(filler1)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardZone(filler2)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getVisibleCard(enemyId)?.effectiveAp).toBe(4);
    });
  });
});
