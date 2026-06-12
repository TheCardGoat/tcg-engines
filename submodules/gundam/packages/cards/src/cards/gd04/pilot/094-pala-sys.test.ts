import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd04PalaSys094 } from "./094-pala-sys.ts";

describe("Pala Sys (GD04-094)", () => {
  it("【Burst】adds this card to hand", () => {
    const engine = GundamTestEngine.create({ deck: [gd04PalaSys094] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_ONE, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_ONE).getHand()).toContain(shieldId);
  });

  describe("【When Linked】Choose 1 purple Unit card with <Suppression> from your trash. Add it to your hand.", () => {
    it("adds a purple Unit with Suppression from trash when linked", () => {
      const linkHost = createMockUnit({
        linkCondition: "[Pala Sys]",
        // biome-ignore lint/suspicious/noExplicitAny: linkCondition is outside createMockUnit's public type
      } as any);
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

      expect(p1.getCardsInZone("hand")).toContain(targetId);
      expect(p1.getCardsInZone("trash")).not.toContain(targetId);
    });

    it("does not add a non-purple Suppression Unit or a purple Unit without Suppression", () => {
      const linkHost = createMockUnit({
        linkCondition: "[Pala Sys]",
        // biome-ignore lint/suspicious/noExplicitAny: linkCondition is outside createMockUnit's public type
      } as any);
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
