import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sabelaGossamerPenance } from "./sabela-gossamer-penance.ts";

/** @covers pOJ4uRuyMK-a1 @covers pOJ4uRuyMK-a2 */
describe("Sabela, Gossamer Penance — bonded Sword lifecycle", () => {
  it("returns and empowers an eligible Sword, then sacrifices it when Sabela leaves", () => {
    const champion = createClassBonusTestChampion(
      sabelaGossamerPenance,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [sabelaGossamerPenance, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          banishment: [trainingSword],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: [ferventBeastmaster],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const sabela = player.card(sabelaGossamerPenance, { zone: "hand" });
    const sword = player.card(trainingSword, { zone: "banishment" });
    player.activate(sabela, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-choice", [sword.objectId]);
    passEffectsStack(game);

    expect(game.state.objects[sword.objectId]).toMatchObject({
      zone: "field",
      counters: { "named:bond": 1 },
    });
    expect(
      deriveGrandArchiveNumericProperty(game.state.objects[sword.objectId]!, "power", {
        program: game.program,
        state: game.state,
        controllerId: player.id,
        bindings: {},
      }),
    ).toBe(3);

    advanceToMain(game, opponent.id);
    opponent.declareAttack(ferventBeastmaster, sabela);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[sabela.objectId]!.zone).toBe("graveyard");
    passEffectsStack(game);
    expect(game.state.objects[sword.objectId]!.zone).toBe("banishment");
  });
});
