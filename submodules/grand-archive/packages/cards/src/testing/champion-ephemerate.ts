import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { driftingAbysshell } from "../cards/PTM/allies/drifting-abysshell.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements, grandArchiveTestFace } from "./class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

export function proveChampionEphemerate(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  lineage: string,
  cost: number,
  mode: "item" | "damage" | "choice",
) {
  for (const matches of [false, true])
    for (const graveyard of [false, true])
      it(`uses the correct cost and destination, matching champion=${matches}, graveyard=${graveyard}`, () => {
        const hero = enableAllTestElements(lineageTestChampion(matches ? lineage : "Other", 0));
        const foe = enableAllTestElements(lineageTestChampion(lineage, 0));
        const printed = grandArchiveTestFace(card).cost;
        if (printed.kind !== "reserve" || typeof printed.amount !== "number")
          throw new Error("Expected fixed reserve cost");
        const paymentCost = graveyard ? cost : printed.amount;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion: hero,
            zones: {
              hand: [
                ...(graveyard ? [] : [card]),
                ...Array.from({ length: paymentCost + 1 }, () => woodlandSquirrels),
              ],
              graveyard: graveyard ? [card] : [],
              field: mode === "item" ? [driftingAbysshell] : [],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: foe,
            zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card);
        const pay = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const options = {
          activationMethod: graveyard ? ("ephemerate" as const) : undefined,
          ...(mode === "damage" ? { targets: { "target-1": [q.card(foe).objectId] } } : {}),
        };
        const before = game.state;
        if (!matches && graveyard) {
          expect(() =>
            p.activate(source, { ...options, reservePayment: pay(paymentCost) }),
          ).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        for (const n of [paymentCost - 1, paymentCost + 1]) {
          expect(() => p.activate(source, { ...options, reservePayment: pay(n) })).toThrow();
          expect(game.state).toEqual(before);
        }
        expect(() =>
          p.activate(source, {
            ...options,
            activationMethod: graveyard ? undefined : "ephemerate",
            reservePayment: pay(paymentCost),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(source, { ...options, reservePayment: pay(paymentCost) });
        expect(p.zone("memory")).toHaveLength(paymentCost);
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(
          graveyard && mode !== "item",
        );
        passEffectsStack(game);
        if (mode === "choice" && matches) {
          expect(p.zone("main-deck")).toHaveLength(0);
          expect(game.state.decision).toBeNull();
        }
        if (mode === "damage") expect(game.state.objects[q.card(foe).objectId]!.damage).toBe(1);
        if (mode === "item") {
          expect(game.state.objects[source.objectId]!.zone).toBe("field");
          expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(graveyard);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
          advanceToMain(game, q.id);
          advanceToMain(game, p.id);
          p.activateAbility(source, `${card.canonicalId}-a2`, {
            targets: { "target-1": [p.card(driftingAbysshell).objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[p.card(driftingAbysshell).objectId]!.counters.buff).toBe(1);
        }
        expect(game.state.objects[source.objectId]!.zone).toBe(
          graveyard ? "banishment" : "graveyard",
        );
        expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(false);
      });
}
