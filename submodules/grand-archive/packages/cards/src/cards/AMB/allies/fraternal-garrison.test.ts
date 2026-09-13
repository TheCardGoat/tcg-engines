import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fraternalGarrison } from "./fraternal-garrison.ts";

function jinChampion(enabled: boolean) {
  const champion = createClassBonusTestChampion(fraternalGarrison, true, "activation-discount");
  if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: { ...champion.layout.face, lineageName: enabled ? "Jin" : "Not Jin" },
    },
  };
}

/** @covers ln926ymxdc-a1 */
describe("Fraternal Garrison — Jin Bonus ally-entry power", () => {
  for (const jin of [false, true]) {
    it(`${jin ? "gains" : "does not gain"} +1 POWER until end of turn when another ally enters`, () => {
      const champion = jinChampion(jin);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: [fraternalGarrison], hand: [woodlandSquirrels] },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const garrison = player.card(fraternalGarrison, { zone: "field" });
      player.activate(woodlandSquirrels);
      player.pass();
      opponent.pass();
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "ln926ymxdc-a1",
        ),
      ).toBe(jin);
      passEffectsStack(game);
      const target = opponent.card(champion, { zone: "field" });
      player.declareAttack(garrison, target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(jin ? 2 : 1);
    });
  }
});
