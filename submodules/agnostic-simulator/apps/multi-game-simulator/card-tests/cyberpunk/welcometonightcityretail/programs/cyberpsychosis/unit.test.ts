import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCyberpsychosis,
  welcomeToNightCityRetailKiroshiOptics,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "@cyberpunk-engine/active-effects/index.ts";
import { CyberpunkTestEngine, P1, expectNoPendingChoice } from "@cyberpunk-engine/testing/index.ts";

// Cyberpsychosis: "{Quick} Give an equipped Unit +3 power this turn for each of
// its equipped Gears. If that Unit steals or fights, defeat it at the end of
// this turn."
const cyberpsychosis = welcomeToNightCityRetailCyberpsychosis; // program, cost 3, Quick
const host = welcomeToNightCityRetailRidingNomad; // ADRENALINE unit (can attack turn played)

describe("Cyberpsychosis", () => {
  describe("{Quick} Give an equipped Unit +3 power this turn for each of its equipped Gears", () => {
    it("grants +3 power per attached Gear to the chosen equipped Unit", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [cyberpsychosis],
        field: [
          {
            card: host,
            spent: false,
            hasLag: false,
            attachedGears: [
              welcomeToNightCityRetailKiroshiOptics,
              welcomeToNightCityRetailMantisBlades,
            ],
          },
        ],
        eddies: 3,
      });
      const hostCard = engine.getCard(host, "field", P1);
      const powerBefore = getEffectivePower(engine.getState(), hostCard.instanceId);

      engine.playCard(cyberpsychosis, { as: P1 });
      engine.resolveEffectTarget(host, { as: P1 });

      // 2 Gears × +3 = +6 power on top of the host's prior effective power.
      expect(getEffectivePower(engine.getState(), hostCard.instanceId)).toBe(powerBefore + 6);
    });

    it("creates no choice when no equipped Unit exists (no valid binding target)", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [cyberpsychosis],
        field: [{ card: host, spent: false, hasLag: false }], // no Gear attached
        eddies: 3,
      });

      engine.playCard(cyberpsychosis, { as: P1 });

      // No equipped Unit → the binding has no target → no prompt; the Program
      // still resolves to trash.
      expectNoPendingChoice(engine);
      expect(engine.getCardsInZone("trash", P1).map((c) => c.definitionId)).toContain(
        cyberpsychosis.id,
      );
    });
  });

  describe("If that Unit steals or fights, defeat it at the end of this turn", () => {
    it("defeats the buffed Unit at end of turn after it steals a Gig", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [cyberpsychosis],
          field: [
            {
              card: host,
              spent: false,
              hasLag: false,
              attachedGears: [welcomeToNightCityRetailKiroshiOptics],
            },
          ],
          eddies: 3,
        },
        { gigArea: [{ dieType: "d6", faceValue: 2 }] },
      );

      engine.playCard(cyberpsychosis, { as: P1 });
      engine.resolveEffectTarget(host, { as: P1 });

      // The Unit steals a Gig, triggering the end-of-turn defeat clause.
      engine.attackRival(host, { as: P1 });
      // Resolve any pending trigger/effect-target prompts from the attack.
      const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
      if (triggerChoice?.type === "chooseTrigger") {
        engine.executeMove(
          "resolveTrigger",
          { args: { triggerId: triggerChoice.payload.options[0]!.triggerId } },
          triggerChoice.chooserId,
        );
      }
      const effectChoice = engine.getState().G.turnMetadata.pendingChoice;
      if (
        effectChoice?.type === "chooseTarget" &&
        effectChoice.payload.type === "effectTarget" &&
        effectChoice.payload.eligibleIds?.[0]
      ) {
        engine.resolveEffectTargetIds([effectChoice.payload.eligibleIds[0]], {
          as: effectChoice.chooserId,
        });
      }
      engine.resolveFullSteal({ as: P1 });

      // End the turn → the buffed Unit is defeated.
      engine.completeTurn({ as: P1 });

      expect(engine.getCardsInZone("trash", P1).map((c) => c.definitionId)).toContain(host.id);
    });
  });
});
