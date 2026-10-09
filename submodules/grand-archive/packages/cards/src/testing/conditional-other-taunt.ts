import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import {
  GrandArchiveTestEngine,
  grandArchiveObjectActiveKeywords,
} from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { blueSlime } from "../cards/DOA/allies/blue-slime.ts";
import { goldenKnight } from "../cards/PTM/allies/golden-knight.ts";
import { droppedBand } from "../cards/PTM/items/dropped-band.ts";
import { aliceTriflesRoyalty } from "../cards/RDO/champions/alice-trifles-royalty.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import { reclaim } from "../cards/DOA/actions/reclaim.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveConditionalOtherTaunt(card: Card, chessman: boolean) {
  const helper = chessman ? goldenKnight : blueSlime;
  const scenarios = [
    "none",
    "own",
    "copy",
    "opponent",
    "hand",
    "graveyard",
    "banishment",
    ...(chessman ? ["item", "champion"] : []),
  ];
  for (const scenario of scenarios)
    for (const rested of [false, true])
      for (const targetKind of ["champion", "ally", "source"]) {
        it(`helper=${scenario}, rested=${rested}, attack target=${targetKind}`, () => {
          const champion = enableAllTestElements(lineageTestChampion("Alice", 0)),
            enemy = enableAllTestElements(
              createClassBonusTestChampion(card, false, "activation-discount"),
            );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: "playerTwo",
            playerOne: {
              champion,
              ...(scenario === "champion"
                ? {
                    lineage: [
                      lineageTestChampion("Alice", 1),
                      lineageTestChampion("Alice", 2),
                      aliceTriflesRoyalty,
                    ],
                  }
                : {}),
              zones: {
                field: [
                  card,
                  giantTortoise,
                  ...(scenario === "own"
                    ? [helper]
                    : scenario === "copy"
                      ? [card]
                      : scenario === "item"
                        ? [droppedBand]
                        : []),
                ],
                hand: scenario === "hand" ? [helper] : [],
                graveyard: scenario === "graveyard" ? [helper] : [],
                banishment: scenario === "banishment" ? [helper] : [],
                "main-deck": [woodlandSquirrels],
              },
            },
            playerTwo: {
              champion: enemy,
              zones: {
                field: [giantTortoise, ...(scenario === "opponent" ? [helper] : [])],
                hand: [glacialGuidance, woodlandSquirrels],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.cards(card, { zone: "field" })[0]!,
            attacker = q.card(giantTortoise),
            target =
              targetKind === "source"
                ? source
                : p.card(targetKind === "champion" ? champion : giantTortoise);
          const hasTaunt = ["own", "copy", "champion"].includes(scenario);
          expect(
            grandArchiveObjectActiveKeywords(
              game.program,
              game.state,
              game.state.objects[source.objectId]!,
            ).some((k) => k.name === "taunt"),
          ).toBe(hasTaunt);
          if (rested) {
            q.activate(glacialGuidance, {
              reservePayment: [
                { kind: "card", cardId: q.card(woodlandSquirrels, { zone: "hand" }).objectId },
              ],
              targets: { "target-1": [source.objectId] },
            });
            passEffectsStack(game);
          }
          const allowed =
            (targetKind === "source" && !(rested && scenario === "copy")) ||
            !hasTaunt ||
            (rested && scenario !== "copy");
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
          expect(game.state.combat).not.toBeNull();
        });
      }
  for (const count of [1, 2]) {
    it(`Taunt starts on entry and ends only after ${count} helpers leave`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [card, ...(count === 2 ? [helper] : [])],
            hand: [helper, reclaim, reclaim, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [giantTortoise],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card),
        foe = q.card(giantTortoise),
        hero = p.card(champion);
      const canAttackHero = () =>
        q
          .legalCommands()
          .some(
            (c) =>
              c.command.move === "declare-attack" &&
              c.command.attackerId === foe.objectId &&
              c.command.targetIds.includes(hero.objectId),
          );
      expect(canAttackHero()).toBe(count === 1);
      // Entry happens on the helper controller's own turn; the next opponent turn observes it.
      const nextTurn = game.state.turn.number;
      advanceToMain(game, p.id, nextTurn);
      p.activate(p.card(helper, { zone: "hand" }), {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      advanceToMain(game, q.id, game.state.turn.number);
      expect(canAttackHero()).toBe(false);
      for (const [index, ally] of p.cards(helper, { zone: "field" }).entries()) {
        q.pass();
        p.activate(p.cards(reclaim, { zone: "hand" })[0]!, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 2)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          targets: { "target-1": [ally.objectId] },
        });
        passEffectsStack(game);
        if (chessman && game.state.decision) throw new Error("Unexpected lineage trigger");
        expect(canAttackHero()).toBe(index === count - 1);
      }
      q.declareAttack(foe, hero);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[hero.objectId]!.damage).toBe(1);
      expect(game.state.objects[source.objectId]!.zone).toBe("field");
    });
  }
}
import { advanceToMain } from "./decisions.ts";
