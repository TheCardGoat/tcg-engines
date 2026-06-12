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
import { gd02ItSNameIsRyuseiGo114 } from "./114-it-s-name-is-ryusei-go.ts";

describe("It's Name is Ryusei-Go (GD02-114)", () => {
  describe("【Main】/【Action】Choose 1 damaged friendly Unit. It gets AP+2 during this turn.", () => {
    it("applies AP+2 modifier to a damaged friendly unit", () => {
      const unit = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02ItSNameIsRyuseiGo114],
        play: [unit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      // Seed damage so the unit qualifies as "damaged"
      engine.getG().damage[unitId!] = 1;
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd02ItSNameIsRyuseiGo114, { targets: [unitId!] }));

      const mod = findStatModifier(engine, unitId!, "ap");
      expect(mod).toBeDefined();
      expect(mod!.modifier).toBe(2);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target an undamaged unit", () => {
      const unit = createMockUnit({ ap: 2, hp: 3 });
      const engine = GundamTestEngine.create({
        hand: [gd02ItSNameIsRyuseiGo114],
        play: [unit],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(gd02ItSNameIsRyuseiGo114, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
