import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { unwelcomeFortune } from "./unwelcome-fortune.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers pgt4lhko8w-a1 */
describe("Unwelcome Fortune — controller looks at target player's memory", () => {
  for (const own of [false, true])
    for (const empty of [false, true])
      it(`looks at ${own ? "own" : "opposing"} memory, empty=${empty}`, () => {
        const champion = createClassBonusTestChampion(
          unwelcomeFortune,
          false,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [unwelcomeFortune, woodlandSquirrels, woodlandSquirrels],
              memory: empty ? [] : [giantTortoise],
            },
          },
          playerTwo: {
            champion,
            zones: {
              memory: empty ? [] : [giantTortoise, woodlandSquirrels],
              hand: [giantTortoise],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = own ? p : q;
        const payment = p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(unwelcomeFortune, {
            targets: { "target-player": [q.card(champion).objectId] },
            reservePayment: payment,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(unwelcomeFortune, {
          targets: { "target-player": [target.id] },
          reservePayment: payment,
        });
        const memory = target.zone("memory");
        expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(0);
        passEffectsStack(game);
        const looks = game.state.eventHistory.filter((e) => e.type === "cards-looked-at");
        expect(looks).toHaveLength(memory.length ? 1 : 0);
        if (memory.length)
          expect(looks[0]).toMatchObject({
            playerId: p.id,
            actorId: p.id,
            objectIds: memory.map((c) => c.objectId),
          });
        expect(target.zone("memory")).toEqual(memory);
        expect(q.cards(giantTortoise, { zone: "hand" })).toHaveLength(1);
        expect(game.state.eventHistory.filter((e) => e.type === "card-revealed")).toHaveLength(0);
      });
});
