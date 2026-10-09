import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveClassIntercept(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  abilityId: string,
) {
  for (const matching of [false, true])
    for (const mode of ["accept", "decline", "rested", "other-ally", "source"] as const)
      it(`Intercept checks class, awake status, and champion target: class=${matching}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: { champion, zones: { field: [card, giantTortoise] } },
          playerTwo: {
            champion,
            zones: { field: [giantTortoise], hand: [glacialGuidance, woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(card),
          hero = p.card(champion),
          other = p.card(giantTortoise);
        if (mode === "rested") {
          q.activate(glacialGuidance, {
            reservePayment: [{ kind: "card", cardId: q.card(woodlandSquirrels).objectId }],
            targets: { "target-1": [source.objectId] },
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(mode === "rested");
        const target = mode === "other-ally" ? other : mode === "source" ? source : hero;
        q.declareAttack(giantTortoise, target);
        const triggered = matching && (mode === "accept" || mode === "decline");
        expect(
          game.state.stack.filter(
            (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
          ),
        ).toHaveLength(triggered ? 1 : 0);
        expect(game.state.combat?.targetIds).toEqual([target.objectId]);
        passEffectsStack(game);
        if (triggered) {
          expect(game.state.decision?.kind).toBe("resolve-optional-effect");
          expect(game.state.decision?.playerId).toBe(p.id);
          answerDecision(game, "resolve-optional-effect", mode === "accept");
          passEffectsStack(game);
        } else expect(game.state.decision).toBeNull();
        const finalTarget = triggered && mode === "accept" ? source : target;
        expect(game.state.combat?.targetIds).toEqual([finalTarget.objectId]);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(mode === "rested");
        game.resolveCombatWithoutRetaliation();
        for (const ref of [source, hero, other])
          expect(game.state.objects[ref.objectId]!.damage).toBe(
            ref.objectId === finalTarget.objectId ? 1 : 0,
          );
        expect(game.state.combat).toBeNull();
      });
}
