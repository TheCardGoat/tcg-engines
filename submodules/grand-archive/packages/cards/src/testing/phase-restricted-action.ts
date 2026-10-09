import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
export function provePhaseRestrictedAction(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  requiredPhase: "recollection" | "end",
  ownTurn: boolean,
  target: "none" | "opponent" | "ally",
) {
  const printed = grandArchiveTestFace(card).cost;
  if (printed.kind !== "reserve" || typeof printed.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const cost = printed.amount;
  for (const own of [false, true])
    for (const phase of ["main", "recollection", "end"] as const) {
      it(`admits activation only in the required phase: own=${own}, phase=${phase}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, false, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [card, ...Array.from({ length: cost + 1 }, () => woodlandSquirrels)],
              field: [giantTortoise],
              "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: lineageTestChampion("Other", 0),
            zones: { "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels) },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(card);
        let reached = false;
        for (let step = 0; step < 256; step++) {
          const wait = game.waitState();
          if (
            game.state.turn.playerId === (own ? p.id : q.id) &&
            game.state.turn.phase === phase &&
            wait.kind === "opportunity" &&
            wait.playerId === p.id
          ) {
            reached = true;
            break;
          }
          if (wait.kind === "materialization-choice")
            game.player(wait.playerId).execute({ move: "skip-materialization" });
          else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
          else throw new Error(`Unexpected wait ${wait.kind}`);
        }
        expect(reached).toBe(true);
        const allowed = own === ownTurn && phase === requiredPhase;
        expect(
          p
            .legalCommands()
            .some(
              (c) => c.command.move === "activate-card" && c.command.cardId === source.objectId,
            ),
        ).toBe(allowed);
        const options: NonNullable<Parameters<typeof p.activate>[1]> = {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          ...(target === "opponent"
            ? { targets: { "target-opponent": [q.id] } }
            : target === "ally"
              ? { targets: { "target-ally": [p.card(giantTortoise).objectId] } }
              : {}),
        };
        const before = game.state,
          hand = p.zone("hand").length;
        if (!allowed) {
          expect(() => p.activate(source, options)).toThrow();
          expect(game.state).toEqual(before);
          return;
        }
        p.activate(source, options);
        expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
        expect(game.state.stack).toHaveLength(1);
        expect(p.zone("hand")).toHaveLength(hand - cost - 1);
        expect(p.zone("memory")).toHaveLength(cost);
      });
    }
}
