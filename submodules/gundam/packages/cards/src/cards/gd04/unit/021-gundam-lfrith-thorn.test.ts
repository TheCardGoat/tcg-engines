import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockResource,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04IndiscriminateViolence106 } from "../command/106-indiscriminate-violence.ts";
import { gd04GundamLfrithThorn021 } from "./021-gundam-lfrith-thorn.ts";

describe("Gundam Lfrith Thorn (GD04-021)", () => {
  it("has its printed keyword effects", () => {
    expect(gd04GundamLfrithThorn021.keywordEffects.map((effect) => effect.keyword)).toEqual([
      "Breach",
    ]);
  });

  it("may pair the EX-paid Dawn of Fold Command from trash with a Gundam Lfrith Unit", () => {
    const resources = [
      ...activeResources(4).map((entry) => ({ ...entry, exhausted: true })),
      { card: createMockResource({ name: "EX Resource" }), exhausted: false },
    ];
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [gd04GundamLfrithThorn021],
      resourceArea: resources,
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const thornId = p1.getCardsInZone("battleArea")[0]!;
    const commandId = p1.getHand()[0]!;
    const exResourceId = p1.getCardsInZone("resourceArea").at(-1)!;
    engine.markAsToken(exResourceId);

    expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [thornId] }));
    expectSuccess(p1.resolveEffect({ targets: [thornId], optionalAnswers: { 0: true } }));

    expect(engine.getG().pilotAssignments[thornId]).toBe(commandId);
    expect(p1.getCardsInZone("battleArea")).toContain(commandId);
  });

  it("does not pair the Command when it was not paid with an EX Resource", () => {
    const engine = GundamTestEngine.create({
      hand: [gd04IndiscriminateViolence106],
      play: [gd04GundamLfrithThorn021],
      resourceArea: activeResources(5),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const thornId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.playCommand(gd04IndiscriminateViolence106, { targets: [thornId] }));

    expect(engine.getG().pilotAssignments[thornId]).toBeUndefined();
  });
});
