import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;

export function proveBrewEntry({
  card,
  ingredients,
  reserveCost,
  draw = 0,
  discard = 0,
  championDamage = 0,
  age = 0,
}: {
  card: Card;
  ingredients: readonly Card[];
  reserveCost: number;
  draw?: number;
  discard?: number;
  championDamage?: number;
  age?: number;
}): void {
  for (const brewed of [false, true])
    it(`applies its brewed entry effect only when brewed=${brewed}`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(card, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: ingredients,
            hand: [
              card,
              ...Array.from({ length: brewed ? 0 : reserveCost }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card);
      const herbs = p
        .zone("field")
        .filter((ref) => game.state.objects[ref.objectId]!.isToken)
        .map((ref) => ref.objectId);
      p.activate(
        source,
        brewed
          ? { activationMethod: "brew", brewIngredientIds: herbs }
          : {
              reservePayment: p
                .cards(woodlandSquirrels, { zone: "hand" })
                .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            },
      );
      passEffectsStack(game);
      if (brewed && discard) {
        expect(p.zone("hand")).toHaveLength(draw);
        answerDecision(
          game,
          "resolve-effect-choice",
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, discard)
            .map((ref) => ref.objectId),
        );
        passEffectsStack(game);
      }
      expect(game.state.decision).toBeNull();
      expect(game.state.stack).toHaveLength(0);
      expect(p.zone("hand")).toHaveLength(brewed ? draw - discard : 0);
      expect(p.zone("main-deck")).toHaveLength(4 - (brewed ? draw : 0));
      expect(p.zone("graveyard")).toHaveLength(brewed ? discard : 0);
      expect(game.state.objects[p.card(champion).objectId]!.damage).toBe(
        brewed ? championDamage : 0,
      );
      expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(
        brewed ? championDamage : 0,
      );
      expect(game.state.objects[source.objectId]!.counters["named:age"] ?? 0).toBe(
        brewed ? age : 0,
      );
    });
}
