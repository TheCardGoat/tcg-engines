import { alphaMantisBlades, alphaVCorporateExile } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "../cyberpunk-simulator-pom";
import { type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const gearAttachToGoSoloLegendBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "gearAttachToGoSoloLegend",
  label: "Mantis Blades - attach to a GO SOLO legend on field",
  references: ["packages/engine/src/cards/alpha/gear/mantis-blades.test.ts"],
  async run(pom) {
    const gear = await pom.getCardInZoneByDefinitionId("hand", CYBERPUNK_P1, alphaMantisBlades.id);
    const goSoloLegend = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaVCorporateExile.id,
    );

    await pom.expectHandSize(CYBERPUNK_P1, 1);
    await pom.expectEddies(CYBERPUNK_P1, 3);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goSoloLegend.instanceId, 8);

    await pom.attachGearFromHand(gear.instanceId, goSoloLegend.instanceId, CYBERPUNK_P1);

    await pom.expectHandSize(CYBERPUNK_P1, 0);
    await pom.expectEddies(CYBERPUNK_P1, 2);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, goSoloLegend.instanceId, 1);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goSoloLegend.instanceId, 10);
  },
};
