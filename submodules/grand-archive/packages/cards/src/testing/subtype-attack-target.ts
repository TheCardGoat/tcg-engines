import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { firetunedAutomaton } from "../cards/ALC/allies/firetuned-automaton.ts";
import { weissKnight } from "../cards/PTM/allies/weiss-knight.ts";
import { createClassBonusTestChampion, requireSingleFace } from "./class-bonus-test-champion.ts";
import { declareResolvedAttack, passEffectsStack } from "./decisions.ts";

export function proveSubtypeAttackTarget(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  mode: "automaton-unit" | "human-ally",
  cost: number,
  base: number,
  bonus: number,
) {
  for (const matching of [false, true])
    for (const kind of ["ordinary-champion", "matching-champion", "ordinary-ally", "matching-ally"])
      for (const unrelated of [false, true]) {
        it(`class=${matching}, target=${kind}, unrelated matching units=${unrelated}`, () => {
          const champion = createClassBonusTestChampion(card, matching, "activation-discount");
          const face = requireSingleFace(champion);
          const opponent = {
            ...champion,
            canonicalId: `${champion.canonicalId}-opponent`,
            layout: {
              kind: "single-faced" as const,
              face: {
                ...face,
                typeLine: {
                  ...face.typeLine,
                  subtypes:
                    kind === "matching-champion"
                      ? [mode === "automaton-unit" ? ("AUTOMATON" as const) : ("HUMAN" as const)]
                      : ["SPIRIT" as const],
                },
              },
            },
          };
          const qualifying = mode === "automaton-unit" ? firetunedAutomaton : weissKnight;
          const ally = kind === "matching-ally" ? qualifying : giantTortoise;
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: unrelated ? [qualifying] : [],
                hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              },
            },
            playerTwo: {
              champion: opponent,
              zones: { field: [ally, ...(unrelated ? [qualifying] : [])] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            hero = p.card(champion),
            attack = p.card(card);
          const target = kind.endsWith("champion")
            ? q.card(opponent)
            : q.cards(ally, { zone: "field" })[0]!;
          const power = () =>
            deriveGrandArchiveNumericProperty(game.state.objects[attack.objectId]!, "power", {
              program: game.program,
              state: game.state,
              controllerId: p.id,
              bindings: {},
            });
          expect(power()).toBe(base);
          p.activate(attack, {
            attackAttackerId: hero.objectId,
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          expect(power()).toBe(base);
          declareResolvedAttack(
            game,
            hero.objectId,
            target.objectId,
            "Attack the selected subtype target",
          );
          const enabled =
            kind === "matching-ally" || (mode === "automaton-unit" && kind === "matching-champion");
          const expected = base + (enabled ? bonus : 0);
          expect(power()).toBe(expected);
          const start = game.state.eventHistory.length;
          game.resolveCombatWithoutRetaliation();
          expect(
            game.state.eventHistory
              .slice(start)
              .filter((e) => e.type === "damage-marked" && e.objectId === target.objectId)
              .map((e) => (e.type === "damage-marked" ? e.amount : 0)),
          ).toEqual([expected]);
          expect(game.state.combat).toBeNull();
          expect(game.state.objects[attack.objectId]!.zone).toBe("graveyard");
          expect(power()).toBe(base);
        });
      }
}
