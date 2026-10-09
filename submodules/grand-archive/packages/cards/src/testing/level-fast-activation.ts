import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { classBonusLeveledChampion } from "./class-bonus-level.ts";
import { enableAllTestElements, grantTestChampionLevel } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
export function proveLevelFastActivation(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  for (const matching of [false, true])
    for (const level of [1, 2, 3])
      for (const continuous of [false, true])
        for (const window of ["main", "response", "opponent", "combat"] as const)
          it(`class=${matching}, level=${level}, continuous=${continuous}, window=${window}`, () => {
            const family = classBonusLeveledChampion(card, matching, level),
              champion = enableAllTestElements(
                continuous ? grantTestChampionLevel(family.starter, level) : family.starter,
              ),
              lineage = continuous ? [] : family.lineage.map(enableAllTestElements);
            const game = GrandArchiveTestEngine.startFixture({
              firstPlayer: window === "opponent" || window === "combat" ? "playerTwo" : "playerOne",
              playerOne: {
                champion,
                lineage,
                zones: { hand: [card, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
              },
              playerTwo: { champion, zones: { field: [giantTortoise] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              source = p.card(card),
              hero = p.card(champion);
            if (window === "response") p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
            if (window === "combat") q.declareAttack(q.card(giantTortoise), hero);
            if (window === "opponent" || window === "combat") q.pass();
            const eligible = level >= 2 || window === "main",
              options = {
                reservePayment: p
                  .cards(woodlandSquirrels, { zone: "hand" })
                  .slice(0, 2)
                  .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
              };
            expect(
              p
                .legalCommands()
                .some(
                  (c) => c.command.move === "activate-card" && c.command.cardId === source.objectId,
                ),
            ).toBe(eligible);
            if (!eligible) {
              const before = game.state;
              expect(() => p.activate(source, options)).toThrow(/slow|speed|timing/i);
              expect(game.state).toEqual(before);
              return;
            }
            p.activate(source, options);
            expect(game.state.stack.at(-1)?.sourceId).toBe(source.objectId);
            expect(p.zone("memory")).toHaveLength(2);
            passEffectsStack(game);
            expect(game.state.objects[source.objectId]!.zone).toBe("field");
            expect(game.state.stack).toHaveLength(0);
            if (window === "response")
              expect(p.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
            if (window === "combat") expect(game.state.combat).not.toBeNull();
          });
}
