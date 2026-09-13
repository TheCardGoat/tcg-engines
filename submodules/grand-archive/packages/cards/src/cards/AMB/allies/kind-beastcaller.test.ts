import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../../ALC/items/potion-of-healing.ts";
import { galesMare } from "../../RDO/allies/gales-mare.ts";
import { kindBeastcaller } from "./kind-beastcaller.ts";

function drainForced(game: GrandArchiveTestEngine): void {
  for (let step = 0; step < 32; step++) {
    if (game.answerForcedDecision()) continue;
    if (game.state.decision || game.state.stack.length === 0) return;
    const wait = game.waitState();
    if (wait.kind !== "opportunity") return;
    game.player(wait.playerId).pass();
  }
}

/** @covers k02kvfblwa-a1 */
describe("Kind Beastcaller — Class Bonus On Enter Animal/Beast tutor", () => {
  for (const classBonus of [false, true]) {
    for (const takeAnimal of [false, true]) {
      it(`classBonus=${classBonus}, reveal an Animal=${takeAnimal}`, () => {
        const champion = createClassBonusTestChampion(
          kindBeastcaller,
          classBonus,
          "activation-discount",
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [kindBeastcaller, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
              "main-deck": [
                potionOfHealing,
                galesMare,
                woodlandSquirrels,
                potionOfHealing,
                woodlandSquirrels,
                woodlandSquirrels,
              ],
            },
          },
          playerTwo: { champion },
        });
        const player = game.player("player-one");
        const opponent = game.player("player-two");
        const deck = player.zone("main-deck");
        player.activate(kindBeastcaller, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
        });
        player.pass();
        opponent.pass();
        expect(
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "k02kvfblwa-a1",
          ),
        ).toBe(classBonus);
        drainForced(game);
        if (!classBonus) {
          expect(player.zone("main-deck")).toEqual(deck);
          expect(player.zone("hand")).toHaveLength(0);
          return;
        }
        const animal = player.card(galesMare, { zone: "main-deck" });
        if (game.state.decision?.kind === "resolve-effect-choice") {
          answerDecision(game, "resolve-effect-choice", takeAnimal ? [animal.objectId] : []);
        }
        drainForced(game);
        if (game.state.decision?.kind === "resolve-effect-choice") {
          const remainder = deck
            .slice(0, 5)
            .map((card) => card.objectId)
            .filter((id) => !takeAnimal || id !== animal.objectId);
          answerDecision(game, "resolve-effect-choice", remainder);
        }
        passEffectsStack(game);
        if (takeAnimal) {
          expect(player.cards(galesMare, { zone: "hand" })).toHaveLength(1);
          expect(player.zone("main-deck").some((card) => card.objectId === animal.objectId)).toBe(
            false,
          );
        } else {
          expect(player.cards(galesMare, { zone: "hand" })).toHaveLength(0);
          expect(player.zone("main-deck").map((card) => card.objectId)).toEqual(
            expect.arrayContaining(deck.slice(0, 5).map((card) => card.objectId)),
          );
        }
      });
    }
  }
});
