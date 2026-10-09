import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import { stockedOutpost } from "../cards/RDO/domains/stocked-outpost.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveClassTaunt(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  for (const matching of [false, true])
    for (const rested of [false, true])
      for (const defender of ["champion", "ally", "domain", "taunt"] as const) {
        it(`checks attack priority: matching=${matching}, rested=${rested}, defender=${defender}`, () => {
          const own = grantTestChampionLevel(
            createClassBonusTestChampion(card, matching, "activation-discount"),
            5,
          );
          const foe = enableAllTestElements(
            createClassBonusTestChampion(card, !matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: { champion: own, zones: { field: [card, giantTortoise, stockedOutpost] } },
            playerTwo: {
              champion: foe,
              zones: { field: [giantTortoise], hand: [glacialGuidance, woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card),
            attacker = q.card(giantTortoise);
          if (rested) {
            q.activate(glacialGuidance, {
              reservePayment: [{ kind: "card", cardId: q.card(woodlandSquirrels).objectId }],
              targets: { "target-1": [source.objectId] },
            });
            passEffectsStack(game);
          }
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(rested);
          const target = p.card(
            defender === "champion"
              ? own
              : defender === "ally"
                ? giantTortoise
                : defender === "domain"
                  ? stockedOutpost
                  : card,
          );
          const allowed = defender === "taunt" || !matching || rested;
          const discovered = q
            .legalCommands()
            .some(
              (c) =>
                c.command.move === "declare-attack" &&
                c.command.attackerId === attacker.objectId &&
                c.command.targetIds.includes(target.objectId),
            );
          expect(discovered).toBe(allowed);
          if (!allowed) {
            const before = game.state;
            expect(() => q.declareAttack(attacker, target)).toThrow();
            expect(game.state).toEqual(before);
            return;
          }
          q.declareAttack(attacker, target);
          game.resolveCombatWithoutRetaliation();
          if (defender === "domain")
            expect(game.state.objects[target.objectId]!.counters.durability).toBe(3);
          else expect(game.state.objects[target.objectId]!.damage).toBe(1);
        });
      }
}
