import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { voidsCloak } from "./voids-cloak.ts";
import { peacefulReunion } from "../../FTC/actions/peaceful-reunion.ts";
import { reduceToAsh } from "../../P24/actions/reduce-to-ash.ts";
import { waterHerbs } from "../../MRC/actions/water-herbs.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers wqpsErSeFn-a1 */
describe("Void's Cloak — player spellshroud", () => {
  for (const holder of ["player-one", "player-two"])
    for (const copies of [1, 2])
      it(`protects only its player: holder=${holder}, copies=${copies}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(fireball, true, "activation-discount"),
        );
        const cloaks = Array.from({ length: copies }, () => voidsCloak);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: holder === "player-one" ? cloaks : [],
              graveyard: [voidsCloak],
              hand: [
                peacefulReunion,
                peacefulReunion,
                waterHerbs,
                fireball,
                ...Array.from({ length: copies }, () => reduceToAsh),
                ...Array.from({ length: 20 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: holder === "player-two" ? cloaks : [],
              graveyard: [voidsCloak],
              "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          protectedPlayer = game.player(holder),
          other = game.player(holder === "player-one" ? "player-two" : "player-one");
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const reject = () => {
          const before = game.state;
          expect(() =>
            p.activate(p.cards(peacefulReunion, { zone: "hand" })[0]!, {
              reservePayment: pay(4),
              targets: { "target-player": [protectedPlayer.id] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
        };
        reject();
        p.activate(p.cards(peacefulReunion, { zone: "hand" })[0]!, {
          reservePayment: pay(4),
          targets: { "target-player": [other.id] },
        });
        passEffectsStack(game);
        p.activate(waterHerbs, {
          reservePayment: pay(2),
          targets: { "target-player": [protectedPlayer.id] },
        });
        passEffectsStack(game);
        expect(protectedPlayer.zone("main-deck")).toHaveLength(3);
        const hero = protectedPlayer.card(champion);
        p.activate(fireball, { reservePayment: pay(2), targets: { "target-1": [hero.objectId] } });
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(1);
        const sources = protectedPlayer.cards(voidsCloak, { zone: "field" });
        for (const [index, source] of sources.entries()) {
          p.activate(p.cards(reduceToAsh, { zone: "hand" })[0]!, {
            reservePayment: pay(3),
            targets: { "target-1": [source.objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
          if (index + 1 < sources.length) reject();
        }
        const spell = p.cards(peacefulReunion, { zone: "hand" })[0]!;
        p.activate(spell, {
          reservePayment: pay(4),
          targets: { "target-player": [protectedPlayer.id] },
        });
        passEffectsStack(game);
        expect(game.state.objects[spell.objectId]!.zone).toBe("banishment");
        expect(game.state.decision).toBeNull();
      });
});
