import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05CagalliYulaAthha083 } from "./083-cagalli-yula-athha.ts";

describe("Cagalli Yula Athha (GD05-083)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05CagalliYulaAthha083);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05CagalliYulaAthha083],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05CagalliYulaAthha083, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  it("returns only a 1 HP enemy Unit when paired", () => {
    const host = createMockUnit();
    const oneHp = createMockUnit({ hp: 1 });
    const twoHp = createMockUnit({ hp: 2 });
    const engine = GundamTestEngine.create(
      {
        hand: [gd05CagalliYulaAthha083],
        play: [host],
        resourceArea: activeResources(3),
      },
      { play: [oneHp, twoHp] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const hostId = p1.getCardsInZone("battleArea")[0]!;
    const [oneHpId, twoHpId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(gd05CagalliYulaAthha083, hostId));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [oneHpId],
    });
    expectSuccess(p1.resolveEffect({ targets: [oneHpId!] }));

    expect(p2.getCardZone(oneHpId!)).toBe(`hand:${PLAYER_TWO}`);
    expect(p2.getCardZone(twoHpId!)).toBe(`battleArea:${PLAYER_TWO}`);
  });
});
