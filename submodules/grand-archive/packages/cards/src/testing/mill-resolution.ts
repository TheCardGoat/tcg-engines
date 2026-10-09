import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { trainingSword } from "../cards/AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";
export function proveMillResolution(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  amount: number,
  mode: "target" | "own" | "opponents",
  sacrifice = false,
): void {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
    throw new Error("Expected reserve cost");
  const cost = face.cost.amount;
  for (const own of mode === "target" ? [false, true] : [mode === "own"])
    for (const size of [0, 1, amount, amount + 2])
      it(`mills ${amount}, own=${own}, remaining=${size}, sacrifice=${sacrifice}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, false, "activation-discount"),
        );
        const deck = Array.from({ length: size }, (_, i) =>
          i % 2 === 0 ? woodlandSquirrels : sparkAlight,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              field: [woodlandSquirrels, trainingSword],
              graveyard: [sparkAlight],
              "main-deck": own ? deck : [sparkAlight, sparkAlight],
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels],
              graveyard: [sparkAlight],
              "main-deck": own ? [sparkAlight, sparkAlight] : deck,
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = own ? p : q,
          other = own ? q : p,
          source = p.card(card),
          ally = p.card(woodlandSquirrels, { zone: "field" });
        const beforeDeck = target.zone("main-deck"),
          otherDeck = other.zone("main-deck"),
          beforeGrave = target.zone("graveyard");
        const reservePayment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const targets = mode === "target" ? { "target-player": [target.id] } : undefined;
        const costSelections = sacrifice ? [[ally.objectId]] : undefined;
        const before = game.state;
        expect(() =>
          p.activate(source, { reservePayment: reservePayment.slice(1), targets, costSelections }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (mode === "target")
          for (const invalid of [
            [],
            [p.id, q.id],
            [target.id, target.id],
            [p.card(champion).objectId],
          ]) {
            expect(() =>
              p.activate(source, {
                reservePayment,
                targets: { "target-player": invalid },
                costSelections,
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
        if (sacrifice)
          for (const invalid of [
            [],
            [q.card(woodlandSquirrels).objectId],
            [p.card(champion).objectId],
            [p.card(trainingSword).objectId],
            [ally.objectId, ally.objectId],
          ]) {
            expect(() =>
              p.activate(source, { reservePayment, targets, costSelections: [invalid] }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
        const history = game.state.eventHistory.length;
        p.activate(source, { reservePayment, targets, costSelections });
        expect(target.zone("main-deck")).toEqual(beforeDeck);
        if (sacrifice) expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(game.state.winnerIds).toEqual([]);
        const moved = beforeDeck.slice(0, amount);
        expect(target.zone("main-deck")).toEqual(beforeDeck.slice(amount));
        expect(other.zone("main-deck")).toEqual(otherDeck);
        for (const ref of [...beforeGrave, ...moved])
          expect(game.state.objects[ref.objectId]!.zone).toBe("graveyard");
        const events = game.state.eventHistory
          .slice(history)
          .filter((e) => e.type === "object-moved")
          .filter((e) => e.from === "main-deck");
        expect(events.map((e) => e.objectId)).toEqual(moved.map((c) => c.objectId));
        for (const event of events) expect(event.to).toBe("graveyard");
        expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
        expect(p.zone("memory")).toHaveLength(cost);
        expect(q.zone("memory")).toHaveLength(0);
      });
}
