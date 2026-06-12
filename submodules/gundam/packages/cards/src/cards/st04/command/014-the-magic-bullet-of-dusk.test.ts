import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  expectFailure,
  createMockUnit,
  activeResources,
  expectCardInTrash,
  hasKeywordGrant,
} from "@tcg/gundam-engine";
import { st04TheMagicBulletOfDusk014 } from "./014-the-magic-bullet-of-dusk.ts";

describe("The Magic Bullet of Dusk (ST04-014)", () => {
  describe("【Main】/【Action】Choose 1 friendly Unit that is Lv.2 or lower. It gains <First Strike>.", () => {
    it("grants <First Strike> to a Lv.2 or lower friendly unit", () => {
      const unit = createMockUnit({ ap: 2, hp: 2, level: 2 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [unit],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(st04TheMagicBulletOfDusk014, { targets: [unitId!] }));

      expect(hasKeywordGrant(engine, unitId!, "FirstStrike")).toBe(true);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });

    it("cannot target a friendly unit above Lv.2", () => {
      const bigUnit = createMockUnit({ ap: 4, hp: 4, level: 4 });
      const engine = GundamTestEngine.create({
        hand: [st04TheMagicBulletOfDusk014],
        play: [bigUnit],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [unitId] = p1.getCardsInZone("battleArea");

      expectFailure(
        p1.playCommand(st04TheMagicBulletOfDusk014, { targets: [unitId!] }),
        "INVALID_TARGET",
      );
    });
  });
});
