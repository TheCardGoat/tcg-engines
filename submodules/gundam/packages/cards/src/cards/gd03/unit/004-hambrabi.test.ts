import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Hambrabi004 } from "./004-hambrabi.ts";

describe("Hambrabi (GD03-004)", () => {
  it("【Attack】 rests a chosen enemy Unit (HP ≤ 5) when 2+ other (Titans) Units are in play", () => {
    const titans1 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const titans2 = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    // Battle target gets exhausted so we can attack it; the rest-trigger
    // candidate (`lowHp`) starts ACTIVE so we can prove the directive
    // actually changed its state. `highHp` also starts active and must
    // remain active — it's outside the HP ≤ 5 filter.
    const battleTarget = createMockUnit({ ap: 1, hp: 6 });
    const lowHp = createMockUnit({ ap: 2, hp: 4 });
    const highHp = createMockUnit({ ap: 2, hp: 6 });

    const engine = GundamTestEngine.create(
      { play: [gd03Hambrabi004, titans1, titans2] },
      { play: [{ card: battleTarget, exhausted: true }, lowHp, highHp] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hambrabiId = p1.getCardsInZone("battleArea")[0]!;
    const [battleTargetId, lowHpId, highHpId] = p2.getCardsInZone("battleArea");

    expect(p2.isExhausted(lowHpId!)).toBe(false);
    expect(p2.isExhausted(highHpId!)).toBe(false);

    expectSuccess(p1.enterBattle(hambrabiId, battleTargetId!));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [lowHpId],
    });
    expectSuccess(p1.resolveEffect({ targets: [lowHpId!] }));

    // The directive rested the 4-HP candidate.
    expect(p2.isExhausted(lowHpId!)).toBe(true);
    // The 6-HP enemy is outside the HP ≤ 5 filter — stays active.
    expect(p2.isExhausted(highHpId!)).toBe(false);
  });

  it("【Attack】 does NOT fire when fewer than 2 other (Titans) Units are in play", () => {
    const onlyOneTitan = createMockUnit({ ap: 1, hp: 1, traits: ["titans"] });
    const battleTarget = createMockUnit({ ap: 1, hp: 6 });
    // Candidate starts ACTIVE so we can prove the directive doesn't fire.
    const enemy = createMockUnit({ ap: 2, hp: 4 });

    const engine = GundamTestEngine.create(
      { play: [gd03Hambrabi004, onlyOneTitan] },
      { play: [{ card: battleTarget, exhausted: true }, enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hambrabiId = p1.getCardsInZone("battleArea")[0]!;
    const [battleTargetId, enemyId] = p2.getCardsInZone("battleArea");

    expect(p2.isExhausted(enemyId!)).toBe(false);

    expectSuccess(p1.enterBattle(hambrabiId, battleTargetId!));

    // unitCount gate fails (only 1 other Titans Unit), so the rest directive
    // never fires — the candidate stays active.
    expect(p2.isExhausted(enemyId!)).toBe(false);
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
