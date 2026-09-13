import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockPilot,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { gd02AwakenedPower110 } from "../../gd02/command/110-awakened-power.ts";
import { gd05ForceImpulseGundam064 } from "./064-force-impulse-gundam.ts";

describe("Force Impulse Gundam (GD05-064)", () => {
  it("【Deploy】 from trash recovers only a Pilot whose name includes Shinn Asuka", () => {
    const shinn = createMockPilot({ name: "Shinn Asuka" });
    const other = createMockPilot({ name: "Lunamaria Hawke" });
    const engine = GundamTestEngine.create({
      hand: [gd02AwakenedPower110],
      trash: [gd05ForceImpulseGundam064, shinn, other],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [sourceId, shinnId, otherId] = p1.getCardsInZone("trash");

    expectSuccess(p1.playCommand(gd02AwakenedPower110));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [sourceId],
    });
    expectSuccess(p1.resolveEffect({ targets: [sourceId!] }));
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "targetSelection",
      legalTargetIds: [shinnId],
    });
    expectSuccess(p1.resolveEffect({ targets: [shinnId!] }));

    expect(p1.getCardZone(sourceId!)).toBe(`battleArea:${PLAYER_ONE}`);
    expect(p1.getCardZone(shinnId!)).toBe(`hand:${PLAYER_ONE}`);
    expect(p1.getCardZone(otherId!)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("does not recover a Pilot when deployed from hand instead of trash", () => {
    const shinn = createMockPilot({ name: "Shinn Asuka" });
    const engine = GundamTestEngine.create({
      hand: [gd05ForceImpulseGundam064],
      trash: [shinn],
      resourceArea: activeResources(4),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [shinnId] = p1.getCardsInZone("trash");

    expectSuccess(p1.deployUnit(gd05ForceImpulseGundam064));

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(shinnId!)).toBe(`trash:${PLAYER_ONE}`);
  });
});
