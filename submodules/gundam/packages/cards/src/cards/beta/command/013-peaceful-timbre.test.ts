import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  expectSuccess,
  activeResources,
  expectCardInTrash,
  hasPreventDamageToZone,
} from "@tcg/gundam-engine";
import { betaPeacefulTimbre013 } from "./013-peaceful-timbre.ts";

describe("Peaceful Timbre (ST02-013, beta reprint)", () => {
  describe("【Action】Shield area can't receive damage from Lv.4-or-lower enemy Units this battle.", () => {
    it("installs a prevent-damage-to-zone entry protecting the caster's shield area", () => {
      const engine = GundamTestEngine.create({
        hand: [betaPeacefulTimbre013],
        resourceArea: activeResources(4),
      });
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cmdId = p1.getHand()[0]!;

      expectSuccess(p1.playCommand(betaPeacefulTimbre013));

      expect(hasPreventDamageToZone(engine, p1.playerId, "shieldArea")).toBe(true);
      expectCardInTrash(engine, cmdId, p1.playerId);
    });
  });
});
