import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { songOfNurturing } from "../cards/DOA/actions/song-of-nurturing.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "./decisions.ts";
export function proveHarmonizeDraw({
  card,
  cost,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
}): void {
  for (const matching of [true, false])
    for (const melody of ["none", "this-turn", "last-turn"] as const)
      it(`draws only with Class Bonus and a Melody this turn (${matching},${melody})`, () => {
        const champion = createClassBonusTestChampion(card, matching, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                card,
                songOfNurturing,
                ...Array.from({ length: cost + 2 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const payment = (amount: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, amount)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        if (melody !== "none") {
          p.activate(songOfNurturing, { reservePayment: payment(2) });
          passEffectsStack(game);
        }
        if (melody === "last-turn") {
          advanceToMain(game, q.id);
          advanceToMain(game, p.id);
        }
        const deck = p.zone("main-deck");
        p.activate(card, { reservePayment: payment(cost) });
        const hand = p.zone("hand");
        expect(p.zone("main-deck")).toEqual(deck);
        passEffectsStack(game);
        const draws = matching && melody === "this-turn";
        expect(p.zone("main-deck")).toEqual(deck.slice(draws ? 1 : 0));
        expect(p.zone("hand")).toEqual(draws ? [...hand, deck[0]!] : hand);
      });
}
