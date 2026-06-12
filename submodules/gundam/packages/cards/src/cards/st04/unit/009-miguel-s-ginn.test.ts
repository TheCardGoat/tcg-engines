import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, markAsLinkUnit, createMockUnit } from "@tcg/gundam-engine";
import { st04MiguelSGinn009 } from "./009-miguel-s-ginn.ts";

describe("Miguel's Ginn (ST04-009)", () => {
  it("【During Pair】【Destroyed】 draws 1 when you have another Link Unit in play", () => {
    // Card has a `destroyed` trigger gated by `duringPair`
    // + a conditional "another Link Unit" predicate.
    const otherLinkHost = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [st04MiguelSGinn009, otherLinkHost], deck: 3 },
      {},
    );
    const [ginnId, otherId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    if (!ginnId || !otherId) throw new Error("fixture failed");

    // Miguel's Ginn is `duringPair` — pair a pilot. The other unit is
    // marked a Link Unit so the "another Link Unit in play" condition
    // holds at destroy time.
    // biome-ignore lint/suspicious/noExplicitAny: internal pair helper
    (engine.getG() as any).pilotAssignments[ginnId] = `pilot-for-${ginnId}`;
    markAsLinkUnit(engine, otherId);

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });

    engine.destroyUnit(ginnId);

    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore + 1);
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });

  it("【During Pair】【Destroyed】 does NOT draw when there's no other Link Unit in play", () => {
    const engine = GundamTestEngine.create({ play: [st04MiguelSGinn009], deck: 3 }, {});
    const [ginnId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    if (!ginnId) throw new Error("fixture failed");

    // Pair Miguel's Ginn but no other Link Unit on board → conditional
    // `thenDirectives` should not run.
    // biome-ignore lint/suspicious/noExplicitAny: internal pair helper
    (engine.getG() as any).pilotAssignments[ginnId] = `pilot-for-${ginnId}`;

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });

    engine.destroyUnit(ginnId);

    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore);
  });

  it("【During Pair】【Destroyed】 does NOT draw when Miguel's Ginn is not paired", () => {
    // Unpaired → `duringPair` gate fails → effect is not enqueued.
    const otherLinkHost = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [st04MiguelSGinn009, otherLinkHost], deck: 3 },
      {},
    );
    const [ginnId, otherId] = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea");
    if (!ginnId || !otherId) throw new Error("fixture failed");

    markAsLinkUnit(engine, otherId);

    const handBefore = engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE });

    engine.destroyUnit(ginnId);

    expect(engine.getCardCount({ zone: "hand", playerId: PLAYER_ONE })).toBe(handBefore);
  });
});
