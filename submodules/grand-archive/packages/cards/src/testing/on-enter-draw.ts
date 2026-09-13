import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { reposition } from "../cards/ALC/actions/reposition.ts";

export function proveOnEnterDraw({
  card,
  abilityId,
  cost,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  cost: { kind: "reserve" | "memory"; amount: number };
}): void {
  for (const deckSize of [1, 2]) {
    it(`draws exactly one of ${deckSize} cards only when the separate entry trigger resolves`, () => {
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      const payment = Array.from({ length: cost.amount }, () => woodlandSquirrels);
      const game = GrandArchiveTestEngine.startFixture({
        phase: cost.kind === "memory" ? "materialize" : "main",
        playerOne: {
          champion,
          zones: {
            hand: cost.kind === "reserve" ? [card, ...payment] : [],
            memory: cost.kind === "memory" ? payment : [],
            "material-deck": cost.kind === "memory" ? [card] : [],
            "main-deck": [woodlandSquirrels, reposition].slice(0, deckSize),
          },
        },
        playerTwo: { champion, zones: { "main-deck": [reposition] } },
      });
      const player = game.player("player-one");
      const deck = player.zone("main-deck");
      if (cost.kind === "memory") player.materialize(card);
      else
        player.activate(card, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
      expect(player.zone("hand")).toHaveLength(0);
      expect(player.zone("main-deck")).toEqual(deck);
      player.pass();
      game.player("player-two").pass();
      expect(player.cards(card, { zone: "field" })).toHaveLength(1);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
        ),
      ).toBe(true);
      expect(player.zone("hand")).toHaveLength(0);
      passEffectsStack(game);
      expect(player.zone("hand")).toEqual(deck.slice(0, 1));
      expect(player.zone("main-deck")).toEqual(deck.slice(1));
      expect(game.player("player-two").zone("hand")).toHaveLength(0);
      expect(game.state.stack).toHaveLength(0);
    });
  }
}
