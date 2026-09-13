import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05AltronGundamEw073 } from "./073-altron-gundam-ew.ts";

describe("Altron Gundam (EW) (GD05-073)", () => {
  it("【Deploy】 keeps only the chosen rested enemy Unit rested through its next start phase", () => {
    const first = createMockUnit();
    const second = createMockUnit();
    const engine = GundamTestEngine.create(
      {
        hand: [gd05AltronGundamEw073],
        resourceArea: activeResources(7),
        deck: 3,
      },
      {
        play: [
          { card: first, exhausted: true },
          { card: second, exhausted: true },
        ],
        resourceArea: activeResources(1),
        deck: 3,
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const [chosenId, unchosenId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.deployUnit(gd05AltronGundamEw073));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: expect.arrayContaining([chosenId, unchosenId]),
    });
    expectSuccess(p1.resolveEffect({ targets: [chosenId!] }));
    expectSuccess(p1.passPhase());
    expectSuccess(p2.passActionStep());
    expectSuccess(p1.passActionStep());

    expect(p2.isExhausted(chosenId!)).toBe(true);
    expect(p2.isExhausted(unchosenId!)).toBe(false);
  });
});
