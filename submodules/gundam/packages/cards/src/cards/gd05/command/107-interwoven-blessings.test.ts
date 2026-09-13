import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd05InterwovenBlessings107 } from "./107-interwoven-blessings.ts";

describe("Interwoven Blessings (GD05-107)", () => {
  it("destroys the first two enemy Shields without exposing a hidden-card choice", () => {
    const engine = GundamTestEngine.create(
      { hand: [gd05InterwovenBlessings107], resourceArea: activeResources(10) },
      {
        baseSection: [createMockBase({ name: "Front Base" })],
        shieldArea: [
          createMockUnit({ name: "First Shield" }),
          createMockUnit({ name: "Second Shield" }),
        ],
      },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.playCommand(gd05InterwovenBlessings107));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p2.getCardsInZone("shieldArea")).toHaveLength(1);
    expect(p2.getCardsInZone("trash")).toHaveLength(2);
    expect(p2.getCardsInZone("baseSection")).toHaveLength(0);
  });
});
