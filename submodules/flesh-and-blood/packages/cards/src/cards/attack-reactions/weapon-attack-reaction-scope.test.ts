import { describe, it } from "vitest";
import { expectCombat, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { bravo } from "../heroes/bravo.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { refractionBolters } from "../equipment/refraction-bolters.ts";
import { punctureRed } from "./puncture.ts";
import { overpowerRed } from "./overpower.ts";
import { outForBloodRed } from "./out-for-blood.ts";

describe("weapon attack reaction scope AAA (CR 1.4.3e)", () => {
  it.each([
    ["Puncture", punctureRed, 6],
    ["Overpower", overpowerRed, 7],
    ["Out for Blood", outForBloodRed, 6],
  ] as const)(
    "applies %s to one Dawnblade attack, not its next activation",
    (_name, reaction, power) => {
      const game = FabTestEngine.start(
        {
          hero: dorinthea,
          weapon1: [dawnblade],
          legs: [refractionBolters],
          hand: [reaction],
          deck: 8,
          resourcePoints: 6,
        },
        { hero: bravo, hand: [], deck: 8 },
        { autoPassPriority: false },
      );
      const attacker = game.as(dorinthea);
      attacker.activateAttack(dawnblade);
      game.as(bravo).defendWith();
      game.toReaction("attacker");
      attacker.must.playReaction(reaction);
      attacker.pass();
      game.as(bravo).pass();
      expectCombat(game).toHaveAttackPower(power);

      game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
      const order = attacker.expectDecision("ordering");
      game.answerDecision(attacker.id, {
        kind: "ordering",
        orderedIds: order.entries.map((entry) => entry.id),
      });
      game.closeCombat({ optionals: "accept" });
      attacker.activateAttack(dawnblade);
      expectCombat(game).toHaveAttackPower(3);
    },
  );
});
