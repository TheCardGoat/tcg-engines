import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { advanceToRecollection } from "./aging-potion.ts";

export function proveClassFoster(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  for (const matching of [false, true])
    for (const damage of ["none", "source", "other"] as const)
      it(`Foster uses class and this unit's recent damage: class=${matching}, damage=${damage}`, () => {
        const champion = createClassBonusTestChampion(card, matching, "activation-discount");
        const deck = Array.from({ length: 12 }, () => woodlandSquirrels);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: { champion, zones: { field: [card, giantTortoise], "main-deck": deck } },
          playerTwo: { champion, zones: { field: [woodlandSquirrels], "main-deck": deck } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(card);
        const fostered = () => game.state.objects[source.objectId]!.states.has("fostered");
        const fosterTriggers = () =>
          game.state.stack.filter(
            (item) =>
              item.kind === "triggered-ability" && item.ability.id === `${card.canonicalId}-a1`,
          );
        if (damage !== "none") {
          const target = damage === "source" ? source : p.card(giantTortoise);
          q.declareAttack(woodlandSquirrels, target);
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[target.objectId]!.damage).toBe(1);
        }
        expect(fostered()).toBe(false);
        advanceToRecollection(game, p.id);
        expect(fostered()).toBe(false);
        // Cleanup removes damage marks, but the damage event must still prevent Foster.
        expect(game.state.objects[source.objectId]!.damage).toBe(0);
        expect(fosterTriggers()).toHaveLength(matching && damage !== "source" ? 1 : 0);
        if (!matching || damage === "source") {
          advanceToRecollection(game, q.id);
          expect(fostered()).toBe(false);
          expect(fosterTriggers()).toHaveLength(0);
          advanceToRecollection(game, p.id);
          expect(fostered()).toBe(false);
          expect(fosterTriggers()).toHaveLength(matching ? 1 : 0);
        }
        if (matching) {
          // Resolve Foster itself; leave the card's separate On Foster reward on the stack.
          for (let step = 0; !fostered() && step < 16; step++) {
            const wait = game.waitState();
            if (wait.kind !== "opportunity")
              throw new Error(`Unexpected Foster wait: ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
          expect(fostered()).toBe(true);
          expect(fosterTriggers()).toHaveLength(0);
        } else expect(fostered()).toBe(false);
      });
}
