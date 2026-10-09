import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
type Card = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
export function proveAdditionalPaymentDraw({
  card,
  paymentCard,
  paymentZone = "field",
  amount = 2,
  destination = "hand",
}: {
  card: Card;
  paymentCard: Card;
  paymentZone?: "field" | "graveyard";
  amount?: number;
  destination?: "hand" | "memory";
}): void {
  it("requires the printed additional payment before drawing the correct cards on resolution", () => {
    const cost = grandArchiveTestFace(card).cost;
    if (cost.kind !== "reserve" || typeof cost.amount !== "number")
      throw new Error("Expected fixed reserve cost");
    const champion = enableAllTestElements(
      createClassBonusTestChampion(card, false, "activation-discount"),
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          [paymentZone]: [paymentCard, woodlandSquirrels],
          hand: [card, ...Array.from({ length: cost.amount }, () => woodlandSquirrels)],
          "main-deck": Array.from({ length: amount + 1 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion, zones: { [paymentZone]: [paymentCard] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      paid = p.card(paymentCard, { zone: paymentZone }),
      deck = p.zone("main-deck");
    const reservePayment = p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    for (const selection of [
      [],
      [q.card(paymentCard).objectId],
      [p.card(woodlandSquirrels, { zone: paymentZone }).objectId],
      [paid.objectId, paid.objectId],
    ]) {
      const before = game.state;
      expect(() => p.activate(card, { reservePayment, costSelections: [selection] })).toThrow();
      expect(game.state).toEqual(before);
    }
    p.activate(card, { reservePayment, costSelections: [[paid.objectId]] });
    expect(game.state.objects[paid.objectId]?.zone).not.toBe(paymentZone);
    expect(game.state.objects[q.card(paymentCard).objectId]!.zone).toBe(paymentZone);
    expect(p.zone("main-deck")).toEqual(deck);
    expect(p.zone("hand")).toHaveLength(0);
    const memory = p.zone("memory");
    passEffectsStack(game);
    expect(p.zone("main-deck")).toEqual(deck.slice(amount));
    expect(p.zone("hand")).toEqual(destination === "hand" ? deck.slice(0, amount) : []);
    expect(p.zone("memory")).toEqual(
      destination === "memory" ? [...memory, ...deck.slice(0, amount)] : memory,
    );
    expect(q.zone("hand")).toHaveLength(0);
  });
}
