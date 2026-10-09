import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { chasingShadows } from "../cards/RDO/phantasias/chasing-shadows.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
export function proveChosenActivationTax(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  mode: "type" | "name",
) {
  for (const own of [false, true])
    for (const matching of [false, true])
      for (const extra of mode === "name" ? [0, 2] : [0]) {
        it(`taxes the chosen ${mode}: own=${own}, matching=${matching}, extra phantasias=${extra}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(card, false, "activation-discount"),
          );
          const cost = grandArchiveTestFace(card).cost;
          if (cost.kind !== "reserve" || typeof cost.amount !== "number")
            throw new Error("Expected reserve cost");
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [card, ...Array.from({ length: 12 }, () => woodlandSquirrels)],
                field: Array.from({ length: extra }, () => chasingShadows),
                "main-deck": [giantTortoise, giantTortoise, glacialGuidance],
              },
            },
            playerTwo: {
              champion,
              zones: {
                hand: Array.from({ length: 9 }, () => woodlandSquirrels),
                field: [chasingShadows],
                "main-deck": [giantTortoise, giantTortoise, glacialGuidance],
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card);
          p.activate(source, {
            reservePayment: p
              .cards(woodlandSquirrels)
              .slice(0, cost.amount)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
          });
          passEffectsStack(game);
          answerDecision(
            game,
            "resolve-effect-choice",
            mode === "type"
              ? matching
                ? "ALLY"
                : "ACTION"
              : matching
                ? "Woodland Squirrels"
                : "Giant Tortoise",
          );
          passEffectsStack(game);
          if (!own) advanceToMain(game, q.id);
          const player = own ? p : q,
            target = player.cards(woodlandSquirrels, { zone: "hand" })[0]!;
          const tax = matching && (mode === "name" || !own) ? (mode === "type" ? 4 : 3 + extra) : 0;
          const payment = player
            .cards(woodlandSquirrels, { zone: "hand" })
            .filter((c) => c.objectId !== target.objectId)
            .slice(0, tax)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (tax) {
            const before = game.state;
            expect(() => player.activate(target, { reservePayment: payment.slice(1) })).toThrow();
            expect(game.state).toEqual(before);
          }
          const memory = player.zone("memory").length,
            hand = player.zone("hand").length;
          player.activate(target, { reservePayment: payment });
          expect(player.zone("memory")).toHaveLength(memory + tax);
          expect(player.zone("hand")).toHaveLength(hand - tax - 1);
          passEffectsStack(game);
          expect(player.zone("field")).toContainEqual(target);
        });
      }
}
