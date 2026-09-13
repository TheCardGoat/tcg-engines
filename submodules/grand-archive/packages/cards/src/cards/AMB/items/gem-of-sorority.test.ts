import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { liturgyOfCorruption } from "../../RDO/actions/liturgy-of-corruption.ts";
import { gemOfSorority } from "./gem-of-sorority.ts";

/** @covers 4dys05p49w-a1 */
describe("Gem of Sorority — Empower 2", () => {
  it("banishes itself to Empower 2 for the next Spell this turn", () => {
    const champion = createClassBonusTestChampion(gemOfSorority, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [gemOfSorority, woodlandSquirrels],
          hand: [liturgyOfCorruption, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activateAbility(gemOfSorority, "4dys05p49w-a1");
    expect(player.cards(gemOfSorority, { zone: "field" })).toHaveLength(0);
    expect(game.state.players[player.id]!.states.empower).toBeUndefined();
    passEffectsStack(game);
    expect(player.card(gemOfSorority, { zone: "banishment" }).definitionId).toBe(
      gemOfSorority.canonicalId,
    );
    expect(game.state.players[player.id]!.states.empower).toBe(2);

    player.activate(liturgyOfCorruption, {
      targets: { "target-1": [player.card(woodlandSquirrels, { zone: "field" }).objectId] },
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    expect(game.state.players[player.id]!.states.empower).toBe(0);
    const spell = player.card(liturgyOfCorruption, { zone: "effects-stack" });
    expect(game.state.objects[spell.objectId]!.activationStates.has("empowered")).toBe(true);
  });
});
