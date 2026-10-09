import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { caretakerHorse } from "../cards/HVN/allies/caretaker-horse.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "./decisions.ts";

export function proveHorseConditionalAction(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  glimpse: boolean,
) {
  const modes = [
    "absent",
    "own",
    "opponent",
    "graveyard",
    "removed",
    ...(glimpse ? [] : ["self-target"]),
  ];
  for (const mode of modes)
    for (const length of glimpse ? [1, 2, 4] : [4])
      it(`checks the Horse condition at resolution: mode=${mode}, deck=${length}`, () => {
        const champion = enableAllTestElements(lineageTestChampion("Horse conditions", 0));
        const ownsHorse = ["own", "removed", "self-target"].includes(mode);
        const cost = glimpse ? 1 : 3;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            preserveMainDeckOrder: true,
            zones: {
              field: [woodlandSquirrels, ...(ownsHorse ? [caretakerHorse] : [])],
              graveyard: mode === "graveyard" ? [caretakerHorse] : [],
              hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
              "main-deck": [sparkAlight, giantTortoise, caretakerHorse, woodlandSquirrels].slice(
                0,
                length,
              ),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [woodlandSquirrels, ...(mode === "opponent" ? [caretakerHorse] : [])],
              hand: [sparkAlight, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const deck = p.zone("main-deck"),
          opposingDeck = q.zone("main-deck");
        const target =
          mode === "self-target"
            ? p.card(caretakerHorse, { zone: "field" })
            : q.card(woodlandSquirrels, { zone: "field" });
        p.activate(card, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
          ...(glimpse ? {} : { targets: { "target-1": [target.objectId] } }),
        });
        expect(p.zone("main-deck")).toEqual(deck);
        expect(p.zone("memory")).toHaveLength(cost);
        if (mode === "removed") {
          p.pass();
          q.activate(sparkAlight, {
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((ref) => ({ kind: "card", cardId: ref.objectId })),
            targets: { "target-1": [p.card(caretakerHorse, { zone: "field" }).objectId] },
          });
        }
        passEffectsStack(game);
        let ordered = [...deck];
        if (glimpse && mode === "own") {
          const decision = game.state.decision;
          if (decision?.kind !== "resolve-glimpse") throw new Error("Expected Equestrian Glimpse");
          const looked = deck.slice(0, 3);
          expect(decision.cardIds).toEqual(looked.map((ref) => ref.objectId));
          const top = looked.slice(1).reverse(),
            bottom = looked.slice(0, 1);
          answerDecision(game, "resolve-glimpse", {
            kind: "reorder",
            top: top.map((ref) => ref.objectId),
            bottom: bottom.map((ref) => ref.objectId),
          });
          ordered = [...top, ...deck.slice(3), ...bottom];
          passEffectsStack(game);
        }
        expect(game.state.decision).toBeNull();
        const draws = glimpse || mode === "own";
        expect(p.zone("memory")).toHaveLength(cost + (draws ? 1 : 0));
        if (draws) expect(p.zone("memory")).toContainEqual(ordered[0]);
        expect(p.zone("main-deck")).toEqual(ordered.slice(draws ? 1 : 0));
        expect(p.zone("hand")).toHaveLength(0);
        expect(q.zone("main-deck")).toEqual(opposingDeck);
        if (!glimpse) expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
        if (mode === "removed") expect(p.cards(caretakerHorse, { zone: "field" })).toHaveLength(0);
        expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
      });
}
