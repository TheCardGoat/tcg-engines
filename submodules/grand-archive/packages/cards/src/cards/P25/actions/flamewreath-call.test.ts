import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { flamewreathCall } from "./flamewreath-call.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { blueSlime } from "../../DOA/allies/blue-slime.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers c8wwslgbvr-a1
 * @covers c8wwslgbvr-a2
 */
describe("Flamewreath Call", () => {
  for (const matching of [false, true])
    for (const ownBeast of [false, true])
      for (const count of [0, 1, 2])
        it(`targets ${count} allies, Class Bonus=${matching}, own Beast=${ownBeast}`, () => {
          const champion = createClassBonusTestChampion(
            flamewreathCall,
            matching,
            "activation-discount",
          );
          const cost = matching && ownBeast ? 2 : 5;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [flamewreathCall, ...Array.from({ length: cost }, () => woodlandSquirrels)],
                field: [giantTortoise, ...(ownBeast ? [blueSlime] : [])],
              },
            },
            playerTwo: { champion, zones: { field: [giantTortoise, blueSlime] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const allies = [p.card(giantTortoise), q.card(giantTortoise)];
          const reservePayment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
          for (const ids of [
            [q.card(champion).objectId],
            [allies[0]!.objectId, allies[0]!.objectId],
            [...allies.map((ref) => ref.objectId), q.card(blueSlime).objectId],
          ]) {
            const before = game.state;
            expect(() =>
              p.activate(flamewreathCall, { reservePayment, targets: { "target-1": ids } }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const targets = { "target-1": allies.slice(0, count).map((ref) => ref.objectId) };
          const before = game.state;
          expect(() =>
            p.activate(flamewreathCall, { reservePayment: reservePayment.slice(1), targets }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(flamewreathCall, { reservePayment, targets });
          passEffectsStack(game);
          allies.forEach((ref, index) =>
            expect(game.state.objects[ref.objectId]!.damage).toBe(index < count ? 3 : 0),
          );
          expect(p.zone("memory")).toHaveLength(cost);
        });
});
