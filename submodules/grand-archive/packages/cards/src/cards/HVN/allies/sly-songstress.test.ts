import { describe } from "vitest";
import { slySongstress } from "./sly-songstress.ts";
import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
/** @covers f28y5rn0dt-a1 */
describe("slySongstress — Class Bonus Stealth", () => {
  proveClassBonusStealth(slySongstress);
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { attuneWithTheWinds } from "../../DOA/actions/attune-with-the-winds.ts";
import { songOfNurturing } from "../../DOA/actions/song-of-nurturing.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";

/** @covers f28y5rn0dt-a2 */
describe("Sly Songstress — Harmony or Melody activation loot", () => {
  for (const matching of [false, true])
    for (const entry of [
      { kind: "harmony", card: attuneWithTheWinds, cost: 3 },
      { kind: "melody", card: songOfNurturing, cost: 2 },
      { kind: "melody-ally", card: slySongstress, cost: 2 },
      { kind: "other", card: woodlandSquirrels, cost: 0 },
    ])
      for (const own of [false, true])
        for (const mode of ["accept", "decline", "empty"] as const)
          it(`class=${matching}, activation=${entry.kind}, own=${own}, mode=${mode}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(slySongstress, matching, "activation-discount"),
            );
            const activationHand = [
              entry.card,
              ...Array.from({ length: entry.cost }, () => woodlandSquirrels),
            ];
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: own ? "playerOne" : "playerTwo",
              playerOne: {
                champion,
                zones: {
                  field: [slySongstress],
                  hand: [
                    ...(own ? activationHand : []),
                    ...(mode === "empty" ? [] : [fireball, favorableWinds]),
                  ],
                  "main-deck": [fireball, favorableWinds, woodlandSquirrels],
                },
              },
              playerTwo: {
                champion,
                zones: {
                  hand: [...(!own ? activationHand : []), fireball],
                  "main-deck": [woodlandSquirrels, woodlandSquirrels],
                },
              },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              actor = own ? p : q;
            const singer = p.card(slySongstress, { zone: "field" }),
              source = actor.cards(entry.card, { zone: "hand" })[0]!;
            const deck = p.zone("main-deck"),
              enemyDeck = q.zone("main-deck");
            actor.activate(source, {
              reservePayment: actor
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, entry.cost)
                .map((c) => ({ kind: "card", cardId: c.objectId })),
            });
            const held = p.zone("hand"),
              eligible = own && entry.kind !== "other" && mode !== "empty";
            expect(p.zone("main-deck")).toEqual(deck);
            passEffectsStack(game);
            if (eligible) {
              expect(game.state.decision).toMatchObject({
                kind: "resolve-optional-effect",
                playerId: p.id,
              });
              expect(game.state.objects[source.objectId]?.zone).toBe("effects-stack");
              expect(game.state.objects[singer.objectId]?.counters.buff ?? 0).toBe(0);
              answerDecision(game, "resolve-optional-effect", mode === "accept");
              passEffectsStack(game);
              if (mode === "accept") {
                expect(game.state.decision).toMatchObject({
                  kind: "resolve-effect-choice",
                  playerId: p.id,
                });
                const discarded = p.card(fireball, { zone: "hand" });
                for (const ids of [
                  [],
                  [q.card(fireball, { zone: "hand" }).objectId],
                  [singer.objectId],
                  [source.objectId],
                  [discarded.objectId, discarded.objectId],
                  held.map((c) => c.objectId),
                ]) {
                  const before = game.state;
                  expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                  expect(game.state).toEqual(before);
                }
                expect(p.zone("main-deck")).toEqual(deck);
                answerDecision(game, "resolve-effect-choice", [discarded.objectId]);
                passEffectsStack(game);
                expect(game.state.objects[discarded.objectId]?.zone).toBe("graveyard");
                expect(p.zone("hand")).toEqual([
                  ...held.filter((c) => c.objectId !== discarded.objectId),
                  deck[0]!,
                ]);
              }
            }
            const draws = eligible && mode === "accept";
            expect(p.zone("main-deck")).toEqual(draws ? deck.slice(1) : deck);
            if (!draws) expect(p.zone("hand")).toEqual(held);
            expect(q.zone("main-deck")).toEqual(enemyDeck);
            expect(game.state.decision).toBeNull();
            expect(game.state.stack).toHaveLength(0);
          });
});
