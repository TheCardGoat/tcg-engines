import {
  activeResources,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
} from "@tcg/gundam-engine";
import { describe, expect, it } from "vite-plus/test";
import { expectSuppressionAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { eb01PaleRiderGroundHeavyEquipmentType049 } from "./049-pale-rider-ground-heavy-equipment-type.ts";

describe("Pale Rider (Ground Heavy Equipment Type) (EB01-049)", () => {
  it("gains <Suppression> with a friendly G Generation Blocker in play", () => {
    expectSuppressionAbility(eb01PaleRiderGroundHeavyEquipmentType049, {
      friendlyCompanions: [
        createMockUnit({
          traits: ["g generation"],
          keywordEffects: [{ keyword: "Blocker" }],
        }),
      ],
    });
  });

  it("does not gain <Suppression> without a friendly G Generation Blocker", () => {
    const engine = GundamTestEngine.create({
      hand: [eb01PaleRiderGroundHeavyEquipmentType049],
      resourceArea: activeResources(6),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.deployUnit(eb01PaleRiderGroundHeavyEquipmentType049));
    const sourceId = p1.getCardsInZone("battleArea")[0]!;

    expect(p1.getVisibleCard(sourceId)?.keywords).not.toContain("Suppression");
  });
});
