import { describe, expect, it } from "vite-plus/test";
import {
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { passTurnThroughPublicMoves } from "../../../test-helpers/legal-gameplay-test-helpers.ts";
import { gd05GundamHeavyarmsCustomEw079 } from "./079-gundam-heavyarms-custom-ew.ts";

describe("Gundam Heavyarms Custom (EW) (GD05-079)", () => {
  /** @behavioral-proof complete: Activate Main timing, once-per-turn restriction, another G Team/Preventer gate, Lv.4 enemy filter, AP reduction, false branch, and expiry are public. */
  it("【Activate･Main】 with another Preventer gives AP-1 only to an enemy Unit at Lv.4 or lower", () => {
    const companion = createMockUnit({ traits: ["preventer"] });
    const eligible = createMockUnit({ level: 4, ap: 5 });
    const ineligible = createMockUnit({ level: 5, ap: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd05GundamHeavyarmsCustomEw079, companion] },
      { play: [eligible, ineligible] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const [eligibleId, ineligibleId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.activateAbility(sourceId, 0));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [eligibleId],
    });
    expectSuccess(p1.resolveEffect({ targets: [eligibleId!] }));

    expect(p2.getVisibleCard(eligibleId!)?.effectiveAp).toBe(4);
    expect(p2.getVisibleCard(ineligibleId!)?.effectiveAp).toBe(5);
    expectFailure(
      p1.activateAbility(sourceId, 0, { targets: [eligibleId!] }),
      "ABILITY_LIMIT_REACHED",
    );
  });

  it("does not offer an enemy target without another G Team or Preventer Unit", () => {
    const enemy = createMockUnit({ level: 4, ap: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd05GundamHeavyarmsCustomEw079] },
      { play: [enemy] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(sourceId, 0));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });

  it("removes the AP reduction at the end of the activating player's turn", () => {
    const companion = createMockUnit({ traits: ["g team"] });
    const target = createMockUnit({ level: 4, ap: 5 });
    const engine = GundamTestEngine.create(
      { play: [gd05GundamHeavyarmsCustomEw079, companion], deck: 5 },
      { play: [target], deck: 5 },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const sourceId = p1.getCardsInZone("battleArea")[0]!;
    const targetId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.activateAbility(sourceId, 0));
    expectSuccess(p1.resolveEffect({ targets: [targetId] }));
    expect(p2.getVisibleCard(targetId)?.effectiveAp).toBe(4);
    passTurnThroughPublicMoves(engine, PLAYER_ONE);

    expect(p2.getVisibleCard(targetId)?.effectiveAp).toBe(5);
  });
});
