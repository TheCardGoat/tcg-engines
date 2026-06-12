import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03GundamKimarisTrooperTrooperMode080 } from "./080-gundam-kimaris-trooper-trooper-mode.ts";

describe("Gundam Kimaris Trooper (Trooper Mode) (GD03-080)", () => {
  it("【When Linked】 adds a Gjallarhorn Command card from trash to hand", () => {
    const gaelio = createMockPilot({ name: "Gaelio Bauduin" });
    const command = createMockCommand({ traits: ["gjallarhorn"] });
    const engine = GundamTestEngine.create({
      hand: [gaelio],
      play: [gd03GundamKimarisTrooperTrooperMode080],
      trash: [command],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.assignPilot(gaelio, unitId));

    expect(p1.getHand()).toContain(commandId);
  });
});
