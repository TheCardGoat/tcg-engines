import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd05Dijeh008 } from "./008-dijeh.ts";

describe("Dijeh (GD05-008)", () => {
  it("reduces its hand cost by 2 after a non-blue Newtype Pilot enters play", () => {
    const pilot = createMockPilot({ color: "red", cost: 2, traits: ["newtype"] });
    const host = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [pilot, gd05Dijeh008],
      play: [host],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, hostId));
    expectSuccess(p1.deployUnit(gd05Dijeh008));

    expect(p1.getCardZone(gd05Dijeh008)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("still requires its printed cost 3 without a qualifying Pilot", () => {
    const engine = GundamTestEngine.create({
      hand: [gd05Dijeh008],
      resourceArea: [
        ...activeResources(2),
        ...activeResources(2).map((resource) => ({ ...resource, exhausted: true })),
      ],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd05Dijeh008), "INSUFFICIENT_RESOURCES");
    expect(p1.getCardZone(gd05Dijeh008)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("does not reduce its cost for a blue Newtype Pilot", () => {
    const pilot = createMockPilot({ color: "blue", cost: 0, traits: ["newtype"] });
    const host = createMockUnit({ hp: 5 });
    const engine = GundamTestEngine.create({
      hand: [pilot, gd05Dijeh008],
      play: [host],
      resourceArea: [
        ...activeResources(2),
        ...activeResources(2).map((resource) => ({ ...resource, exhausted: true })),
      ],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const hostId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(pilot, hostId));
    expectFailure(p1.deployUnit(gd05Dijeh008), "INSUFFICIENT_RESOURCES");
  });
});
