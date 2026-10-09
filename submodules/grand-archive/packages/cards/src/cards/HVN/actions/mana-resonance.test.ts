import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { shroudInMist } from "../../DOA/actions/shroud-in-mist.ts";
import { ravagingTempest } from "../../DOA/actions/ravaging-tempest.ts";
import { deepSeaFractal } from "../../FTC/phantasias/deep-sea-fractal.ts";
import { manaResonance } from "./mana-resonance.ts";
/** @covers qp65vbdw7c-a1 */
/** @covers qp65vbdw7c-a2 */
describe("Mana Resonance — opponent Spell cost and actual reserved cards", () => {
  for (const matching of [false, true])
    for (const opponent of [false, true])
      for (const spellCase of ["none", "one", "four", "five", "eight", "four-plus-one"] as const) {
        const spells =
          spellCase === "none"
            ? []
            : spellCase === "one"
              ? [favorableWinds]
              : spellCase === "four"
                ? [fireball]
                : spellCase === "five"
                  ? [shroudInMist]
                  : spellCase === "eight"
                    ? [ravagingTempest]
                    : [fireball, favorableWinds];
        const maximum =
          spellCase === "none"
            ? 0
            : spellCase === "one"
              ? 1
              : spellCase === "five"
                ? 5
                : spellCase === "eight"
                  ? 8
                  : 4;
        const cost = matching && opponent ? Math.max(0, 5 - maximum) : 5;
        for (const payment of cost ? ["cards", "reservable", "mixed"] : ["cards"])
          it(`class=${matching}, opponent=${opponent}, spells=${spellCase}, payment=${payment}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(manaResonance, matching, "activation-discount"),
            );
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: Array.from({ length: 5 }, () => deepSeaFractal),
                  hand: [
                    manaResonance,
                    ...spells,
                    ...Array.from({ length: 15 }, () => woodlandSquirrels),
                  ],
                  "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
                },
              },
              playerTwo: {
                champion,
                zones: {
                  hand: [...spells, ...Array.from({ length: 12 }, () => woodlandSquirrels)],
                  "main-deck": [woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two");
            const actor = opponent ? q : p;
            if (opponent && spells.length) p.pass();
            for (const spell of spells) {
              const amount =
                spell === favorableWinds
                  ? 1
                  : spell === fireball
                    ? 4
                    : spell === shroudInMist
                      ? 5
                      : 8;
              actor.activate(spell, {
                reservePayment: actor
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, amount)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                ...(spell === fireball
                  ? { targets: { "target-1": [p.card(champion).objectId] } }
                  : {}),
              });
            }
            if (opponent && spells.length) q.pass();
            const count = payment === "reservable" ? 0 : payment === "mixed" ? 1 : cost;
            const cards = p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, count)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            const sources = p.cards(deepSeaFractal, { zone: "field" }).slice(0, cost - count);
            const reservePayment = [
              ...cards,
              ...sources.map((c) => ({ kind: "reservable" as const, objectId: c.objectId })),
            ];
            const before = game.state;
            if (cost) {
              expect(() =>
                p.activate(manaResonance, { reservePayment: reservePayment.slice(1) }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            const extra = p.cards(woodlandSquirrels, { zone: "hand" })[count]!;
            expect(() =>
              p.activate(manaResonance, {
                reservePayment: [...reservePayment, { kind: "card", cardId: extra.objectId }],
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
            const deck = p.zone("main-deck"),
              otherDeck = q.zone("main-deck");
            p.activate(manaResonance, { reservePayment });
            for (const source of sources)
              expect(game.state.objects[source.objectId]?.states.has("rested")).toBe(true);
            const hand = p.zone("hand"),
              memory = p.zone("memory");
            expect(p.zone("main-deck")).toEqual(deck);
            for (let i = 0; i < 20 && game.state.stack.length > spells.length; i++) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
            expect(game.state.stack).toHaveLength(spells.length);
            const draws = count === 0 ? 2 : 1;
            expect(p.zone("hand")).toEqual([...hand, ...deck.slice(0, draws)]);
            expect(p.zone("main-deck")).toEqual(deck.slice(draws));
            expect(p.zone("memory")).toEqual(memory);
            expect(q.zone("main-deck")).toEqual(otherDeck);
          });
      }
});
