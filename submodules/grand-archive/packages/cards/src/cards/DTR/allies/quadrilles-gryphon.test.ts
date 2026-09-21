import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { quadrillesGryphon } from "./quadrilles-gryphon.ts";
import { songOfNurturing } from "../../DOA/actions/song-of-nurturing.ts";
import { empoweringHarmony } from "../../DOA/actions/empowering-harmony.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { backdash } from "../actions/backdash.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 84e2rfex54-a1 */
describe("Quadrille's Gryphon — controlled Melody or Harmony activation", () => {
  for (const first of ["melody", "harmony"] as const)
    it(`counts both kinds and repeated activations beginning with ${first}, but excludes opponents and other cards`, () => {
      const champion = createClassBonusTestChampion(
        quadrillesGryphon,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [quadrillesGryphon],
            hand: [
              songOfNurturing,
              songOfNurturing,
              empoweringHarmony,
              backdash,
              ...Array.from({ length: 7 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [quadrillesGryphon],
            hand: [
              songOfNurturing,
              empoweringHarmony,
              ...Array.from({ length: 4 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const own = p.card(quadrillesGryphon),
        opposing = q.card(quadrillesGryphon);
      for (const card of [songOfNurturing, empoweringHarmony]) {
        q.activate(card, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.objects[own.objectId]!.counters.buff ?? 0).toBe(0);
      }
      expect(game.state.objects[opposing.objectId]!.counters.buff).toBe(2);
      advanceToMain(game, p.id);
      p.activate(backdash, {
        targets: { "target-1": [p.card(champion).objectId] },
        reservePayment: [
          { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
        ],
      });
      passEffectsStack(game);
      expect(game.state.objects[own.objectId]!.counters.buff ?? 0).toBe(0);
      const order =
        first === "melody"
          ? [songOfNurturing, empoweringHarmony, songOfNurturing]
          : [empoweringHarmony, songOfNurturing, songOfNurturing];
      for (const [index, card] of order.entries()) {
        p.activate(p.cards(card, { zone: "hand" })[0]!, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        expect(game.state.objects[own.objectId]!.counters.buff ?? 0).toBe(index);
        expect(
          game.state.stack.filter(
            (item) => item.kind === "triggered-ability" && item.ability.id === "84e2rfex54-a1",
          ),
        ).toHaveLength(1);
        passEffectsStack(game);
        expect(game.state.objects[own.objectId]!.counters.buff).toBe(index + 1);
        expect(game.state.objects[opposing.objectId]!.counters.buff).toBe(2);
      }
      p.declareAttack(own, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(4);
      advanceToMain(game, q.id);
      advanceToMain(game, p.id);
      expect(game.state.objects[own.objectId]!.counters.buff).toBe(3);
      p.declareAttack(own, q.card(champion));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(8);
    });
});
