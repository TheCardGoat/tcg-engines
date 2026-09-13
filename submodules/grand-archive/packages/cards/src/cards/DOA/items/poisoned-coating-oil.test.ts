import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { poisonedCoatingOil } from "./poisoned-coating-oil.ts";
import { patientRogue } from "../allies/patient-rogue.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers OofVX5hX8X-a1 */
describe("Poisoned Coating Oil's stealth requirement", () => {
  it("rejects allies without stealth, banishes itself, and adds two power for this turn", () => {
    const champion = createClassBonusTestChampion(patientRogue, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [poisonedCoatingOil, patientRogue, woodlandSquirrels],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [patientRogue], "main-deck": [woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      oil = p.card(poisonedCoatingOil),
      rogue = p.card(patientRogue);
    for (const target of [
      p.card(woodlandSquirrels, { zone: "field" }),
      q.card(patientRogue),
      p.card(champion),
    ]) {
      const before = game.state;
      expect(() =>
        p.activateAbility(oil, "OofVX5hX8X-a1", { targets: { "target-1": [target.objectId] } }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    p.activateAbility(oil, "OofVX5hX8X-a1", { targets: { "target-1": [rogue.objectId] } });
    expect(game.state.objects[oil.objectId]!.zone).toBe("banishment");
    passEffectsStack(game);
    p.declareAttack(rogue, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(2);
    advanceToMain(game, q.id);
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[rogue.objectId]!, "power", {
        program: game.program,
        state: game.state,
        controllerId: p.id,
        bindings: {},
      }),
    ).toBe(0);
  });
});
