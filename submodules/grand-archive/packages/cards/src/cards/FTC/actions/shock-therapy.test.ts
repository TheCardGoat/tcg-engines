import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { shockTherapy } from "./shock-therapy.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { jewelOfEnlightenment } from "../../DOA/items/jewel-of-enlightenment.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers tyj2s3572j-a2 */
describe("Shock Therapy counts only its controller's enlighten at resolution", () => {
  for (const count of [0, 1, 3, 5])
    for (const respond of [false, true])
      for (const own of [false, true])
        it(`counters=${count}, response=${respond}, own ally=${own}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(shockTherapy, false, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [
                  giantTortoise,
                  ...Array.from({ length: count + 1 }, () => jewelOfEnlightenment),
                ],
                hand: [shockTherapy, woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { field: [giantTortoise, jewelOfEnlightenment] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const jewels = p.cards(jewelOfEnlightenment, { zone: "field" });
          for (const jewel of jewels.slice(0, count)) {
            p.activateAbility(jewel, "AKA19OwaCh-a1");
            passEffectsStack(game);
          }
          expect(game.state.objects[p.card(champion).objectId]!.counters.enlighten ?? 0).toBe(
            count,
          );
          const target = (own ? p : q).card(giantTortoise);
          const reservePayment = p
            .cards(woodlandSquirrels)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const invalid of [
            p.card(champion),
            q.card(champion),
            q.card(jewelOfEnlightenment),
          ]) {
            const before = game.state;
            expect(() =>
              p.activate(shockTherapy, {
                reservePayment,
                targets: { "target-1": [invalid.objectId] },
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(shockTherapy, { reservePayment, targets: { "target-1": [target.objectId] } });
          p.pass();
          q.activateAbility(jewelOfEnlightenment, "AKA19OwaCh-a1");
          q.pass();
          if (respond) p.activateAbility(jewels[count]!, "AKA19OwaCh-a1");
          passEffectsStack(game);
          const damage = count + (respond ? 1 : 0);
          expect(game.state.objects[target.objectId]!.zone).toBe(
            damage >= 6 ? "graveyard" : "field",
          );
          expect(game.state.objects[target.objectId]!.damage).toBe(damage >= 6 ? 0 : damage);
          expect(game.state.objects[(own ? q : p).card(giantTortoise).objectId]!.damage).toBe(0);
          expect(game.state.objects[p.card(champion).objectId]!.counters.enlighten ?? 0).toBe(
            damage,
          );
          expect(game.state.objects[q.card(champion).objectId]!.counters.enlighten).toBe(1);
        });
});
