import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { advanceToRecollection } from "./aging-potion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";
export function proveRecollectionDraw(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  chooseNumber = false,
): void {
  it("rejects main phase activation and draws into memory during the opponent's recollection", () => {
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
          hand: [card, ...Array.from({ length: cost.amount }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      deck = p.zone("main-deck");
    const options = {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    };
    const before = game.state;
    expect(() => p.activate(card, options)).toThrow();
    expect(game.state).toEqual(before);
    advanceToRecollection(game, q.id);
    const wait = game.waitState();
    if (wait.kind === "opportunity" && wait.playerId === q.id) q.pass();
    p.activate(card, options);
    expect(p.zone("main-deck")).toEqual(deck);
    passEffectsStack(game);
    if (chooseNumber) {
      answerDecision(game, "resolve-effect-choice", 3);
      passEffectsStack(game);
    }
    expect(p.zone("memory")).toHaveLength(cost.amount + 1);
    expect(p.zone("memory")).toContainEqual(deck[0]);
    expect(p.zone("hand")).toHaveLength(0);
    expect(p.zone("main-deck")).toEqual(deck.slice(1));
  });
}
