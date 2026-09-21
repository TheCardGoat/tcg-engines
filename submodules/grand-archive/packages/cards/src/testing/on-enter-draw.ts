import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "./class-bonus-test-champion.ts";
import { grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { reposition } from "../cards/ALC/actions/reposition.ts";

/**
 * Shared acceptance contract for one printed "On Enter: Draw N card(s) [into
 * your memory]" trigger: the draw happens only when the separate entry trigger
 * resolves, draws exactly the printed amount, and only for the controller.
 */
export function proveOnEnterDraw({
  card,
  abilityId,
  cost,
  amount = 1,
  destination = "hand",
  asEntersChoice,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  abilityId: string;
  cost: { kind: "reserve" | "memory"; amount: number };
  amount?: number;
  destination?: "hand" | "memory";
  /** Printed "As this enters the field, choose…" answer required before the entry commit. */
  asEntersChoice?: string;
}): void {
  for (const extraDeck of [0, 1]) {
    it(`draws exactly ${amount} card${amount === 1 ? "" : "s"} into ${destination} from a ${amount + extraDeck} card deck only when the separate entry trigger resolves`, () => {
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      // Exalted cannot enable itself (Special Elements / Exalted 1).
      const fixtureChampion = grandArchiveTestFace(card).elements.includes("EXALTED")
        ? enableAllTestElements(champion)
        : champion;
      const payment = Array.from({ length: cost.amount }, () => woodlandSquirrels);
      const deckSize = amount + extraDeck;
      const game = GrandArchiveTestEngine.startFixture({
        phase: cost.kind === "memory" ? "materialize" : "main",
        playerOne: {
          champion: fixtureChampion,
          zones: {
            hand: cost.kind === "reserve" ? [card, ...payment] : [],
            memory: cost.kind === "memory" ? payment : [],
            "material-deck": cost.kind === "memory" ? [card] : [],
            "main-deck": [
              reposition,
              ...Array.from({ length: amount }, () => woodlandSquirrels),
            ].slice(0, deckSize),
          },
        },
        playerTwo: { champion: fixtureChampion, zones: { "main-deck": [reposition] } },
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
      // Reserve payments become memory, so the destination baseline is taken
      // after the entry payment is declared.
      const destinationBaseline = player.zone(destination);
      expect(player.zone("main-deck")).toEqual(deck);
      player.pass();
      game.player("player-two").pass();
      if (game.state.decision?.kind === "resolve-effect-choice") {
        if (!asEntersChoice) {
          throw new Error(
            `${grandArchiveTestFace(card).name} requires an asEntersChoice fixture answer.`,
          );
        }
        answerDecision(game, "resolve-effect-choice", [asEntersChoice]);
      }
      expect(player.cards(card, { zone: "field" })).toHaveLength(1);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === abilityId,
        ),
      ).toBe(true);
      expect(player.zone(destination)).toEqual(destinationBaseline);
      passEffectsStack(game);
      expect(player.zone(destination)).toEqual([...destinationBaseline, ...deck.slice(0, amount)]);
      expect(player.zone("main-deck")).toEqual(deck.slice(amount));
      expect(game.player("player-two").zone("hand")).toHaveLength(0);
      expect(game.state.stack).toHaveLength(0);
    });
  }
}
