import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { slateWhetstone } from "../cards/P24/items/slate-whetstone.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack } from "./decisions.ts";

/** Unconditional Floating Memory: one chosen graveyard card replaces one random memory payment. */
export function proveFloatingMemory(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): void {
  it("pays one memory before materialization resolves, without needing Class Bonus", () => {
    const champion = createClassBonusTestChampion(card, false, "floating-memory");
    const game = GrandArchiveTestEngine.startFixture({
      phase: "materialize",
      playerOne: {
        champion,
        zones: {
          graveyard: [card],
          memory: [woodlandSquirrels, woodlandSquirrels],
          "material-deck": [slateWhetstone],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const floating = player.card(card, { zone: "graveyard" });
    const material = player.card(slateWhetstone, { zone: "material-deck" });
    const memory = player.zone("memory");
    player.materialize(material, { floatingMemoryCardIds: [floating.objectId] });
    expect(game.state.objects[floating.objectId]!.zone).toBe("banishment");
    expect(player.zone("memory")).toEqual(memory);
    expect(game.state.objects[material.objectId]!.zone).not.toBe("field");
    expect(game.state.stack.at(-1)?.activationPayment).toEqual([
      { objectId: floating.objectId, from: "graveyard", to: "banishment" },
    ]);
    passEffectsStack(game);
    expect(game.state.objects[material.objectId]!.zone).toBe("field");
    expect(game.state.objects[floating.objectId]!.zone).toBe("banishment");
  });

  for (const invalidSource of ["hand", "opponent", "without-keyword"] as const) {
    it(`rejects ${invalidSource} as Floating Memory without consuming the materialization`, () => {
      const champion = createClassBonusTestChampion(card, false, "floating-memory");
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            hand: [card],
            graveyard: [woodlandSquirrels],
            "material-deck": [slateWhetstone],
          },
        },
        playerTwo: { champion, zones: { graveyard: [card] } },
      });
      const player = game.player("player-one");
      const source =
        invalidSource === "opponent"
          ? game.player("player-two").card(card, { zone: "graveyard" })
          : invalidSource === "hand"
            ? player.card(card, { zone: "hand" })
            : player.card(woodlandSquirrels, { zone: "graveyard" });
      const before = game.state.stateVersion;
      expect(() =>
        player.materialize(slateWhetstone, { floatingMemoryCardIds: [source.objectId] }),
      ).toThrow();
      expect(game.state.stateVersion).toBe(before);
      expect(player.zone("banishment")).toHaveLength(0);
      expect(player.zone("material-deck")).toHaveLength(1);
    });
  }
}
