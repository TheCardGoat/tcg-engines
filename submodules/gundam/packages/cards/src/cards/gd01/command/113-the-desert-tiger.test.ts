import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  findStatModifier,
  expectCardInTrash,
} from "@tcg/gundam-engine";
import { gd01TheDesertTiger113 } from "./113-the-desert-tiger.ts";

describe("The Desert Tiger (GD01-113)", () => {
  describe("【Main】/【Action】Choose 1 friendly (ZAFT) Unit. It gets AP+3 during this turn.", () => {
    it("applies AP+3 modifier to a friendly ZAFT unit during main-phase", () => {
      const zaftUnit = createMockUnit({ traits: ["zaft"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd01TheDesertTiger113],
        play: [zaftUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01TheDesertTiger113, { targets: [unitId!] }));

      const mod = findStatModifier(engine, unitId!, "ap");
      expect(mod).toBeDefined();
      expect(mod!.modifier).toBe(3);
    });

    it("applies AP+3 modifier to a friendly ZAFT unit during action-phase", () => {
      const zaftUnit = createMockUnit({ traits: ["zaft"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd01TheDesertTiger113],
        play: [zaftUnit],
        resourceArea: activeResources(4),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(gd01TheDesertTiger113, { targets: [unitId!] }));

      const mod = findStatModifier(engine, unitId!, "ap");
      expect(mod).toBeDefined();
      expect(mod!.modifier).toBe(3);
    });

    it("cannot target a non-ZAFT unit", () => {
      const nonZaftUnit = createMockUnit({ traits: ["earth federation"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd01TheDesertTiger113],
        play: [nonZaftUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd01TheDesertTiger113, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });

    it("moves the command card to trash after resolution", () => {
      const zaftUnit = createMockUnit({ traits: ["zaft"], ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd01TheDesertTiger113],
        play: [zaftUnit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd01TheDesertTiger113, { targets: [unitId!] }));

      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
