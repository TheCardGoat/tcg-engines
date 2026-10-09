import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { describe, expect, it } from "vitest";
import { embershieldKeeper } from "./embershield-keeper.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { tempestDownfall } from "../actions/tempest-downfall.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers xhi5jnsl7d-a1 */
/** @covers xhi5jnsl7d-a2 */
describe("Embershield Keeper — Foster and class life bonus", () => {
  for (const matching of [false, true])
    for (const damaged of ["none", "source", "other"]) {
      it(`class=${matching}, recent damage=${damaged}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(embershieldKeeper, matching, "activation-discount"),
        );
        const deck = Array.from({ length: 8 }, () => woodlandSquirrels);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: { field: [embershieldKeeper, giantTortoise], "main-deck": deck },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels],
              hand: [tempestDownfall, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              "main-deck": deck,
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(embershieldKeeper);
        const fostered = () => game.state.objects[source.objectId]!.states.has("fostered");
        const life = () =>
          deriveGrandArchiveNumericProperty(game.state.objects[source.objectId]!, "life", {
            program: game.program,
            state: game.state,
            controllerId: p.id,
            bindings: {},
          });
        expect(life()).toBe(2);
        if (damaged !== "none") {
          q.declareAttack(
            q.card(woodlandSquirrels, { zone: "field" }),
            damaged === "source" ? source : p.card(giantTortoise),
          );
          game.resolveCombatWithoutRetaliation();
        }
        advanceToRecollection(game, p.id);
        expect(fostered()).toBe(false);
        expect(life()).toBe(2);
        expect(
          game.state.stack.filter(
            (item) => item.kind === "triggered-ability" && item.ability.id === "xhi5jnsl7d-a1",
          ),
        ).toHaveLength(damaged === "source" ? 0 : 1);
        if (damaged === "source") {
          advanceToRecollection(game, q.id);
          advanceToRecollection(game, p.id);
        }
        passEffectsStack(game);
        expect(fostered()).toBe(true);
        expect(life()).toBe(matching ? 4 : 2);
        advanceToMain(game, q.id);
        q.activate(tempestDownfall, {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 3)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [source.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.zone).toBe(matching ? "field" : "graveyard");
        if (matching) {
          expect(game.state.objects[source.objectId]!.damage).toBe(3);
          expect(fostered()).toBe(true);
          expect(life()).toBe(4);
        }
      });
    }
});
