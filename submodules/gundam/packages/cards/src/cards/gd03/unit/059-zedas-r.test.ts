import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { gd03ZedasR059 } from "./059-zedas-r.ts";

describe("Zedas R (GD03-059)", () => {
  it("【Attack】 exiles a Vagan from trash and grants a friendly Vagan AP+2 this turn", () => {
    const vaganTrashCard = createMockUnit({ ap: 1, hp: 1, traits: ["vagan"] });
    const friendlyVagan = createMockUnit({ ap: 2, hp: 3, traits: ["vagan"] });
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      {
        play: [gd03ZedasR059, friendlyVagan],
        trash: [vaganTrashCard],
      },
      { play: [{ card: defender, exhausted: true }] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [zedasId, friendlyVaganId] = p1.getCardsInZone("battleArea");
    const [vaganTrashId] = p1.getCardsInZone("trash");
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(zedasId!, defenderId));
    // Auto-fire the optional, then resolve the chained target picks.
    while (engine.getPendingChoice()) {
      expectSuccess(
        p1.resolveEffect({
          optionalAnswers: { 0: true },
          targets: [vaganTrashId!, friendlyVaganId!],
        }),
      );
    }

    // The Vagan trash card was exiled — `exile` moves the card to the
    // shared `removalArea` (no per-player namespace).
    expect(engine.getState().ctx.zones.private.cardIndex[vaganTrashId!]?.zoneKey).toBe(
      "removalArea",
    );
    // A +2 AP modifier was applied to a friendly Vagan unit.
    const mod = findStatModifier(engine, friendlyVaganId!, "ap");
    expect(mod?.modifier).toBe(2);
  });
});
