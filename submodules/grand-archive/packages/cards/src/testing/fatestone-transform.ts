import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveKeyword,
} from "@tcg/grand-archive-types";
import {
  GrandArchiveTestEngine,
  grandArchiveObjectActiveKeywords,
} from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
import { whirlwindThreads } from "../cards/HVN/actions/whirlwind-threads.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";

/** Double-faced Cards 2–4, 9: transform through the printed activation, retaining identity. */
export function proveFatestoneTransform({
  card,
  counters,
  keywords,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  counters: number;
  keywords: readonly GrandArchiveKeyword[];
}): void {
  for (const accept of [false, true]) {
    it(`uses ${counters} earned quest counters to transform only when accepted=${accept}`, () => {
      if (card.layout.kind !== "double-faced") throw new Error("Expected a double-faced Fatestone");
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [card],
            hand: [
              ...Array.from({ length: counters }, () => whirlwindThreads),
              ...Array.from({ length: counters }, () => woodlandSquirrels),
            ],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one");
      const source = p.card(card),
        hero = p.card(champion);
      for (let index = 0; index < counters; index++) {
        p.activate(p.cards(whirlwindThreads, { zone: "hand" })[0]!, {
          reservePayment: [
            { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
          ],
        });
        passEffectsStack(game);
      }
      expect(game.state.objects[hero.objectId]!.counters["named:quest"]).toBe(counters);
      expect(
        grandArchiveObjectActiveKeywords(
          game.program,
          game.state,
          game.state.objects[source.objectId]!,
        ),
      ).toContainEqual({ name: "immortality" });
      p.activateAbility(source, `${card.canonicalId}-a4`);
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", accept);
      passEffectsStack(game);
      expect(p.card(card, { zone: "field" }).objectId).toBe(source.objectId);
      expect(game.state.objects[hero.objectId]!.counters["named:quest"] ?? 0).toBe(
        accept ? 0 : counters,
      );
      const active = grandArchiveObjectActiveKeywords(
        game.program,
        game.state,
        game.state.objects[source.objectId]!,
      );
      if (accept) {
        expect(active).not.toContainEqual({ name: "immortality" });
        for (const keyword of keywords) expect(active).toContainEqual(keyword);
      } else {
        expect(active).toContainEqual({ name: "immortality" });
        for (const keyword of keywords.filter((entry) => entry.name !== "spellshroud"))
          expect(active).not.toContainEqual(keyword);
      }
    });
  }
}

/** Earn counters through activations, then exercise the transform payment boundaries. */
export function proveFatestoneTransformPayment(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  required: number,
): void {
  for (const earned of [0, required - 1, required, required + 1])
    for (const accept of [false, true])
      it(`transform payment requires ${required}, earned=${earned}, accept=${accept}`, () => {
        if (card.layout.kind !== "double-faced") throw new Error("Expected double-faced Fatestone");
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [card],
              hand: [
                ...Array.from({ length: earned }, () => whirlwindThreads),
                ...Array.from({ length: earned }, () => woodlandSquirrels),
              ],
            },
          },
          playerTwo: { champion },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          hero = p.card(champion),
          source = p.card(card);
        for (let i = 0; i < earned; i++) {
          p.activate(p.cards(whirlwindThreads, { zone: "hand" })[0]!, {
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[hero.objectId]!.counters["named:quest"] ?? 0).toBe(earned);
        p.activateAbility(source, `${card.canonicalId}-a4`);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        expect(game.state.objects[source.objectId]!.face).toBe("default");
        const pending = game.state;
        expect(() => p.activateAbility(source, `${card.canonicalId}-a4`)).toThrow();
        expect(game.state).toEqual(pending);
        passEffectsStack(game);
        if (game.state.decision?.kind === "resolve-optional-effect") {
          if (accept && earned < required) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-optional-effect", true)).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "resolve-optional-effect", false);
          } else answerDecision(game, "resolve-optional-effect", accept);
          passEffectsStack(game);
        } else expect(earned).toBeLessThan(required);
        const transformed = accept && earned >= required;
        expect(game.state.objects[source.objectId]!.face).toBe(
          transformed ? "transformed" : "default",
        );
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(!transformed);
        expect(game.state.objects[hero.objectId]!.counters["named:quest"] ?? 0).toBe(
          earned - (transformed ? required : 0),
        );
        expect(game.state.objects[q.card(champion).objectId]!.counters["named:quest"] ?? 0).toBe(0);
        if (transformed) {
          p.declareAttack(source, q.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
            card.layout.flipFace.stats.power,
          );
        }
      });
}
