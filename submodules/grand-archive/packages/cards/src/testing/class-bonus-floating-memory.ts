import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";

import { slateWhetstone } from "../cards/P24/items/slate-whetstone.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";

interface ClassBonusFloatingMemoryExample {
  readonly card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
}

function setup(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  classBonusEnabled: boolean,
): GrandArchiveTestEngine {
  return GrandArchiveTestEngine.startFixture({
    phase: "materialize",
    playerOne: {
      champion: createClassBonusTestChampion(card, classBonusEnabled, "floating-memory"),
      zones: {
        graveyard: [card],
        "material-deck": [slateWhetstone],
      },
    },
    playerTwo: { champion: createClassBonusTestChampion(card, false, "floating-memory") },
  });
}

/** Shared acceptance contract for one printed Class Bonus Floating Memory ability. */
export function proveClassBonusFloatingMemory({ card }: ClassBonusFloatingMemoryExample): void {
  it("pays one memory from the graveyard while Class Bonus is enabled", () => {
    const game = setup(card, true);
    const player = game.player("player-one");
    const floatingCard = player.card(card, { zone: "graveyard" });

    player.materialize(slateWhetstone, {
      floatingMemoryCardIds: [floatingCard.objectId],
    });

    expect(game.state.objects[floatingCard.objectId]?.zone).toBe("banishment");
    expect(game.state.stack.at(-1)?.activationPayment).toEqual([
      {
        objectId: floatingCard.objectId,
        from: "graveyard",
        to: "banishment",
      },
    ]);
  });

  it("cannot pay from the graveyard while Class Bonus is disabled", () => {
    const game = setup(card, false);
    const player = game.player("player-one");
    const floatingCard = player.card(card, { zone: "graveyard" });

    expect(() =>
      player.materialize(slateWhetstone, {
        floatingMemoryCardIds: [floatingCard.objectId],
      }),
    ).toThrow("Selected graveyard card does not have active Floating Memory");
    expect(game.state.objects[floatingCard.objectId]?.zone).toBe("graveyard");
  });
}
