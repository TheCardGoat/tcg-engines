import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  createMockUnit,
  expectCardPlayable,
  expectNoPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";
import { welcomeToNightCityRetailRebootOptics } from "@tcg/cyberpunk-cards";

const reboot = welcomeToNightCityRetailRebootOptics; // program, cost 2, Quick, sell tag

// A weak friendly defender and a stronger rival attacker, so the defender
// WOULD be defeated in a rival fight without the Reboot Optics protection.
const friendlyDefender = createMockUnit({
  id: "reboot-friendly-defender",
  name: "Friendly Defender",
  power: 2,
});
const rivalAttacker = createMockUnit({
  id: "reboot-rival-attacker",
  name: "Rival Attacker",
  power: 5,
});

describe("Reboot Optics (Retail)", () => {
  describe("UI prompt", () => {
    it("shows the program as playable when affordable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [reboot],
        eddies: reboot.cost,
      });
      expectCardPlayable(engine, reboot);
    });
  });

  describe("{Quick} Prevent the next rival-fight defeat this turn", () => {
    it("applies with NO target choice (it is a turn-duration buff, not a target)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [reboot],
        eddies: reboot.cost,
        field: [{ card: friendlyDefender, spent: false }],
      });
      engine.playCard(reboot);
      // Reboot Optics is a global turn-duration buff; it presents no target choice.
      expectNoPendingChoice(engine);
    });

    it("prevents the next rival fight from defeating the friendly unit (behavioral)", () => {
      // The rival attacker (power 5) fights the friendly defender (power 2).
      // Without the buff the defender is defeated; with Reboot Optics it survives.
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [reboot],
          eddies: reboot.cost,
          field: [{ card: friendlyDefender, spent: true, hasLag: false }],
        },
        { field: [{ card: rivalAttacker, spent: false, hasLag: false }] },
      );

      engine.playCard(reboot, { as: P1 });
      engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

      engine.attackUnit(rivalAttacker, friendlyDefender, { as: P2 });
      engine.resolveFullFight({ as: P2 });

      // The defender survived the fight (protection consumed).
      const p1Field = engine.getCardsInZone("field", P1).map((card) => card.definitionId);
      const p1Trash = engine.getCardsInZone("trash", P1).map((card) => card.definitionId);
      expect(p1Field).toContain(friendlyDefender.id);
      expect(p1Trash).not.toContain(friendlyDefender.id);
    });
  });
});
