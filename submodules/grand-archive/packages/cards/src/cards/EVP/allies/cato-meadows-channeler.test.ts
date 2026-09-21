import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { automatedGardener } from "../../ALC/allies/automated-gardener.ts";
import { apprenticeAeromancer } from "../../AMB/allies/apprentice-aeromancer.ts";
import { nascentBlast } from "../../P24/actions/nascent-blast.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { catoMeadowsChanneler } from "./cato-meadows-channeler.ts";

function fixture(classBonus: boolean) {
  const champion = createClassBonusTestChampion(
    catoMeadowsChanneler,
    classBonus,
    "activation-discount",
  );
  const game = GrandArchiveTestEngine.startFixture({
    playerOne: {
      champion,
      zones: {
        hand: [
          catoMeadowsChanneler,
          apprenticeAeromancer,
          nascentBlast,
          ...Array.from({ length: 8 }, () => woodlandSquirrels),
        ],
        field: [automatedGardener],
        "main-deck": [woodlandSquirrels],
      },
    },
    playerTwo: { champion },
  });
  return { game, champion };
}

/** @covers Nn4NzegwdX-a1 */
describe("Cato, Meadow's Channeler — Class Bonus Empower 2", () => {
  for (const classBonus of [false, true]) {
    it(`Class Bonus=${classBonus}`, () => {
      const { game, champion } = fixture(classBonus);
      const player = game.player("player-one");
      player.activate(catoMeadowsChanneler, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      passEffectsStack(game);
      if (game.state.decision?.kind === "announce-triggered-ability") {
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [player.card(automatedGardener).objectId] },
        });
        passEffectsStack(game);
      }
      const target = game.player("player-two").card(champion);
      player.activate(nascentBlast, {
        targets: { "target-1": [target.objectId] },
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 3)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      passEffectsStack(game);
      expect(
        player.cards(nascentBlast, { zone: classBonus ? "memory" : "graveyard" }),
      ).toHaveLength(1);
    });
  }
});

/** @covers Nn4NzegwdX-a2 */
describe("Cato, Meadow's Channeler — once-per-turn empower counter", () => {
  it("targets another ally on the first empower and does not trigger on the second", () => {
    const { game } = fixture(true);
    const player = game.player("player-one");
    const target = player.card(automatedGardener);
    player.activate(catoMeadowsChanneler, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.counters.buff).toBe(1);
    player.activate(apprenticeAeromancer, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
    expect(game.state.objects[target.objectId]!.counters.buff).toBe(1);
  });
});
