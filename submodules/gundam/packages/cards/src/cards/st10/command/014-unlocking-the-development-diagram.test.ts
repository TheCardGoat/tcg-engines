import { describe, expect, it } from "vite-plus/test";
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
import { st10UnlockingTheDevelopmentDiagram014 } from "./014-unlocking-the-development-diagram.ts";

const generationUnit = () => createMockUnit({ name: "Generation Unit", traits: ["g generation"] });

describe("Unlocking the Development Diagram (ST10-014)", () => {
  it("pays the printed Lv.4/cost 4 and draws two in normal mode", () => {
    const engine = GundamTestEngine.create({
      hand: [st10UnlockingTheDevelopmentDiagram014],
      resourceArea: activeResources(4),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const commandId = p1.getHand()[0]!;

    expectSuccess(p1.playCommand(commandId, { mode: "normal" }));

    expect(p1.getHand()).toHaveLength(2);
    expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(4);
  });

  it("discards one G Generation Unit, pays two, and draws two in alternate mode", () => {
    const engine = GundamTestEngine.create({
      hand: [st10UnlockingTheDevelopmentDiagram014, generationUnit()],
      resourceArea: activeResources(2),
      deck: 3,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [commandId, discardId] = p1.getHand();

    expectSuccess(p1.playCommand(commandId!, { mode: "alternate", targets: [discardId!] }));

    expect(p1.getCardZone(discardId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getCardZone(commandId!)).toBe(`trash:${PLAYER_ONE}`);
    expect(p1.getHand()).toHaveLength(2);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
  });

  it("rejects alternate mode without the printed discard", () => {
    const engine = GundamTestEngine.create({
      hand: [st10UnlockingTheDevelopmentDiagram014],
      resourceArea: activeResources(2),
    });
    expectFailure(
      engine.asPlayer(PLAYER_ONE).playCommand(st10UnlockingTheDevelopmentDiagram014, {
        mode: "alternate",
      }),
      "WRONG_TARGET_COUNT",
    );
  });

  it("rejects a Unit without G Generation as the alternate cost", () => {
    const engine = GundamTestEngine.create({
      hand: [st10UnlockingTheDevelopmentDiagram014, createMockUnit({ traits: ["zeon"] })],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [commandId, wrongId] = p1.getHand();
    expectFailure(
      p1.playCommand(commandId!, { mode: "alternate", targets: [wrongId!] }),
      "WRONG_TARGET_COUNT",
    );
    expect(p1.getCardZone(wrongId!)).toBe(`hand:${PLAYER_ONE}`);
  });

  it("rejects a non-Unit G Generation card as the alternate cost", () => {
    const engine = GundamTestEngine.create({
      hand: [st10UnlockingTheDevelopmentDiagram014, createMockPilot({ traits: ["g generation"] })],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [commandId, wrongId] = p1.getHand();
    expectFailure(
      p1.playCommand(commandId!, { mode: "alternate", targets: [wrongId!] }),
      "WRONG_TARGET_COUNT",
    );
  });

  it("still requires player Lv.2 in alternate mode", () => {
    const engine = GundamTestEngine.create({
      hand: [st10UnlockingTheDevelopmentDiagram014, generationUnit()],
      resourceArea: activeResources(1),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [commandId, discardId] = p1.getHand();
    expectFailure(
      p1.playCommand(commandId!, { mode: "alternate", targets: [discardId!] }),
      "INSUFFICIENT_RESOURCE_LEVEL",
    );
  });

  it("requires two active Resources in alternate mode", () => {
    const engine = GundamTestEngine.create({
      hand: [st10UnlockingTheDevelopmentDiagram014, generationUnit()],
      resourceArea: restedResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [commandId, discardId] = p1.getHand();
    expectFailure(
      p1.playCommand(commandId!, { mode: "alternate", targets: [discardId!] }),
      "INSUFFICIENT_RESOURCES",
    );
  });

  it("does not discard the cost card when normal payment fails", () => {
    const engine = GundamTestEngine.create({
      hand: [st10UnlockingTheDevelopmentDiagram014, generationUnit()],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [commandId, discardId] = p1.getHand();
    expectFailure(p1.playCommand(commandId!, { mode: "normal" }), "INSUFFICIENT_RESOURCE_LEVEL");
    expect(p1.getCardZone(discardId!)).toBe(`hand:${PLAYER_ONE}`);
  });
});
