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

export function proveSelfEntryCounters(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  counter: string,
  amount: number,
): void {
  const cost = grandArchiveTestFace(card).cost;
  if (cost.kind !== "reserve" || typeof cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const reserve = cost.amount;
  for (const matching of [false, true])
    for (const existingCopy of [false, true])
      it(`class=${matching}, existing copy=${existingCopy}: counters are present at entry, only on the entering source`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: reserve + 1 }, () => woodlandSquirrels)],
              field: existingCopy ? [card] : [],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: { champion, zones: { field: [card], "main-deck": [woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(card, { zone: "hand" });
        const old = existingCopy ? p.card(card, { zone: "field" }) : undefined;
        const opposing = q.card(card, { zone: "field" });
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, reserve)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        expect(game.state.objects[source.objectId]!.counters[counter] ?? 0).toBe(0);
        for (
          let step = 0;
          step < 8 && game.state.objects[source.objectId]!.zone !== "field";
          step++
        ) {
          const wait = game.waitState();
          if (wait.kind !== "opportunity") throw new Error(`Unexpected entry wait ${wait.kind}`);
          game.player(wait.playerId).pass();
        }
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.objects[source.objectId]!.counters[counter]).toBe(amount);
        expect(game.state.objects[opposing.objectId]!.counters[counter] ?? 0).toBe(0);
        if (old) expect(game.state.objects[old.objectId]!.counters[counter] ?? 0).toBe(0);
        passEffectsStack(game);
        expect(game.state.objects[source.objectId]!.counters[counter]).toBe(amount);
        // An unrelated later entry must not reapply this source's entry replacement.
        p.activate(woodlandSquirrels, { reservePayment: [] });
        passEffectsStack(game);
        const ally = p.card(woodlandSquirrels, { zone: "field" });
        expect(game.state.objects[ally.objectId]!.counters[counter] ?? 0).toBe(0);
        expect(game.state.objects[source.objectId]!.counters[counter]).toBe(amount);
      });
}
