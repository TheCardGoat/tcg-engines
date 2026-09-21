import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { castlingBoon } from "./castling-boon.ts";
import { goldenRook } from "../../PTM/allies/golden-rook.ts";
import { evercurrentRaider } from "../allies/evercurrent-raider.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers v0yuddp71s-a1 */
describe("Castling Boon — current controlled allies and conditional replacement bonus", () => {
  for (const rook of ["absent", "owned", "opposing", "graveyard"] as const)
    it(`uses ${rook} Rook, locks the allied set and expires without killing a damaged survivor`, () => {
      const champion = grantTestChampionLevel(
        enableAllTestElements(
          createClassBonusTestChampion(castlingBoon, false, "activation-discount"),
        ),
        2,
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [woodlandSquirrels, giantTortoise, ...(rook === "owned" ? [goldenRook] : [])],
            graveyard: rook === "graveyard" ? [goldenRook] : [],
            hand: [
              castlingBoon,
              evercurrentRaider,
              ...Array.from({ length: 4 }, () => fireball),
              ...Array.from({ length: 20 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [woodlandSquirrels, giantTortoise, ...(rook === "opposing" ? [goldenRook] : [])],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const squirrel = p.card(woodlandSquirrels, { zone: "field" }),
        tortoise = p.card(giantTortoise),
        later = p.card(evercurrentRaider);
      const life = (id: typeof squirrel.objectId) =>
        deriveGrandArchiveNumericProperty(game.state.objects[id]!, "life", {
          program: game.program,
          state: game.state,
          controllerId: p.id,
          bindings: {},
        });
      const payment = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() => p.activate(castlingBoon, { reservePayment: payment(1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(castlingBoon, { reservePayment: payment(2) });
      expect(life(squirrel.objectId)).toBe(1);
      passEffectsStack(game);
      const bonus = rook === "owned" ? 3 : 1;
      expect(life(squirrel.objectId)).toBe(1 + bonus);
      expect(life(tortoise.objectId)).toBe(6 + bonus);
      expect(life(q.card(woodlandSquirrels, { zone: "field" }).objectId)).toBe(1);
      expect(life(p.card(champion).objectId)).toBe(15);
      if (rook === "owned") expect(life(p.card(goldenRook).objectId)).toBe(7);
      p.activate(later, { reservePayment: payment(2) });
      passEffectsStack(game);
      expect(life(later.objectId)).toBe(2);
      const burn = (id: typeof squirrel.objectId) => {
        p.activate(p.cards(fireball, { zone: "hand" })[0]!, {
          targets: { "target-1": [id] },
          reservePayment: payment(4),
        });
        passEffectsStack(game);
      };
      burn(squirrel.objectId);
      expect(game.state.objects[squirrel.objectId]!.zone).toBe(
        rook === "owned" ? "field" : "graveyard",
      );
      burn(later.objectId);
      expect(game.state.objects[later.objectId]!.zone).toBe("graveyard");
      const opponent = q.card(woodlandSquirrels, { zone: "field" });
      burn(opponent.objectId);
      expect(game.state.objects[opponent.objectId]!.zone).toBe("graveyard");
      advanceToMain(game, q.id);
      expect(life(tortoise.objectId)).toBe(6);
      if (rook === "owned") {
        expect(game.state.objects[squirrel.objectId]!.zone).toBe("field");
        expect(game.state.objects[squirrel.objectId]!.damage).toBe(0);
        expect(life(squirrel.objectId)).toBe(1);
      }
      q.pass();
      burn(tortoise.objectId);
      expect(game.state.objects[tortoise.objectId]!.damage).toBe(3);
    });
});
