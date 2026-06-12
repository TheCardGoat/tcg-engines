import { describe, it, expect } from "vite-plus/test";
import { GundamTestEngine, PLAYER_ONE, expectSuccess, activeResources } from "@tcg/gundam-engine";
import { betaWingGundamBirdMode002 } from "./002-wing-gundam-bird-mode.ts";

describe("Wing Gundam (Bird Mode) (ST02-002)", () => {
  it("【Deploy】 moves the played unit into resourceArea (EX Resource token primitive pending)", () => {
    const engine = GundamTestEngine.create({
      hand: [betaWingGundamBirdMode002],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const resourcesBefore = p1.getCardsInZone("resourceArea").length;

    expectSuccess(p1.deployUnit(betaWingGundamBirdMode002));

    // NOTE: `placeResource` moves the source card (Wing Gundam Bird Mode
    // itself) into the resource area, so the resourceArea grows by 1 — but
    // the unit does not remain in the battle area. This matches the
    // executor's current "place-self-as-resource" behaviour; the card text
    // intends a separate EX token, which is not yet wired (same family of
    // blockers as 107-first-contact; see docs/card-delegations/beta.md).
    expect(p1.getCardsInZone("resourceArea").length).toBe(resourcesBefore + 1);
  });
});
