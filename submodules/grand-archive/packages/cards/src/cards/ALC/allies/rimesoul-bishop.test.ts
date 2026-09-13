import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { deployGunshield } from "../actions/deploy-gunshield.ts";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { rimesoulBishop } from "./rimesoul-bishop.ts";

/** @covers urrqtjot4n-a2 */
describe("Rimesoul Bishop — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: rimesoulBishop });
});

/** @covers urrqtjot4n-a1 */
describe("Rimesoul Bishop — optional Floating Memory banishment", () => {
  it("does not draw when no eligible Floating Memory card can be banished", () => {
    const champion = createClassBonusTestChampion(rimesoulBishop, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [rimesoulBishop, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          graveyard: [woodlandSquirrels],
          "main-deck": [deployGunshield],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activate(rimesoulBishop, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card", cardId: ref.objectId })),
    });
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-optional-effect") {
      answerDecision(game, "resolve-optional-effect", true);
      passEffectsStack(game);
    }
    expect(game.state.decision).toBeNull();
    expect(player.zone("hand")).toHaveLength(0);
    expect(player.zone("main-deck")).toHaveLength(1);
    expect(player.zone("banishment")).toHaveLength(0);
  });
  for (const accept of [false, true]) {
    for (const deckSize of [1, 2]) {
      it(`draws from a ${deckSize}-card deck only after accepting (${accept}) and banishing one eligible card`, () => {
        const champion = createClassBonusTestChampion(rimesoulBishop, false, "activation-discount");
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [rimesoulBishop, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
              graveyard: [deployGunshield, deployGunshield, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, deployGunshield].slice(0, deckSize),
            },
          },
          playerTwo: { champion, zones: { graveyard: [deployGunshield] } },
        });
        const player = game.player("player-one");
        const deck = player.zone("main-deck");
        const graveyard = player.zone("graveyard");
        player.activate(rimesoulBishop, {
          reservePayment: player
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((ref) => ({ kind: "card", cardId: ref.objectId })),
        });
        player.pass();
        game.player("player-two").pass();
        expect(player.cards(rimesoulBishop, { zone: "field" })).toHaveLength(1);
        expect(player.zone("hand")).toHaveLength(0);
        expect(player.zone("graveyard")).toEqual(graveyard);
        passEffectsStack(game);
        answerDecision(game, "resolve-optional-effect", accept);
        if (accept) {
          expect(player.zone("hand")).toHaveLength(0);
          const illegal = [
            player.card(woodlandSquirrels, { zone: "graveyard" }),
            game.player("player-two").card(deployGunshield, { zone: "graveyard" }),
            player.card(rimesoulBishop, { zone: "field" }),
          ];
          for (const ref of illegal) {
            const before = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", [ref.objectId])).toThrow();
            expect(game.state).toEqual(before);
          }
          const selected = player.cards(deployGunshield, { zone: "graveyard" })[1]!;
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(player.zone("banishment")).toEqual([selected]);
          expect(player.zone("graveyard")).toEqual(
            graveyard.filter((ref) => ref.objectId !== selected.objectId),
          );
          expect(player.zone("hand")).toEqual(deck.slice(0, 1));
          expect(player.zone("main-deck")).toEqual(deck.slice(1));
        } else {
          passEffectsStack(game);
          expect(player.zone("hand")).toHaveLength(0);
          expect(player.zone("graveyard")).toEqual(graveyard);
          expect(player.zone("main-deck")).toEqual(deck);
        }
        expect(game.player("player-two").zone("graveyard")).toHaveLength(1);
      });
    }
  }
});
