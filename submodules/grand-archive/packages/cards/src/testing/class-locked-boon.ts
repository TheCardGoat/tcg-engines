import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveClass,
} from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grandArchiveTestFace,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { refurbish } from "../cards/DOA/actions/refurbish.ts";
import { greaterBoonOfHorses } from "../cards/PP1/boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../cards/PP1/tokens/pantheon-barrier.ts";
export function proveClassLockedBoon(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  const face = grandArchiveTestFace(card);
  if (face.cost.kind !== "reserve" || typeof face.cost.amount !== "number")
    throw new Error("Expected a fixed reserve cost");
  const cost = face.cost.amount;
  const classes: readonly GrandArchiveClass[] = ["SPIRIT", ...face.typeLine.classes];
  for (const chosenClass of classes)
    it(`bestows only for a matching champion class: ${chosenClass}`, () => {
      const matching = chosenClass !== "SPIRIT";
      const base = enableAllTestElements(
        createClassBonusTestChampion(card, matching, "activation-discount"),
      );
      const baseFace = requireSingleFace(base);
      const champion = {
        ...base,
        layout: {
          kind: "single-faced" as const,
          face: {
            ...baseFace,
            typeLine: {
              ...baseFace.typeLine,
              classes: [chosenClass] as const,
              subtypes: [chosenClass] as const,
            },
          },
        },
      };
      const player = (id: string): GrandArchivePantheonPlayerSetup => ({
        id,
        name: id,
        startingChampionDefinitionId: champion.canonicalId,
        mainDeck: [{ definitionId: woodlandSquirrels.canonicalId, count: 20 }],
        materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
        pantheon: {
          lesserBoonDefinitionId: card.canonicalId,
          greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
          barrierDefinitionId: pantheonBarrier.canonicalId,
        },
      });
      const game = GrandArchiveTestEngine.start(
        [champion, card, greaterBoonOfHorses, pantheonBarrier, woodlandSquirrels, refurbish],
        {
          mode: "pantheon",
          randomSeed: 43,
          firstPlayerId: "player-one",
          players: [player("player-one"), player("player-two"), player("player-three")],
        },
        { validateDeckConstruction: false, skipPregameForTests: true },
      );
      const p = game.player("player-one"),
        boon = p.card(card, { zone: "pantheon" });
      for (let draw = 0; draw < cost + 1; draw++) advanceToMain(game, p.id, game.state.turn.number);
      p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
      passEffectsStack(game);
      const reservePayment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, cost)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
      expect(reservePayment).toHaveLength(cost);
      expect(
        p
          .legalCommands()
          .some(
            (candidate) =>
              candidate.command.move === "bestow-boon" &&
              candidate.command.cardId === boon.objectId,
          ),
      ).toBe(matching);
      const before = game.state;
      if (!matching) {
        expect(() =>
          p.execute({ move: "bestow-boon", cardId: boon.objectId, reservePayment }),
        ).toThrow();
        expect(game.state).toEqual(before);
        expect(game.state.objects[boon.objectId]!.facing).toBe("face-down");
        return;
      }
      if (cost > 0) {
        expect(() =>
          p.execute({
            move: "bestow-boon",
            cardId: boon.objectId,
            reservePayment: reservePayment.slice(1),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      p.execute({ move: "bestow-boon", cardId: boon.objectId, reservePayment });
      expect(p.zone("memory")).toHaveLength(cost);
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-effect-choice") {
        answerDecision(game, "resolve-effect-choice", [
          p.card(woodlandSquirrels, { zone: "field" }).objectId,
        ]);
        passEffectsStack(game);
      }
      expect(game.state.decision).toBeNull();
      expect(game.state.objects[boon.objectId]!.zone).toBe("pantheon");
      expect(game.state.objects[boon.objectId]!.facing).toBe("face-up");
      expect(
        game.state.objects[game.player("player-two").card(card, { zone: "pantheon" }).objectId]!
          .facing,
      ).toBe("face-down");
    });
}
