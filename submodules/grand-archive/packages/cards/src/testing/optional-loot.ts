import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { markTheTarget } from "../cards/DOA/actions/mark-the-target.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack, answerDecision, advanceCombatToTrigger } from "./decisions.ts";
export function proveOptionalLoot({
  card,
  abilityId,
  onAttack,
  cost = 0,
  fireOnly = false,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  onAttack: boolean;
  cost?: number;
  fireOnly?: boolean;
}): void {
  for (const mode of [
    "accept",
    "decline",
    "empty",
    ...(fireOnly ? ["ineligible" as const] : []),
  ] as const)
    it(`${mode} optional discard before drawing`, () => {
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      const eligible = fireOnly ? markTheTarget : woodlandSquirrels;
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: onAttack ? [card] : [],
            hand: [
              ...(onAttack ? [] : [card]),
              ...Array.from({ length: cost }, () => woodlandSquirrels),
              ...(mode === "empty"
                ? []
                : mode === "ineligible"
                  ? [woodlandSquirrels]
                  : [eligible, eligible]),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion, zones: { hand: [eligible] } },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      if (onAttack) {
        p.declareAttack(card, q.card(champion));
        advanceCombatToTrigger(game, abilityId);
      } else {
        p.activate(card, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
      }
      passEffectsStack(game);
      const beforeDeck = p.zone("main-deck").length;
      if (mode === "empty" || mode === "ineligible") {
        if (game.state.decision?.kind === "resolve-optional-effect")
          answerDecision(game, "resolve-optional-effect", true);
        passEffectsStack(game);
        expect(p.zone("hand")).toHaveLength(mode === "empty" ? 0 : 1);
        expect(p.zone("main-deck")).toHaveLength(beforeDeck);
      } else {
        expect(game.state.decision?.kind).toBe("resolve-optional-effect");
        answerDecision(game, "resolve-optional-effect", mode === "accept");
        passEffectsStack(game);
        if (mode === "accept") {
          expect(game.state.decision?.kind).toBe("resolve-effect-choice");
          const selected = p.cards(eligible, { zone: "hand" })[0]!;
          const before = game.state;
          expect(() =>
            answerDecision(game, "resolve-effect-choice", [q.card(eligible).objectId]),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[selected.objectId]!.zone).toBe("graveyard");
          expect(p.zone("main-deck")).toHaveLength(beforeDeck - 1);
          expect(p.zone("hand")).toHaveLength(2);
        } else {
          expect(p.zone("main-deck")).toHaveLength(beforeDeck);
          expect(p.cards(eligible, { zone: "hand" })).toHaveLength(2);
        }
      }
      expect(q.zone("hand")).toHaveLength(1);
      if (onAttack) game.resolveCombatWithoutRetaliation();
    });
}
