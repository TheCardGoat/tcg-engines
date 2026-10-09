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
export function proveAsEntersChoice(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  kind: "ally" | "name" | "type",
) {
  for (const choice of kind === "type"
    ? ["ALLY", "ACTION"]
    : kind === "ally"
      ? ["Woodland Squirrels", "Giant Tortoise"]
      : ["Woodland Squirrels", "Glacial Guidance"]) {
    it(`chooses ${choice} before committing field entry`, () => {
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
            hand: [card, ...Array.from({ length: cost.amount }, () => woodlandSquirrels)],
            "main-deck": [giantTortoise, glacialGuidance],
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        source = p.card(card);
      p.activate(source, {
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
      passEffectsStack(game);
      expect(game.state.decision).toMatchObject({ kind: "resolve-effect-choice", playerId: p.id });
      expect(game.state.objects[source.objectId]!.zone).toBe("effects-stack");
      expect(
        game.state.eventHistory.some(
          (e) => e.type === "object-moved" && e.objectId === source.objectId && e.to === "field",
        ),
      ).toBe(false);
      for (const invalid of [
        "Not a real choice",
        woodlandSquirrels.canonicalId,
        ...(kind === "ally" ? ["Glacial Guidance"] : kind === "type" ? ["CLERIC"] : []),
      ]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
        expect(game.state).toEqual(before);
      }
      const decision = game.state.decision;
      if (!decision) throw new Error("Missing choice");
      const before = game.state;
      expect(() =>
        q.execute({
          move: "answer-decision",
          decisionId: decision.id,
          stateVersion: decision.stateVersion,
          answer: choice,
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(game, "resolve-effect-choice", choice);
      passEffectsStack(game);
      const entered = game.state.objects[source.objectId]!;
      expect(entered.zone).toBe("field");
      expect(game.state.trackedCharacteristics[source.objectId]).toEqual({
        incarnation: entered.incarnation,
        values: { [kind === "type" ? "chosen-card-type" : "chosen-card-name"]: [choice] },
      });
      expect(game.state.replacementPreCommit).toBeNull();
      expect(game.state.decision).toBeNull();
    });
  }
}
