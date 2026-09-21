import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { shackledTheurgist } from "./shackled-theurgist.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers vkqzk1jik7-a2 @covers vkqzk1jik7-a3 */
describe("Shackled Theurgist — opponent's sacrifice choice and ephemeral revival", () => {
  for (const choice of ["sacrifice", "decline", "empty"] as const)
    it(`resolves the death trigger when the opponent chooses ${choice}`, () => {
      const champion = createClassBonusTestChampion(
        shackledTheurgist,
        false,
        "activation-discount",
      );
      const opponent = grantTestChampionLevel(
        createClassBonusTestChampion(fireball, false, "activation-discount"),
        1,
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [shackledTheurgist],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: opponent,
          zones: {
            field: choice === "empty" ? [] : [woodlandSquirrels],
            hand: [
              fireball,
              fireball,
              fireball,
              ...Array.from({ length: 12 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const source = p.card(shackledTheurgist),
        foe = q.card(opponent);
      const initial = game.state;
      expect(() => p.declareAttack(source, foe)).toThrow();
      expect(game.state).toEqual(initial);
      expect(game.state.objects[foe.objectId]!.damage).toBe(0);
      const shoot = () => {
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
        q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
          targets: { "target-1": [source.objectId] },
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 4)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
      };
      shoot();
      expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
      const before = game.state;
      expect(() =>
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-opponent": [p.id] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-opponent": [q.id] },
      });
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-optional-effect") {
        expect(game.state.decision.playerId).toBe(q.id);
        answerDecision(game, "resolve-optional-effect", choice === "sacrifice");
        passEffectsStack(game);
      }
      if (choice === "sacrifice") {
        if (game.state.decision?.kind === "resolve-effect-choice") {
          expect(game.state.decision.playerId).toBe(q.id);
          answerDecision(game, "resolve-effect-choice", [
            q.card(woodlandSquirrels, { zone: "field" }).objectId,
          ]);
          passEffectsStack(game);
        }
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(q.cards(woodlandSquirrels, { zone: "graveyard" })).toHaveLength(1);
        return;
      }
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(true);
      expect(game.state.objects[source.objectId]!.damage).toBe(0);
      p.declareAttack(source, foe);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[foe.objectId]!.damage).toBe(4);
      shoot();
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.objects[source.objectId]!.damage).toBe(2);
      // Damage and the temporary life bonus both expire at end of turn. The revived
      // ally must survive that cleanup, then die to two damage on the next turn.
      advanceToMain(game, q.id);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
      expect(game.state.objects[source.objectId]!.damage).toBe(0);
      shoot();
      expect(game.state.objects[source.objectId]!.zone).toBe("banishment");
      expect(p.cards(shackledTheurgist, { zone: "field" })).toHaveLength(0);
    });
});
