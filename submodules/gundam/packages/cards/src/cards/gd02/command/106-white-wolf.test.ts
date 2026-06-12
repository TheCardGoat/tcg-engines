import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  expectCardInTrash,
  hasPreventDamageToZone,
} from "@tcg/gundam-engine";
import { gd02WhiteWolf106 } from "./106-white-wolf.ts";

describe("White Wolf (GD02-106)", () => {
  describe("【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.3 or lower.", () => {
    it("installs a prevent-damage-to-zone entry protecting the caster's shield area", () => {
      const engine = GundamTestEngine.create({
        hand: [gd02WhiteWolf106],
        resourceArea: activeResources(3),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(gd02WhiteWolf106));

      expect(hasPreventDamageToZone(engine, p1.playerId, "shieldArea")).toBe(true);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
