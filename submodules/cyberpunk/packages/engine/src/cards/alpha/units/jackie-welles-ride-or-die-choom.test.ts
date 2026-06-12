import { describe, expect, it } from "vite-plus/test";
import { alphaJackieWellesRideOrDieChoom } from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Jackie Welles - Ride Or Die Choom", () => {
  it("gets +2 power for each friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
      gigArea: [
        { dieType: "d4", faceValue: 1 },
        { dieType: "d6", faceValue: 2 },
        { dieType: "d8", faceValue: 3 },
      ],
    });

    const jackie = engine.getCard(alphaJackieWellesRideOrDieChoom, "field", P1);

    expect(getEffectivePower(engine.getState(), jackie.instanceId)).toBe(12);
  });

  it("keeps printed power when there are no friendly Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [{ card: alphaJackieWellesRideOrDieChoom, spent: false }],
      gigArea: [],
    });

    const jackie = engine.getCard(alphaJackieWellesRideOrDieChoom, "field", P1);

    expect(getEffectivePower(engine.getState(), jackie.instanceId)).toBe(6);
  });
});
