import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";

/** Fast Activation changes admission timing; resolution abilities have separate card evidence. */
export function proveClassBonusFastActivation(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  target: "none" | "ally" | "rested-ally" = "none",
): void {
  const cost = grandArchiveTestFace(card).cost;
  if (cost.kind !== "reserve" || typeof cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const reserveCost = cost.amount;
  for (const matching of [false, true])
    for (const window of ["main", "response", "opponent"] as const) {
      it(`admits activation with matching class=${matching} in ${window}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: window === "opponent" ? "playerTwo" : "playerOne",
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: reserveCost + 1 }, () => woodlandSquirrels)],
              field: [giantTortoise],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          active = window === "opponent" ? q : p,
          defender = window === "opponent" ? p : q;
        const chosen = active.card(giantTortoise);
        if (target === "rested-ally") {
          active.declareAttack(chosen, defender.card(champion));
          game.resolveCombatWithoutRetaliation();
          expect(game.state.objects[chosen.objectId]!.states.has("rested")).toBe(true);
        }
        if (window === "response") p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
        if (window === "opponent") q.pass();
        const pending = game.state.stack.length;
        expect(pending).toBe(window === "response" ? 1 : 0);
        const source = p.card(card, { zone: "hand" });
        const options = {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, reserveCost)
            .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
          ...(target === "none" ? {} : { targets: { "target-1": [chosen.objectId] } }),
        };
        expect(
          p
            .legalCommands()
            .some(
              (candidate) =>
                candidate.command.move === "activate-card" &&
                candidate.command.cardId === source.objectId,
            ),
        ).toBe(matching || window === "main");
        if (!matching && window !== "main") {
          const before = game.state;
          expect(() => p.activate(source, options)).toThrow(/slow|speed|timing/i);
          expect(game.state).toEqual(before);
        } else {
          p.activate(source, options);
          expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
          expect(game.state.stack).toHaveLength(pending + 1);
          expect(game.state.stack.at(-1)?.sourceId).toBe(source.objectId);
          expect(p.zone("memory")).toHaveLength(reserveCost);
        }
      });
    }
}
