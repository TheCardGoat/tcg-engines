import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { reposition } from "../cards/ALC/actions/reposition.ts";

/** Identical entry condition; the sibling supplies its printed result explicitly. */
export function proveDistantEntry(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  result: "draw-memory" | "become-distant",
) {
  for (const setup of ["none", "opponent", "ally", "champion", "late-champion"] as const) {
    it(`checks a controlled distant unit at entry resolution (${setup})`, () => {
      const champion = createClassBonusTestChampion(card, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [card, reposition, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            field: [woodlandSquirrels],
            "main-deck": [woodlandSquirrels, reposition],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels], "main-deck": [reposition] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const deck = player.zone("main-deck");
      const target =
        setup === "opponent"
          ? opponent.card(woodlandSquirrels)
          : setup === "ally"
            ? player.card(woodlandSquirrels, { zone: "field" })
            : player.card(champion);
      const makeDistant = () => {
        player.activate(reposition, {
          targets: { "target-1": [target.objectId] },
          reservePayment: [
            {
              kind: "card",
              cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
            },
          ],
        });
        // Resolve Reposition only, leaving the entry trigger beneath it when present.
        for (
          let step = 0;
          step < 8 && !game.state.objects[target.objectId]!.states.has("distant");
          step++
        ) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
      };
      if (setup !== "none" && setup !== "late-champion") makeDistant();
      player.activate(card, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      player.pass();
      opponent.pass();
      const entered = player.card(card, { zone: "field" });
      expect(game.state.objects[entered.objectId]!.states.has("distant")).toBe(false);
      expect(player.zone("main-deck")).toEqual(deck);
      if (setup === "late-champion") makeDistant();
      const memory = player.zone("memory");
      passEffectsStack(game);
      const enabled = setup !== "none" && setup !== "opponent";
      expect(game.state.objects[entered.objectId]!.states.has("distant")).toBe(
        result === "become-distant" && enabled,
      );
      expect(player.zone("memory")).toEqual(
        result === "draw-memory" && enabled ? [...memory, deck[0]] : memory,
      );
      expect(player.zone("main-deck")).toEqual(
        result === "draw-memory" && enabled ? deck.slice(1) : deck,
      );
      expect(opponent.zone("memory")).toHaveLength(0);
    });
  }
}
