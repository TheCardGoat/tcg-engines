import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { gd03ZakuFourSnakeEyesYetiGq032 } from "./032-zaku-four-snake-eyes-yeti-gq.ts";

describe("Zaku (Four Snake Eyes') [YETI] (GQ) (GD03-032)", () => {
  it("deploys from hand after paying 1 resource", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03ZakuFourSnakeEyesYetiGq032],
      resourceArea: activeResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(gd03ZakuFourSnakeEyesYetiGq032));

    expect(p1.getCardsInZone("battleArea")).toHaveLength(1);
    expect(p1.getHand()).toHaveLength(0);
    expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(1);
  });

  it("stays in hand when its only resource is rested", () => {
    const engine = GundamTestEngine.create({
      hand: [gd03ZakuFourSnakeEyesYetiGq032],
      resourceArea: restedResources(2),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectFailure(p1.deployUnit(gd03ZakuFourSnakeEyesYetiGq032), "INSUFFICIENT_RESOURCES");

    expect(p1.getHand()).toHaveLength(1);
    expect(p1.getCardsInZone("battleArea")).toHaveLength(0);
  });
});
