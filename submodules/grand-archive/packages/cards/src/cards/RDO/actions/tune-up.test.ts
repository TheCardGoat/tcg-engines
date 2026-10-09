import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { tuneUp } from "./tune-up.ts";
import { automatonBomber } from "../../ALC/allies/automaton-bomber.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../../DOA/actions/spark-alight.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers chyfhweEro-a1 */
describe("Tune Up — Automaton recovery", () => {
  for (const mode of ["absent", "own", "opponent", "graveyard", "removed"])
    for (const damage of [0, 2, 6])
      it(`recovers two or four, bounded at zero: mode=${mode}, damage=${damage}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Tune Up", 0));
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [
                giantTortoise,
                ...(["own", "removed"].includes(mode) ? [automatonBomber] : []),
              ],
              graveyard: mode === "graveyard" ? [automatonBomber] : [],
              hand: [
                tuneUp,
                ...Array.from({ length: damage / 2 + 1 }, () => sparkAlight),
                ...Array.from({ length: damage + 4 }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: mode === "opponent" ? [automatonBomber] : [],
              hand: [sparkAlight, woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const hero = p.card(champion),
          foe = q.card(champion);
        const pay = () =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
        const sparks = p.cards(sparkAlight, { zone: "hand" });
        for (const [index, source] of sparks.entries()) {
          p.activate(source, {
            reservePayment: pay(),
            targets: { "target-1": [index === 0 ? foe.objectId : hero.objectId] },
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        p.activate(tuneUp, { reservePayment: pay() });
        expect(game.state.objects[hero.objectId]!.damage).toBe(damage);
        if (mode === "removed") {
          p.pass();
          q.activate(sparkAlight, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            targets: { "target-1": [p.card(automatonBomber, { zone: "field" }).objectId] },
          });
        }
        passEffectsStack(game);
        expect(game.state.objects[hero.objectId]!.damage).toBe(
          Math.max(0, damage - (mode === "own" ? 4 : 2)),
        );
        expect(game.state.objects[foe.objectId]!.damage).toBe(2);
        expect(p.cards(tuneUp, { zone: "graveyard" })).toHaveLength(1);
      });
});
