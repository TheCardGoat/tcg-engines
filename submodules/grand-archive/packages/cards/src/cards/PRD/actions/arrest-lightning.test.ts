import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { arrestLightning } from "./arrest-lightning.ts";
import { chargeStatic } from "./charge-static.ts";
import { pyroclasticFlow } from "../../MRC/actions/pyroclastic-flow.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 9e3B8EHQak-a1 */
describe("Arrest Lightning", () => {
  for (const level of [0, 1, 3])
    for (const timing of ["before", "after", "underneath"])
      it(`locks ${level} static counters at resolution, Charge Static=${timing}`, () => {
        const champion = enableAllTestElements(
          grantTestChampionLevel(
            createClassBonusTestChampion(arrestLightning, false, "activation-discount"),
            level,
          ),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                arrestLightning,
                chargeStatic,
                pyroclasticFlow,
                pyroclasticFlow,
                ...Array.from({ length: 12 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          target = p.card(champion);
        const pay = (count: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, count)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const charge = () =>
          p.activate(chargeStatic, {
            reservePayment: pay(2),
            targets: { "target-1": [target.objectId] },
          });
        if (timing !== "after") {
          charge();
          if (timing === "before") passEffectsStack(game);
        }
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId !== p.id)
          game.player(wait.playerId).pass();
        p.activate(arrestLightning, {
          reservePayment: pay(2),
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
        if (timing === "after") {
          charge();
          passEffectsStack(game);
        }
        expect(game.state.objects[target.objectId]!.counters.static ?? 0).toBe(level);
        for (let hit = 1; hit <= 2; hit++) {
          p.activate(p.cards(pyroclasticFlow, { zone: "hand" })[0]!, { reservePayment: pay(4) });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(
            Math.max(0, 2 * hit - (timing === "before" ? level : 0)),
          );
          expect(game.state.objects[target.objectId]!.counters.static ?? 0).toBe(level);
        }
      });
});
