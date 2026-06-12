import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  findStatModifier,
} from "@tcg/gundam-engine";
import { gd03InfiltratorPresent111 } from "./111-infiltrator-present.ts";

describe("Infiltrator Present (GD03-111)", () => {
  it("【Main】 gives AP+3 to a friendly Mafty Unit", () => {
    const mafty = createMockUnit({ traits: ["mafty"], ap: 2 });
    const engine = GundamTestEngine.create({
      hand: [gd03InfiltratorPresent111],
      play: [mafty],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03InfiltratorPresent111, { targets: [unitId] }));

    expect(findStatModifier(engine, unitId, "ap")?.modifier).toBe(3);
  });

  it("also works during the action step", () => {
    const mafty = createMockUnit({ traits: ["mafty"], ap: 2 });
    const engine = GundamTestEngine.create({
      hand: [gd03InfiltratorPresent111],
      play: [mafty],
      resourceArea: activeResources(3),
    });
    engine.setPhase("end-phase");
    engine.setStep("action-step");
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd03InfiltratorPresent111, { targets: [unitId] }));

    expect(findStatModifier(engine, unitId, "ap")?.modifier).toBe(3);
  });

  it("cannot target a friendly Unit without the Mafty trait", () => {
    const nonMafty = createMockUnit({ traits: ["aeug"], ap: 2 });
    const engine = GundamTestEngine.create({
      hand: [gd03InfiltratorPresent111],
      play: [nonMafty],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectFailure(
      p1.playCommand(gd03InfiltratorPresent111, { targets: [unitId] }),
      "INVALID_TARGET",
    );
  });
});
