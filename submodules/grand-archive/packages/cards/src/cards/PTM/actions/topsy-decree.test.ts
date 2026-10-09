import { describe, expect, it } from "vitest";
import {
  GrandArchiveTestEngine,
  grandArchiveObjectActiveKeywords,
} from "@tcg/grand-archive-engine/testing";
import { topsyDecree } from "./topsy-decree.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";

/** @covers Byx6iokcT4-a1 */
describe("Topsy Decree — Imbue", () => {
  proveImbueKeyword({
    card: topsyDecree,
    cost: { kind: "reserve", amount: 3 },
    threshold: 3,
    requirement: "source-elements",
  });
});

describe("Topsy Decree — optional opponent", () => {
  it("can omit its discard target while granting spellshroud", () => {
    const champion = createClassBonusTestChampion(topsyDecree, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: { champion, zones: { hand: Array.from({ length: 4 }, () => topsyDecree) } },
      playerTwo: { champion, zones: { hand: [topsyDecree] } },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const [source, ...payments] = p.cards(topsyDecree, { zone: "hand" });
    p.activate(source!, {
      modeIds: ["spellshroud", "discard"],
      revealForImbue: true,
      reservePayment: payments.map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "discarding-opponent": [] },
    });
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
    expect(q.cards(topsyDecree, { zone: "hand" })).toHaveLength(1);
    expect(
      grandArchiveObjectActiveKeywords(
        game.program,
        game.state,
        game.state.objects[p.card(champion).objectId]!,
      ),
    ).toContainEqual({ name: "spellshroud" });
  });
});
