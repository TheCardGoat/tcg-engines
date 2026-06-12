import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03HizackCustom014 } from "./014-hizack-custom.ts";

describe("Hizack Custom (GD03-014)", () => {
  it("deploys at cost 1 when 2 or more Titans Units are in play", () => {
    const titansA = createMockUnit({ traits: ["titans"] });
    const titansB = createMockUnit({ traits: ["titans"] });
    const engine = GundamTestEngine.create({
      hand: [gd03HizackCustom014],
      play: [titansA, titansB],
      resourceArea: [...restedResources(2), ...activeResources(1)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const activeResource = p1.getCardsInZone("resourceArea")[2]!;

    expectSuccess(p1.deployUnit(gd03HizackCustom014));

    expect(engine.getG().exhausted[activeResource]).toBe(true);
    expect(p1.getCardsInZone("battleArea").length).toBe(3);
  });

  it("requires full cost when fewer than 2 Titans Units are in play", () => {
    const titans = createMockUnit({ traits: ["titans"] });
    const engine = GundamTestEngine.create({
      hand: [gd03HizackCustom014],
      play: [titans],
      resourceArea: [...restedResources(2), ...activeResources(1)],
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expect(p1.deployUnit(gd03HizackCustom014).success).toBe(false);
  });
});
