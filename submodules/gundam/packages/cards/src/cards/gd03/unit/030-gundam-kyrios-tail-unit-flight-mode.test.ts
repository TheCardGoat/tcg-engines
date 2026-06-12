import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  markAsLinkUnit,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03GundamKyriosTailUnitFlightMode030 } from "./030-gundam-kyrios-tail-unit-flight-mode.ts";

describe("Gundam Kyrios (Tail Unit Flight Mode) (GD03-030)", () => {
  it("deploys at cost 2 while a friendly (CB) Link Unit is in play", () => {
    const cbUnit = createMockUnit({ traits: ["cb"] });
    const engine = GundamTestEngine.create({
      hand: [gd03GundamKyriosTailUnitFlightMode030],
      play: [cbUnit],
      resourceArea: [...restedResources(1), ...activeResources(2)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [cbId] = p1.getCardsInZone("battleArea");
    markAsLinkUnit(engine, cbId!);

    expectSuccess(p1.deployUnit(gd03GundamKyriosTailUnitFlightMode030));

    expect(p1.getCardsInZone("battleArea").length).toBe(2);
  });

  it("requires the printed cost when the friendly (CB) Unit is not a Link Unit", () => {
    const cbUnit = createMockUnit({ traits: ["cb"] });
    const engine = GundamTestEngine.create({
      hand: [gd03GundamKyriosTailUnitFlightMode030],
      play: [cbUnit],
      resourceArea: [...restedResources(1), ...activeResources(2)],
    });

    const result = engine.asPlayer(PLAYER_ONE).deployUnit(gd03GundamKyriosTailUnitFlightMode030);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("INSUFFICIENT_RESOURCES");
    }
  });
});
