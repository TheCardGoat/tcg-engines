import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd01GundamAerialRebuild067 } from "./067-gundam-aerial-rebuild.ts";
import { gd01MidairModifications121 } from "../command/121-midair-modifications.ts";

describe("Gundam Aerial Rebuild (GD01-067)", () => {
  it("adds a Lv.5-or-lower Command from trash to hand when paired", () => {
    const suletta = createMockPilot({ name: "Suletta Mercury", cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [suletta],
      play: [gd01GundamAerialRebuild067],
      trash: [gd01MidairModifications121],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [cmdId] = p1.getCardsInZone("trash");

    expectSuccess(p1.assignPilot(suletta, gd01GundamAerialRebuild067));

    expect(p1.getCardsInZone("hand")).toContain(cmdId);
  });
});
