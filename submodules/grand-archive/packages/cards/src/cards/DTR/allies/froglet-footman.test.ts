import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { frogletFootman } from "./froglet-footman.ts";
import { chillingTouch } from "../../DOA/actions/chilling-touch.ts";
import { waterBarrier } from "../../DOA/actions/water-barrier.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers fbvt9rdhkj-a1 @covers fbvt9rdhkj-a2 */
describe("Froglet Footman — optional buff and per-instance damage prevention", () => {
  for (const mode of ["accept", "decline", "empty"] as const)
    it(`banishes only an eligible owned graveyard card and handles ${mode} through combat and spell damage`, () => {
      const champion = createClassBonusTestChampion(frogletFootman, false, "activation-discount");
      const opponent = grantTestChampionLevel(
        createClassBonusTestChampion(fireball, true, "activation-discount"),
        1,
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [frogletFootman],
            hand: [
              frogletFootman,
              chillingTouch,
              ...Array.from({ length: 3 }, () => woodlandSquirrels),
            ],
            graveyard: [
              woodlandSquirrels,
              waterBarrier,
              ...(mode === "empty" ? [] : [chillingTouch, chillingTouch]),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            field: [woodlandSquirrels, woodlandSquirrels],
            graveyard: [chillingTouch],
            hand: [fireball, fireball, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(frogletFootman, { zone: "hand" }),
        other = p.card(frogletFootman, { zone: "field" });
      p.activate(source, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(0);
      if (mode !== "empty") {
        answerDecision(game, "resolve-optional-effect", mode === "accept");
        passEffectsStack(game);
        if (mode === "accept") {
          for (const invalid of [
            q.card(chillingTouch),
            p.card(chillingTouch, { zone: "hand" }),
            p.card(woodlandSquirrels, { zone: "graveyard" }),
            p.card(waterBarrier),
          ]) {
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [invalid.objectId]),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          const grave = p.cards(chillingTouch, { zone: "graveyard" })[0]!;
          answerDecision(game, "resolve-effect-choice", [grave.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[grave.objectId]!.zone).toBe("banishment");
          expect(p.cards(chillingTouch, { zone: "graveyard" })).toHaveLength(1);
        } else expect(p.cards(chillingTouch, { zone: "graveyard" })[0]!).toBeDefined();
      } else if (game.state.decision?.kind === "resolve-optional-effect") {
        answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
      }
      expect(game.state.objects[source.objectId]!.counters.buff ?? 0).toBe(
        mode === "accept" ? 1 : 0,
      );
      expect(game.state.objects[other.objectId]!.counters.buff ?? 0).toBe(0);
      expect(game.state.decision).toBeNull();
      p.declareAttack(source, q.card(opponent));
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[q.card(opponent).objectId]!.damage).toBe(mode === "accept" ? 2 : 1);
      advanceToMain(game, q.id);
      const attackers = q.cards(woodlandSquirrels, { zone: "field" });
      q.declareAttack(attackers[0]!, other);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[other.objectId]!.damage).toBe(1);
      q.declareAttack(attackers[1]!, source);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[source.objectId]!.damage).toBe(mode === "accept" ? 0 : 1);
      for (let cast = 0; cast < (mode === "accept" ? 2 : 1); cast++) {
        q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
          targets: { "target-1": [source.objectId] },
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe(
          mode === "accept" ? "field" : "graveyard",
        );
        if (mode === "accept") {
          expect(game.state.objects[source.objectId]!.damage).toBe(cast + 1);
          expect(game.state.objects[source.objectId]!.counters.buff).toBe(1);
        }
      }
    });
});
