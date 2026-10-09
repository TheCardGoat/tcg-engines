import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { glacialGuidance } from "../cards/DOA/actions/glacial-guidance.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
export function proveEntryMill(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  amount: number,
  mode: "self" | "each" | "target",
) {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
    throw new Error("Expected fixed reserve cost");
  const cost = face.cost.amount;
  for (const length of [0, 1, amount, amount + 2].filter((v, i, a) => a.indexOf(v) === i))
    for (const target of mode === "target" ? ["self", "opponent"] : ["self"])
      it(`mills exactly the available top cards: deck=${length}, recipient=${target}, mode=${mode}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(card, false, "activation-discount"),
        );
        const deck = [
          giantTortoise,
          glacialGuidance,
          woodlandSquirrels,
          glacialGuidance,
          giantTortoise,
        ].slice(0, length);
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            preserveMainDeckOrder: true,
            zones: {
              hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              "main-deck": deck,
              graveyard: [woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            preserveMainDeckOrder: true,
            zones: { "main-deck": [...deck].reverse(), graveyard: [woodlandSquirrels] },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const players = [p, q],
          decks = players.map((player) => player.zone("main-deck")),
          graves = players.map((player) => player.zone("graveyard"));
        const source = p.card(card);
        p.activate(source, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        expect(p.zone("main-deck")).toEqual(decks[0]);
        expect(q.zone("main-deck")).toEqual(decks[1]);
        if (mode === "target") {
          passEffectsStack(game);
          expect(game.state.decision?.kind).toBe("announce-triggered-ability");
          const before = game.state;
          expect(() =>
            answerDecision(game, "announce-triggered-ability", {
              targets: { "target-player": [source.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          answerDecision(game, "announce-triggered-ability", {
            targets: { "target-player": [target === "self" ? p.id : q.id] },
          });
          expect(p.zone("main-deck")).toEqual(decks[0]);
          expect(q.zone("main-deck")).toEqual(decks[1]);
        }
        passEffectsStack(game);
        for (const [i, player] of players.entries()) {
          const affected = mode === "each" || (target === "self" ? i === 0 : i === 1);
          const count = affected ? Math.min(amount, length) : 0;
          expect(player.zone("main-deck")).toEqual(decks[i]!.slice(count));
          expect(player.zone("graveyard")).toEqual([...graves[i]!, ...decks[i]!.slice(0, count)]);
        }
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        expect(game.state.decision).toBeNull();
        expect(game.waitState().kind).not.toBe("game-over");
      });
}
