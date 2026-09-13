import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { rustedWarshield } from "../items/rusted-warshield.ts";
import { umbraSight } from "./umbra-sight.ts";

/** @covers f15joh300z-a1 @covers f15joh300z-a2 */
describe("Umbra Sight — hand draw and optional lineage Curse", () => {
  for (const accept of [false, true]) {
    it(`${accept ? "accepts" : "declines"} the memory draw and lineage consequence`, () => {
      const champion = createClassBonusTestChampion(umbraSight, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: accept ? [rustedWarshield] : [],
            hand: [umbraSight],
            "main-deck": [giantTortoise, woodlandSquirrels, giantTortoise, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      if (accept) {
        player.activateAbility(rustedWarshield, "fp66pv4n1n-a1");
        passEffectsStack(game);
      }
      const action = player.card(umbraSight, { zone: "hand" });
      const deck = player.zone("main-deck");
      const expectedHandDraw = deck[0]!;
      const expectedMemoryDraw = deck[1]!;
      const ownChampion = player.card(champion, { zone: "field" });

      player.activate(action);
      passEffectsStack(game);
      expect(player.zone("hand")).toContainEqual(expectedHandDraw);
      expect(game.state.decision?.kind).toBe("resolve-optional-effect");
      expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
      answerDecision(game, "resolve-optional-effect", accept);
      passEffectsStack(game);

      if (accept) {
        expect(player.zone("memory")).toContainEqual(expectedMemoryDraw);
        expect(game.state.objects[action.objectId]!.zone).toBe("inner-lineage");
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(2);
        expect(game.state.objects[opponent.card(champion).objectId]!.damage).toBe(0);
      } else {
        expect(player.zone("memory")).toHaveLength(0);
        expect(game.state.objects[action.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
      }
    });
  }
});
