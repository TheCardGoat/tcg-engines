import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { stillshardStrike } from "./stillshard-strike.ts";
import { soultraceTessellation } from "../actions/soultrace-tessellation.ts";
import { acceptedContract } from "../../DOA/actions/accepted-contract.ts";
import { cosmicBolt } from "../../SP4/actions/cosmic-bolt.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers TDI5DOrWB5-a1
 * @covers TDI5DOrWB5-a2
 */
describe("Stillshard Strike", () => {
  for (const prepared of [false, true])
    for (const sheen of [0, 3, 6])
      for (const kind of ["ally", "champion"])
        it(`recovers from defending units only, prepared=${prepared}, sheen=${sheen}, ${kind}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(stillshardStrike, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  stillshardStrike,
                  acceptedContract,
                  cosmicBolt,
                  cosmicBolt,
                  ...Array.from({ length: 2 + sheen / 3 }, () => soultraceTessellation),
                  ...Array.from({ length: 21 }, () => woodlandSquirrels),
                ],
              },
            },
            playerTwo: { champion, zones: { field: [giantTortoise] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            target = q.card(kind === "ally" ? giantTortoise : champion),
            other = q.card(kind === "ally" ? champion : giantTortoise);
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          for (const bolt of p.cards(cosmicBolt, { zone: "hand" })) {
            p.activate(bolt, { reservePayment: pay(3), targets: { "target-1": [hero.objectId] } });
            passEffectsStack(game);
          }
          for (const recipient of [
            hero,
            other,
            ...Array.from({ length: sheen / 3 }, () => target),
          ]) {
            p.activate(p.cards(soultraceTessellation, { zone: "hand" })[0]!, {
              reservePayment: pay(2),
              targets: { "target-unit": [recipient.objectId] },
            });
            passEffectsStack(game);
          }
          expect(game.state.objects[hero.objectId]!.damage).toBe(10);
          p.activate(acceptedContract, { reservePayment: pay(5) });
          passEffectsStack(game);
          p.activate(stillshardStrike, {
            reservePayment: pay(2),
            attackAttackerId: hero.objectId,
            ...(prepared ? { prepareAbilityIndexes: [0] as const } : {}),
          });
          expect(game.state.objects[hero.objectId]!.counters.preparation).toBe(prepared ? 2 : 3);
          passEffectsStack(game);
          declareResolvedAttack(game, hero.objectId, target.objectId, "Resolve Stillshard Strike");
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(prepared ? 9 - sheen : 10);
          expect(game.state.objects[target.objectId]!.damage).toBe(0);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(3);
          expect(game.state.objects[hero.objectId]!.damage).toBe(prepared ? 9 - sheen : 10);
        });
});
