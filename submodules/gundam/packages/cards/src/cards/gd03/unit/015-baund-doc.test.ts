import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  expectSuccess,
  getEffectiveStats,
} from "@tcg/gundam-engine";
import { gd03BaundDoc015 } from "./015-baund-doc.ts";

describe("Baund Doc (GD03-015)", () => {
  it("【Activate･Main】 exiles 3 (Titans) from trash, then this Unit gains <Breach 4> this turn", () => {
    const titans1 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const titans2 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const titans3 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });

    const engine = GundamTestEngine.create({
      play: [gd03BaundDoc015],
      trash: [titans1, titans2, titans3],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baundDocId = p1.getCardsInZone("battleArea")[0]!;
    const trashIds = p1.getCardsInZone("trash");
    const framework = engine.getRuntime().getFrameworkReadAPI();

    // Before activating: no Breach keyword.
    expect(
      getEffectiveStats(baundDocId, engine.getG(), framework.cards, framework).keywords,
    ).not.toContain("Breach");

    expectSuccess(p1.activateAbility(baundDocId, 0, { targets: trashIds }));

    // Trash emptied (all 3 Titans exiled).
    expect(p1.getCardsInZone("trash")).toHaveLength(0);
    // Baund Doc now has Breach.
    expect(
      getEffectiveStats(baundDocId, engine.getG(), framework.cards, framework).keywords,
    ).toContain("Breach");
  });
});
