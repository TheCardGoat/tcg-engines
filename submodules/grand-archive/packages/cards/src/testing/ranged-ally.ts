import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { reposition } from "../cards/ALC/actions/reposition.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

/** Ranged N, rules 1–2: measure actual combat damage, not a derived keyword list. */
export function proveRangedAlly({
  card,
  power,
  ranged,
  classBonus,
  declineOptionalAttackEffect = false,
}: {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  readonly power: number;
  readonly ranged: number;
  readonly classBonus: boolean;
  readonly declineOptionalAttackEffect?: boolean;
}): void {
  for (const matchingClass of [true, false]) {
    for (const distant of [true, false]) {
      it(`deals the printed attack damage with distant=${distant}, matchingClass=${matchingClass}`, () => {
        const champion = createClassBonusTestChampion(card, matchingClass, "activation-discount");
        const defender = createClassBonusTestChampion(card, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: { field: [card], hand: distant ? [reposition, woodlandSquirrels] : [] },
          },
          playerTwo: { champion: defender },
        });
        const player = game.player("player-one");
        const ally = player.card(card, { zone: "field" });
        const target = game.player("player-two").card(defender, { zone: "field" });
        if (distant) {
          player.activate(reposition, {
            targets: { "target-1": [ally.objectId] },
            reservePayment: [{ kind: "card", cardId: player.card(woodlandSquirrels).objectId }],
          });
          expect(game.resolveStackUntilChoice()).toBe("stack-empty");
        }
        expect(game.state.objects[ally.objectId]?.states.has("distant")).toBe(distant);
        player.declareAttack(ally, target);
        expect(game.state.objects[target.objectId]?.damage).toBe(0);
        if (declineOptionalAttackEffect) {
          passEffectsStack(game);
          if (game.state.decision?.kind === "resolve-optional-effect") {
            answerDecision(game, "resolve-optional-effect", false);
          }
        }
        game.resolveCombatWithoutRetaliation();
        expect(game.state.objects[target.objectId]?.damage).toBe(
          power + (distant && (!classBonus || matchingClass) ? ranged : 0),
        );
      });
    }
  }
}
