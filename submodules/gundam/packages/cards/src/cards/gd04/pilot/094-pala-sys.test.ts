import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04PalaSys094 } from "./094-pala-sys.ts";

describe("Pala Sys (GD04-094)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04PalaSys094] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
  });

  describe("【When Linked】Choose 1 purple Unit card with <Suppression> from your trash. Add it to your hand.", () => {
    it("adds a purple Unit with Suppression from trash when linked", () => {
      const linkHost = createMockUnit({
        linkCondition: "[Pala Sys]",
      });
      const target = createMockUnit({
        color: "purple",
        keywordEffects: [{ keyword: "Suppression" }],
      });
      const engine = GundamTestEngine.create({
        hand: [gd04PalaSys094],
        play: [linkHost],
        trash: [target],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const targetId = p1.getCardsInZone("trash")[0]!;

      expectSuccess(p1.assignPilot(gd04PalaSys094, hostId));
      expectSuccess(p1.resolveEffect({ targets: [targetId] }));

      expect(p1.getCardsInZone("hand")).toContain(targetId);
      expect(p1.getCardsInZone("trash")).not.toContain(targetId);
    });

    it("does not add a non-purple Suppression Unit or a purple Unit without Suppression", () => {
      const linkHost = createMockUnit({
        linkCondition: "[Pala Sys]",
      });
      const wrongColor = createMockUnit({
        color: "blue",
        keywordEffects: [{ keyword: "Suppression" }],
      });
      const wrongKeyword = createMockUnit({ color: "purple", keywordEffects: [] });
      const engine = GundamTestEngine.create({
        hand: [gd04PalaSys094],
        play: [linkHost],
        trash: [wrongColor, wrongKeyword],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const trashBefore = p1.getCardsInZone("trash");

      expectSuccess(p1.assignPilot(gd04PalaSys094, hostId));

      expect(p1.getCardsInZone("hand")).toHaveLength(0);
      expect(p1.getCardsInZone("trash")).toEqual(trashBefore);
    });
  });
});
