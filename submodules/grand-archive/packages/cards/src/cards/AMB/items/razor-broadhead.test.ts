import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveLoadBow } from "../../../testing/load-bow.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { intricateLongbow } from "../weapons/intricate-longbow.ts";
import { razorBroadhead } from "./razor-broadhead.ts";

/** @covers si9ux3ak6o-a1 */
describe("Razor Broadhead — load", () => {
  proveLoadBow({ card: razorBroadhead, abilityId: "si9ux3ak6o-a1" });
});

/** @covers si9ux3ak6o-a2 */
describe("Razor Broadhead — distant On Attack", () => {
  for (const distant of [false, true]) {
    it(`${distant ? "gains" : "does not gain"} +3 POWER when the attacker is distant=${distant}`, () => {
      const champion = createClassBonusTestChampion(razorBroadhead, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [razorBroadhead, intricateLongbow],
            hand: distant ? [reposition, woodlandSquirrels] : [],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const arrow = player.card(razorBroadhead, { zone: "field" });
      const bow = player.card(intricateLongbow, { zone: "field" });
      const attacker = player.card(champion, { zone: "field" });
      if (distant) {
        player.activate(reposition, {
          targets: { "target-1": [attacker.objectId] },
          reservePayment: [
            { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ],
        });
        passEffectsStack(game);
      }
      player.activateAbility(arrow, "si9ux3ak6o-a1", {
        targets: { "target-weapon": [bow.objectId] },
      });
      passEffectsStack(game);
      player.declareAttack(attacker, game.player("player-two").card(champion), {
        weaponIds: [bow.objectId],
      });
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "si9ux3ak6o-a2",
        ),
      ).toBe(true);
      const powerOf = () =>
        deriveGrandArchiveNumericProperty(game.state.objects[arrow.objectId]!, "power", {
          program: game.program,
          state: game.state,
          controllerId: player.id,
          bindings: {},
        });
      expect(powerOf()).toBe(3);
      passEffectsStack(game);
      expect(powerOf()).toBe(distant ? 6 : 3);
    });
  }
});
