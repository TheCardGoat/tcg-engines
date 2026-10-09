import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { lineageTestChampion } from "./champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
  grandArchiveTestFace,
} from "./class-bonus-test-champion.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../cards/DOA/allies/giant-tortoise.ts";
import { pawnPiece } from "../cards/PTM/tokens/pawn-piece.ts";
import { blightroot } from "../cards/ALC/tokens/blightroot.ts";
import { manaroot } from "../cards/ALC/tokens/manaroot.ts";
import { silvershine } from "../cards/ALC/tokens/silvershine.ts";
import { fraysia } from "../cards/ALC/tokens/fraysia.ts";
import { razorvine } from "../cards/ALC/tokens/razorvine.ts";
import { springleaf } from "../cards/ALC/tokens/springleaf.ts";
const herbs = [blightroot, manaroot, silvershine, fraysia, razorvine, springleaf];
export function proveNamedFastActivation(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  name: string,
  sacrifice = false,
) {
  for (const named of [false, true])
    for (const matchingClass of [false, true])
      for (const window of ["main", "response", "opponent", "combat"] as const)
        it(`lineage=${named}, class=${matchingClass}, window=${window}`, () => {
          const base = lineageTestChampion(named ? name : "Other", 0),
            face = requireSingleFace(base),
            classes = matchingClass
              ? grandArchiveTestFace(card).typeLine.classes
              : face.typeLine.classes;
          const champion = enableAllTestElements({
            ...base,
            layout: {
              kind: "single-faced",
              face: { ...face, typeLine: { ...face.typeLine, classes, subtypes: classes } },
            },
          });
          const game = GrandArchiveTestEngine.startFixture({
            definitions: herbs,
            firstPlayer: window === "opponent" || window === "combat" ? "playerTwo" : "playerOne",
            playerOne: {
              champion,
              zones: {
                hand: [card, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
                field: [pawnPiece],
                "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { field: [giantTortoise, pawnPiece] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            source = p.card(card),
            pawn = p.card(pawnPiece),
            deck = p.zone("main-deck");
          if (window === "response") p.activate(p.cards(woodlandSquirrels, { zone: "hand" })[0]!);
          if (window === "combat") q.declareAttack(q.card(giantTortoise), p.card(champion));
          if (window === "opponent" || window === "combat") q.pass();
          const pending = game.state.stack.length,
            eligible = named || window === "main";
          const options = {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
            ...(sacrifice ? { costSelections: [[pawn.objectId]] } : {}),
          };
          expect(
            p
              .legalCommands()
              .some(
                (c) => c.command.move === "activate-card" && c.command.cardId === source.objectId,
              ),
          ).toBe(eligible);
          if (!eligible) {
            const before = game.state;
            expect(() => p.activate(source, options)).toThrow(/slow|speed|timing/i);
            expect(game.state).toEqual(before);
            return;
          }
          const before = game.state;
          if (sacrifice) {
            expect(() => p.activate(source, { ...options, costSelections: [] })).toThrow();
            expect(game.state).toEqual(before);
          }
          p.activate(source, options);
          expect(game.state.stack).toHaveLength(pending + 1);
          expect(game.state.stack.at(-1)?.sourceId).toBe(source.objectId);
          expect(p.zone("memory")).toHaveLength(3);
          expect(p.zone("main-deck")).toEqual(deck);
          if (sacrifice) expect(game.state.objects[pawn.objectId]).toBeUndefined();
          for (
            let i = 0;
            i < 16 && game.state.objects[source.objectId]!.zone === "effects-stack";
            i++
          ) {
            const w = game.waitState();
            if (w.kind !== "opportunity") throw new Error(`Unexpected ${w.kind}`);
            game.player(w.playerId).pass();
          }
          expect(game.state.objects[source.objectId]!.zone).toBe("graveyard");
          expect(game.state.stack).toHaveLength(pending);
          if (sacrifice) {
            expect(p.zone("main-deck")).toEqual(deck.slice(2));
            for (const drawn of deck.slice(0, 2))
              expect(game.state.objects[drawn.objectId]!.zone).toBe("hand");
            expect(q.cards(pawnPiece, { zone: "field" })).toHaveLength(1);
          } else
            for (const herb of herbs) {
              expect(p.cards(herb, { zone: "field" })).toHaveLength(1);
              expect(q.cards(herb, { zone: "field" })).toHaveLength(0);
            }
          if (window === "combat") expect(game.state.combat).not.toBeNull();
        });
}
