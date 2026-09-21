import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveRangedAlly } from "../../../testing/ranged-ally.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { perseRelentlessRaptor } from "./perse-relentless-raptor.ts";

/** @covers nl1gxrpx8j-a1 */
describe("Perse, Relentless Raptor — Ranged 2", () => {
  proveRangedAlly({
    card: perseRelentlessRaptor,
    power: 1,
    ranged: 2,
    classBonus: false,
  });
});

/** @covers nl1gxrpx8j-a2 */
describe("Perse, Relentless Raptor — distant suppression", () => {
  for (const distant of [false, true]) {
    it(`${distant ? "suppresses" : "cannot suppress"} while distant=${distant}`, () => {
      const champion = createClassBonusTestChampion(
        perseRelentlessRaptor,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [perseRelentlessRaptor],
            hand: distant ? [reposition, woodlandSquirrels] : [],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { field: [trainingSword], "main-deck": [woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const source = player.card(perseRelentlessRaptor);
      const target = opponent.card(trainingSword);
      if (distant) {
        player.activate(reposition, {
          targets: { "target-1": [source.objectId] },
          reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
        });
        passEffectsStack(game);
      }
      const before = game.state;
      if (!distant) {
        expect(() =>
          player.activateAbility(source, "nl1gxrpx8j-a2", {
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      expect(() =>
        player.activateAbility(source, "nl1gxrpx8j-a2", {
          targets: { "target-1": [player.card(champion).objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      player.activateAbility(source, "nl1gxrpx8j-a2", {
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
      advanceToMain(game, opponent.id);
      expect(game.state.objects[target.objectId]!.zone).toBe("field");
    });
  }
});
