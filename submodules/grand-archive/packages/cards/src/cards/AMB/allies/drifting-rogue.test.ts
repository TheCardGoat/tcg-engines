import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { driftingRogue } from "./drifting-rogue.ts";

/** @covers awj9it7shv-a2 */
describe("Drifting Rogue — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: driftingRogue });
});

/** @covers awj9it7shv-a1 */
describe("Drifting Rogue — On Enter preparation", () => {
  it("puts a preparation counter on the champion only after the entry trigger resolves", () => {
    const champion = createClassBonusTestChampion(driftingRogue, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { hand: [driftingRogue, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ownChampion = player.card(champion, { zone: "field" });
    player.activate(driftingRogue, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    player.pass();
    opponent.pass();
    expect(player.cards(driftingRogue, { zone: "field" })).toHaveLength(1);
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "awj9it7shv-a1",
      ),
    ).toBe(true);
    expect(game.state.objects[ownChampion.objectId]!.counters.preparation ?? 0).toBe(0);
    passEffectsStack(game);
    expect(game.state.objects[ownChampion.objectId]!.counters.preparation).toBe(1);
    expect(game.state.objects[opponent.card(champion).objectId]!.counters.preparation ?? 0).toBe(0);
  });
});
