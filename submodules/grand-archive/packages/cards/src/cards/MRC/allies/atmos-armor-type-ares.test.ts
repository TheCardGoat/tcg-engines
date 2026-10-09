import { describe } from "vitest";
import { atmosArmorTypeAres } from "./atmos-armor-type-ares.ts";
import { atmosShield } from "../../MRC/tokens/atmos-shield.ts";
import { proveSummonOnEnter } from "../../../testing/summon-on-enter.ts";
/** @covers rh0foylxnq-a1 */
describe("atmosArmorTypeAres", () => {
  proveSummonOnEnter({
    card: atmosArmorTypeAres,
    token: atmosShield,
    cost: 3,
    count: 2,
    abilityId: "rh0foylxnq-a1",
  });
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
/** @covers rh0foylxnq-a2 */
describe("Atmos Armor Type-Ares — named ally power", () => {
  for (const matching of [false, true])
    for (const count of [0, 1, 2])
      it(`counts own shields with matching=${matching}, count=${count}`, () => {
        const champion = createClassBonusTestChampion(
          atmosArmorTypeAres,
          matching,
          "activation-discount",
        );
        const defender = lineageTestChampion("Opponent", 0);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [atmosArmorTypeAres, ...Array.from({ length: count }, () => atmosShield)],
              graveyard: [atmosShield],
            },
          },
          playerTwo: { champion: defender, zones: { field: [atmosShield, atmosShield] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = q.card(defender);
        p.declareAttack(p.card(atmosArmorTypeAres), target);
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]!.damage).toBe(1 + (matching ? count : 0));
      });
});
