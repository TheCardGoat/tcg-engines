import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03GundamKyriosTailUnitFlightMode030 } from "./030-gundam-kyrios-tail-unit-flight-mode.ts";

describe("Gundam Kyrios (Tail Unit Flight Mode) (GD03-030)", () => {
  it("deploys at cost 2 while a friendly (CB) Link Unit is in play", () => {
    const allelujah = createMockPilot({ name: "Allelujah Haptism", cost: 1 });
    const cbUnit = createMockUnit({
      traits: ["cb"],
      linkCondition: "[Allelujah Haptism]",
    });
    const engine = GundamTestEngine.create({
      hand: [allelujah, gd03GundamKyriosTailUnitFlightMode030],
      play: [cbUnit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [cbId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.assignPilot(allelujah, cbId!));
    expectSuccess(p1.deployUnit(gd03GundamKyriosTailUnitFlightMode030));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(3);
    expect(p1.getCardZone(gd03GundamKyriosTailUnitFlightMode030)).toBe(`battleArea:${PLAYER_ONE}`);
  });

  it("requires the printed cost when the friendly (CB) Unit is not a Link Unit", () => {
    const cbUnit = createMockUnit({ traits: ["cb"] });
    const engine = GundamTestEngine.create({
      hand: [gd03GundamKyriosTailUnitFlightMode030],
      play: [cbUnit],
      resourceArea: [...restedResources(1), ...activeResources(2)],
    });

    expectFailure(
      engine.asPlayer(PLAYER_ONE).deployUnit(gd03GundamKyriosTailUnitFlightMode030),
      "INSUFFICIENT_RESOURCES",
    );
  });
});
