import { describe } from "vitest";
import { twinstarTonic } from "./twinstar-tonic.ts";
import { proveArisannaBrew } from "../../../testing/arisanna-brew.ts";
/** @covers yBDxSHkT1s-a1 */
describe("Twinstar Tonic — Arisanna Brew with two of each listed Herb", () =>
  proveArisannaBrew(twinstarTonic, false, 12));

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { astralShard } from "../../DTR/tokens/astral-shard.ts";
import { dwarfStarsGlow } from "../actions/dwarf-stars-glow.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
/** @covers yBDxSHkT1s-a2 */
describe("Twinstar Tonic — permanent optional Starcalling copies", () => {
  for (const copies of [0, 1, 2])
    for (const own of [false, true])
      for (const called of [false, true])
        for (const choice of ["decline", "same-target", "new-target"] as const)
          it(`tonics=${copies}, own activation=${own}, starcalled=${called}, choice=${choice}`, () => {
            const champion = enableAllTestElements(lineageTestChampion("Other", 0));
            const zones = {
              field: [astralShard, astralShard],
              hand: [
                dwarfStarsGlow,
                dwarfStarsGlow,
                ...Array.from({ length: 8 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 5 }, () => dwarfStarsGlow),
            };
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  ...zones,
                  field: [...zones.field, ...Array.from({ length: copies }, () => twinstarTonic)],
                },
              },
              playerTwo: { champion, zones },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              actor = own ? p : q,
              enemy = own ? q : p,
              hero = actor.card(champion),
              target = enemy.card(champion);
            for (const tonic of p.cards(twinstarTonic, { zone: "field" })) {
              p.activateAbility(tonic, "yBDxSHkT1s-a2");
              expect(game.state.objects[tonic.objectId]!.zone).toBe("graveyard");
              passEffectsStack(game);
            }
            if (!own) advanceToMain(game, q.id);
            for (let round = 0; round < 2; round++) {
              const pay = (n: number) =>
                  actor
                    .cards(woodlandSquirrels, { zone: "hand" })
                    .slice(0, n)
                    .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
                beforeMemory = actor.zone("memory").length;
              if (called) {
                actor.activateAbility(
                  actor.cards(astralShard, { zone: "field" })[0]!,
                  "eP07Xxscuq-a1",
                );
                passEffectsStack(game);
                const d = game.state.decision;
                if (d?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
                answerDecision(game, d.kind, {
                  kind: "starcall",
                  cardId: d.cardIds[0]!,
                  bottom: d.cardIds.slice(1),
                  reservePayment: pay(1),
                  targets: { "target-1": [target.objectId] },
                });
              } else
                actor.activate(actor.cards(dwarfStarsGlow, { zone: "hand" })[0]!, {
                  reservePayment: pay(2),
                  targets: { "target-1": [target.objectId] },
                });
              let nextRetarget = false,
                offeredCopies = 0;
              for (let i = 0; i < 96 && (game.state.stack.length || game.state.decision); i++) {
                passEffectsStack(game);
                const d = game.state.decision;
                if (d?.kind === "order-triggered-abilities")
                  answerDecision(game, d.kind, d.pendingTriggerIds);
                else if (d?.kind === "resolve-optional-effect") {
                  if (nextRetarget) {
                    answerDecision(game, d.kind, choice === "new-target");
                    nextRetarget = false;
                  } else {
                    offeredCopies++;
                    answerDecision(game, d.kind, choice !== "decline");
                    nextRetarget = choice !== "decline";
                  }
                } else if (d?.kind === "retarget-stack-item") {
                  const before = game.state;
                  expect(() =>
                    answerDecision(game, d.kind, {
                      targets: {
                        "target-1": [p.cards(twinstarTonic, { zone: "graveyard" })[0]!.objectId],
                      },
                    }),
                  ).toThrow();
                  expect(game.state).toEqual(before);
                  answerDecision(game, d.kind, { targets: { "target-1": [hero.objectId] } });
                } else if (game.state.stack.length === 0) break;
                else throw new Error(`Unexpected ${d?.kind}`);
              }
              expect(game.state.decision).toBeNull();
              expect(game.state.stack).toHaveLength(0);
              expect(offeredCopies).toBe(own && called ? copies : 0);
              const extra = own && called && choice !== "decline" ? copies : 0;
              expect(game.state.objects[target.objectId]!.damage).toBe(
                (round + 1) * (2 + (choice === "same-target" ? 2 * extra : 0)),
              );
              expect(game.state.objects[hero.objectId]!.damage).toBe(
                (round + 1) * (choice === "new-target" ? 2 * extra : 0),
              );
              expect(actor.zone("memory")).toHaveLength(beforeMemory + 2);
              if (round === 0) advanceToMain(game, actor.id, game.state.turn.number);
            }
          });
});
