import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockCommand,
  createMockPilot,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd02HeartSetOnRevenge118 } from "../../gd02/command/118-heart-set-on-revenge.ts";
import { gd03GundamKimarisTrooperTrooperMode080 } from "./080-gundam-kimaris-trooper-trooper-mode.ts";

describe("Gundam Kimaris Trooper (Trooper Mode) (GD03-080)", () => {
  it("【When Linked】 adds a Gjallarhorn Command card from trash to hand", () => {
    const gaelio = createMockPilot({ name: "Gaelio Bauduin", level: 1, cost: 1 });
    const wrongCommand = createMockCommand({ traits: ["zeon"] });
    const engine = GundamTestEngine.create({
      hand: [gaelio],
      play: [gd03GundamKimarisTrooperTrooperMode080],
      trash: [gd02HeartSetOnRevenge118, wrongCommand],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const [commandId, wrongCommandId] = p1.getCardsInZone("trash");

    expectSuccess(p1.assignPilot(gaelio, unitId));

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [commandId],
    });
    const choice = p1.getBoardView().pendingChoice;
    if (choice?.kind !== "targetSelection") throw new Error("Expected target selection");
    expect(choice.legalTargetIds).not.toContain(wrongCommandId);
    expectSuccess(p1.resolveEffect({ targets: [commandId] }));

    expect(p1.getHand()).toContain(commandId);
  });

  it("does not retrieve a Command while paired but not linked", () => {
    const wrongPilot = createMockPilot({ name: "Ein Dalton", level: 1, cost: 1 });
    const engine = GundamTestEngine.create({
      hand: [wrongPilot],
      play: [gd03GundamKimarisTrooperTrooperMode080],
      trash: [gd02HeartSetOnRevenge118],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getCardsInZone("trash")[0]!;

    expectSuccess(p1.assignPilot(wrongPilot, unitId));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
  });
});
