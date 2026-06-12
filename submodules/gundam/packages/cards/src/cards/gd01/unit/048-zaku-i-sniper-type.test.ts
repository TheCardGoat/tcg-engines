import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01ZakuISniperType048 } from "./048-zaku-i-sniper-type.ts";

describe("Zaku I Sniper Type (GD01-048)", () => {
  it("【Activate·Main】<Support 1> buffs only the chosen friendly Unit by AP+1", () => {
    const ally1 = createMockUnit({ ap: 2, hp: 3 });
    const ally2 = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [gd01ZakuISniperType048, ally1, ally2], resourceArea: activeResources(3) },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [supporterId, ally1Id, ally2Id] = p1.getCardsInZone("battleArea");
    if (!supporterId || !ally1Id || !ally2Id) throw new Error("setup failed");

    expectSuccess(p1.useSupport(supporterId, ally1Id));

    expect(engine.getG().exhausted[supporterId]).toBe(true);
    const apBuffs = engine
      .getG()
      .continuousEffects.filter(
        (e) => e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
      );
    expect(apBuffs).toHaveLength(1);
    expect(apBuffs[0]!.targetId).toBe(ally1Id);
    expect(apBuffs.find((e) => e.targetId === ally2Id)).toBeUndefined();
    expect(apBuffs[0]!.payload.kind === "stat-modifier" && apBuffs[0]!.payload.modifier).toBe(1);
  });

  describe("【Deploy】Look at the top — tutor a (Zeon) OR (Neo Zeon) Unit", () => {
    it("tutors a Zeon Unit on top of the deck into hand (first OR branch)", () => {
      const zeonUnit = createMockUnit({ name: "Zaku", traits: ["zeon"] });
      const engine = GundamTestEngine.create({
        hand: [gd01ZakuISniperType048],
        resourceArea: activeResources(2),
        deck: [zeonUnit],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handSizeBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.deployUnit(gd01ZakuISniperType048));

      // Zaku played (-1 from hand) and tutor adds Zeon Unit (+1) — net 0.
      expect(p1.getHand().length).toBe(handSizeBefore);
      // Tutor removes the card from deck.
      expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 1);
    });

    it("tutors a Neo Zeon Unit on top of the deck into hand (second OR branch)", () => {
      const neoZeonUnit = createMockUnit({ name: "Sazabi", traits: ["neo zeon"] });
      const engine = GundamTestEngine.create({
        hand: [gd01ZakuISniperType048],
        resourceArea: activeResources(2),
        deck: [neoZeonUnit],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handSizeBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.deployUnit(gd01ZakuISniperType048));

      expect(p1.getHand().length).toBe(handSizeBefore);
      expect(p1.getCardsInZone("deck").length).toBe(deckBefore - 1);
    });

    it("does NOT tutor a non-Zeon/Neo-Zeon Unit — OR predicate fails", () => {
      const efsfUnit = createMockUnit({ name: "GM", traits: ["earth federation"] });
      const engine = GundamTestEngine.create({
        hand: [gd01ZakuISniperType048],
        resourceArea: activeResources(2),
        deck: [efsfUnit],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handSizeBefore = p1.getHand().length;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.deployUnit(gd01ZakuISniperType048));

      // No tutor — Zaku leaves hand, nothing added: -1. Deck returns unchanged.
      expect(p1.getHand().length).toBe(handSizeBefore - 1);
      expect(p1.getCardsInZone("deck").length).toBe(deckBefore);
    });
  });
});
