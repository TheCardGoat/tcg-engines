import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { empoweringHarmony } from "../../DOA/actions/empowering-harmony.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { namelessChampionAt } from "../../AMB/champions/nameless-champion-at.ts";
import { morriganLostSpirit } from "../../P23/champions/morrigan-lost-spirit.ts";
import { shiraLostSpirit } from "../../P24/champions/shira-lost-spirit.ts";
import { steadyVerse } from "./steady-verse.ts";

/**
 * @covers sbierp5k1v-a1
 * @covers sbierp5k1v-a2
 */
describe("Steady Verse", () => {
  it("draws the top card into memory, then goes to the graveyard", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: morriganLostSpirit,
        zones: {
          hand: [steadyVerse, woodlandSquirrels, giantTortoise],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion: shiraLostSpirit },
    });
    const player = game.player("player-one");
    const payment = [woodlandSquirrels, giantTortoise].map((card) => ({
      kind: "card" as const,
      cardId: player.card(card, { zone: "hand" }).objectId,
    }));

    player.activate(steadyVerse, { reservePayment: payment });
    expect(game.resolveStackUntilChoice()).toBe("stack-empty");

    // One Squirrel paid reserve and the second was drawn from the deck into memory.
    expect(player.cards(woodlandSquirrels, { zone: "memory" })).toHaveLength(2);
    expect(player.zone("main-deck")).toHaveLength(0);
    expect(player.card(steadyVerse, { zone: "graveyard" }).definitionId).toBe(
      steadyVerse.canonicalId,
    );
    expect(game.state.ruleModifications).toHaveLength(0);
  });

  it("discounts only the next Harmony action when Class Bonus is enabled", () => {
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: morriganLostSpirit,
        lineage: [namelessChampionAt],
        zones: {
          "main-deck": [giantTortoise, giantTortoise],
          hand: [
            steadyVerse,
            empoweringHarmony,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: { champion: shiraLostSpirit },
    });
    const player = game.player("player-one");
    const squirrels = player.cards(woodlandSquirrels, { zone: "hand" });

    player.activate(steadyVerse, {
      reservePayment: squirrels.slice(0, 2).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
    });
    expect(game.resolveStackUntilChoice()).toBe("stack-empty");
    expect(game.state.ruleModifications).toHaveLength(1);

    player.activate(squirrels[2]!);
    expect(game.resolveStackUntilChoice()).toBe("stack-empty");
    expect(game.state.ruleModifications).toHaveLength(1);

    player.activate(empoweringHarmony, {
      reservePayment: [{ kind: "card", cardId: squirrels[3]!.objectId }],
    });
    expect(game.state.stack.at(-1)?.activationPayment).toHaveLength(1);
    expect(game.state.ruleModifications).toHaveLength(0);
  });
});
