import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { tomeOfIgnorance } from "./tome-of-ignorance.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers dz4qd82liq-a1 @covers dz4qd82liq-a2 */
describe("Tome of Ignorance — class-gated opponent level reduction", () => {
  for (const matching of [false, true])
    it(`modifies only the opponent's level until banished: class=${matching}`, () => {
      const champion = grantTestChampionLevel(
        enableAllTestElements(
          createClassBonusTestChampion(tomeOfIgnorance, matching, "activation-discount"),
        ),
        2,
      );
      const opponent = grantTestChampionLevel(
        createClassBonusTestChampion(fireball, false, "activation-discount"),
        2,
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [tomeOfIgnorance],
            hand: [fireball, ...Array.from({ length: matching ? 2 : 4 }, () => woodlandSquirrels)],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            hand: [fireball, fireball, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        hero = p.card(champion),
        foe = q.card(opponent),
        tome = p.card(tomeOfIgnorance);
      p.activate(fireball, {
        targets: { "target-1": [foe.objectId] },
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.objects[foe.objectId]!.damage).toBe(3);
      const shoot = () => {
        p.pass();
        q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
          targets: { "target-1": [hero.objectId] },
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 4)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
      };
      shoot();
      expect(game.state.objects[hero.objectId]!.damage).toBe(matching ? 2 : 3);
      const deck = p.zone("main-deck");
      p.activateAbility(tome, "dz4qd82liq-a2");
      expect(game.state.objects[tome.objectId]!.zone).toBe("banishment");
      expect(p.zone("hand")).toHaveLength(0);
      passEffectsStack(game);
      expect(p.zone("hand")).toEqual(deck.slice(0, 1));
      expect(p.zone("main-deck")).toEqual(deck.slice(1));
      expect(() => p.activateAbility(tome, "dz4qd82liq-a2")).toThrow();
      shoot();
      expect(game.state.objects[hero.objectId]!.damage).toBe(matching ? 5 : 6);
    });
});
