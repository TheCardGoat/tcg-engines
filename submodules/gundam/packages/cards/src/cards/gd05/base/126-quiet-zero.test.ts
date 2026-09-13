import { describe, expect, it } from "vite-plus/test";
import {
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { expectBaseBurstAndDeployAbilities } from "../../../test-helpers/base-behavior-test-helpers.ts";
import { gd05QuietZero126 } from "./126-quiet-zero.ts";

describe("Quiet Zero (GD05-126)", () => {
  it("executes its Burst deployment and Deploy Shield ability", () => {
    expectBaseBurstAndDeployAbilities(gd05QuietZero126);
  });

  it('requires a Lv.5+ Unit named "Gundam Aerial" before deploying its Gundnode token', () => {
    const eligibleAerial = createMockUnit({ name: "Gundam Aerial Rebuild", level: 5 });
    const lowLevelAerial = createMockUnit({ name: "Gundam Aerial", level: 4 });
    const engine = GundamTestEngine.create(
      {
        baseSection: [gd05QuietZero126],
        play: [eligibleAerial, lowLevelAerial],
        resourceArea: activeResources(2),
      },
      {},
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const baseId = p1.getCardsInZone("baseSection")[0]!;

    expectSuccess(p1.activateBaseAbility(baseId));
    expect(p1.getCardsInZone("battleArea")).toHaveLength(3);

    const noEligibleEngine = GundamTestEngine.create(
      {
        baseSection: [gd05QuietZero126],
        play: [lowLevelAerial],
        resourceArea: activeResources(2),
      },
      {},
    );
    const noEligibleP1 = noEligibleEngine.asPlayer(PLAYER_ONE);
    const noEligibleBaseId = noEligibleP1.getCardsInZone("baseSection")[0]!;

    expectFailure(noEligibleP1.activateBaseAbility(noEligibleBaseId), "CONDITIONS_NOT_MET");
  });
});
