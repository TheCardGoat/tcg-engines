import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { obeliskOfArmaments } from "../tokens/obelisk-of-armaments.ts";
import { obeliskOfFabrication } from "../tokens/obelisk-of-fabrication.ts";
import { obeliskOfProtection } from "../tokens/obelisk-of-protection.ts";
import { tonorisGenesisAegis } from "./tonoris-genesis-aegis.ts";

/** @covers ta6qsesw2u-a1 */
describe("tonoris-genesis-aegis — Lineage", () => {
  proveChampionLineage({
    card: tonorisGenesisAegis,
    lineageName: "Tonoris",
    level: 3,
    memoryCost: 3,
  });
});

/** @covers ta6qsesw2u-a2 */
describe("Tonoris, Genesis Aegis — once-per-game Obelisk choices", () => {
  it("offers each unchosen mode once and summons its corresponding token", () => {
    const baseChampion = lineageTestChampion("Tonoris", 0);
    const game = GrandArchiveTestEngine.startFixture({
      definitions: [obeliskOfArmaments, obeliskOfFabrication, obeliskOfProtection],
      playerOne: {
        champion: baseChampion,
        lineage: [
          lineageTestChampion("Tonoris", 1),
          lineageTestChampion("Tonoris", 2),
          tonorisGenesisAegis,
        ],
        zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
      },
      playerTwo: {
        champion: lineageTestChampion("Opponent", 0),
        zones: { "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels) },
      },
    });
    const player = game.player("player-one");
    const choices = [
      ["mode-1", obeliskOfArmaments],
      ["mode-2", obeliskOfFabrication],
      ["mode-3", obeliskOfProtection],
    ] as const;

    for (const [index, [modeId, token]] of choices.entries()) {
      advanceToRecollection(game, "player-one");
      expect(game.state.decision?.kind).toBe("announce-triggered-ability");
      if (index > 0) {
        const previouslyChosenMode = choices[index - 1]![0];
        const before = game.state;
        expect(() =>
          answerDecision(game, "announce-triggered-ability", {
            modeIds: [previouslyChosenMode],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(game, "announce-triggered-ability", { modeIds: [modeId] });
      passEffectsStack(game);
      expect(player.cards(token, { zone: "field" })).toHaveLength(1);
    }

    advanceToRecollection(game, "player-one");
    expect(game.state.decision).toBeNull();
    expect(game.state.stack).toHaveLength(0);
  });
});
