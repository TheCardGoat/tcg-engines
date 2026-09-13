import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { airshipEngineer } from "../allies/airship-engineer.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { waveriderProtector } from "../allies/waverider-protector.ts";
import { fieryWarcry } from "./fiery-warcry.ts";

/** @covers ippor7ch2b-a1 */
describe("Fiery Warcry — draw then discard", () => {
  it("draws before the player chooses a card to discard", () => {
    const champion = createClassBonusTestChampion(fieryWarcry, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [fieryWarcry, airshipEngineer, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const discard = player.card(airshipEngineer, { zone: "hand" });
    player.activate(fieryWarcry, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(player.zone("hand")).toHaveLength(2);
    answerDecision(game, "resolve-effect-choice", [discard.objectId]);
    passEffectsStack(game);
    expect(game.state.objects[discard.objectId]!.zone).toBe("graveyard");
    expect(player.zone("hand")).toHaveLength(1);
  });
});

/** @covers ippor7ch2b-a2 */
describe("Fiery Warcry — Class Bonus keyword removal", () => {
  it("banishes a Fire card so an opposing Taunt ally no longer protects its champion", () => {
    const champion = createClassBonusTestChampion(fieryWarcry, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [automatedGardener],
          hand: [fieryWarcry, automatedGardener, woodlandSquirrels, woodlandSquirrels],
          graveyard: [airshipEngineer],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [waveriderProtector] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const taunt = opponent.card(waveriderProtector);
    const fireCard = player.card(airshipEngineer, { zone: "graveyard" });
    const discard = player.card(automatedGardener, { zone: "hand" });
    player.activate(fieryWarcry, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [discard.objectId]);
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [fireCard.objectId]);
    passEffectsStack(game);
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-ally": [taunt.objectId] },
    });
    passEffectsStack(game);

    expect(game.state.objects[fireCard.objectId]!.zone).toBe("banishment");
    player.declareAttack(automatedGardener, opponent.card(champion));
    expect(game.state.combat?.targetIds).toEqual([opponent.card(champion).objectId]);
  });
});
