import { describe, expect, it } from "vitest";
import type { GrandArchiveGlimpseAnswer } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { claudeFatedVisionary } from "../allies/claude-fated-visionary.ts";
import { reposition } from "../actions/reposition.ts";
import { harvestHerbs } from "../actions/harvest-herbs.ts";
import { potionOfHealing } from "./potion-of-healing.ts";

import { proveBrewPotion } from "../../../testing/brew-potion.ts";
import { silvershine } from "../tokens/silvershine.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { razorvine } from "../tokens/razorvine.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { condensedSupernova } from "./condensed-supernova.ts";

/** @covers 14m4c8ljye-a1 */
describe("condensed-supernova — Brew", () => {
  proveBrewPotion({
    card: condensedSupernova,
    reserveCost: 7,
    ingredients: [silvershine, fraysia, manaroot, razorvine, blightroot],
    wrongIngredients: [springleaf, fraysia, manaroot, razorvine, blightroot],
  });
});

/** @covers 14m4c8ljye-a2 */
describe("Condensed Supernova — non-Astra units then Glimpse 4", () => {
  for (const level of [0, 1, 2]) {
    for (const deckSize of [2, 5]) {
      it(`deals level ${level} to both players' non-Astra units before glimpsing a ${deckSize}-card deck`, () => {
        const champion = lineageTestChampion("Supernova", 0);
        const astraChampion = createClassBonusTestChampion(
          condensedSupernova,
          true,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            lineage: Array.from({ length: level }, (_, index) =>
              lineageTestChampion("Supernova", index + 1),
            ),
            zones: {
              field: [condensedSupernova, woodlandSquirrels, claudeFatedVisionary, fraysia],
              "main-deck": [
                woodlandSquirrels,
                reposition,
                harvestHerbs,
                potionOfHealing,
                condensedSupernova,
              ].slice(0, deckSize),
            },
          },
          playerTwo: {
            champion: astraChampion,
            zones: { field: [woodlandSquirrels, claudeFatedVisionary, fraysia] },
          },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const normChampion = player.card(champion, { zone: "field" });
        const deck = player.zone("main-deck");
        const squirrels = [player, opponent].map((p) =>
          p.card(woodlandSquirrels, { zone: "field" }),
        );
        player.activateAbility(condensedSupernova, "14m4c8ljye-a2");
        expect(player.cards(condensedSupernova, { zone: "graveyard" })).toHaveLength(1);
        expect(game.state.objects[normChampion.objectId]?.damage).toBe(0);
        expect(game.state.decision).toBeNull();
        passEffectsStack(game);
        expect(game.state.objects[normChampion.objectId]?.damage).toBe(level);
        for (const squirrel of squirrels) {
          expect(game.state.objects[squirrel.objectId]?.damage).toBe(level);
        }
        for (const p of [player, opponent]) {
          expect(
            game.state.objects[p.card(claudeFatedVisionary, { zone: "field" }).objectId]?.damage,
          ).toBe(0);
          expect(game.state.objects[p.card(fraysia, { zone: "field" }).objectId]?.damage).toBe(0);
        }
        expect(
          game.state.objects[opponent.card(astraChampion, { zone: "field" }).objectId]?.damage,
        ).toBe(0);
        const glimpse = game.state.decision;
        if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse after damage");
        expect(glimpse.cardIds).toEqual(deck.slice(0, 4).map((card) => card.objectId));
        const seen = deck.slice(0, 4);
        const top = seen.slice(-1);
        const bottom = seen.slice(0, -1).reverse();
        answerDecision(game, "resolve-glimpse", {
          kind: "reorder",
          top: top.map((c) => c.objectId),
          bottom: bottom.map((c) => c.objectId),
        } satisfies GrandArchiveGlimpseAnswer);
        passEffectsStack(game);
        expect(player.zone("main-deck")).toEqual([...top, ...deck.slice(4), ...bottom]);
        expect(player.zone("hand")).toHaveLength(0);
        expect(game.state.stack).toHaveLength(0);
        for (const squirrel of squirrels) {
          expect(game.state.objects[squirrel.objectId]?.zone).toBe(
            level > 0 ? "graveyard" : "field",
          );
        }
      });
    }
  }
});
