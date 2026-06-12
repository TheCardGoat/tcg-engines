import { spoilerRoycePsychoOnTheEdge } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const legendRoycePsychoOnTheEdgeBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "legendRoycePsychoOnTheEdge",
  label: "Royce - Psycho on the Edge - gear-scaled GO SOLO",
  references: ["packages/engine/src/cards/spoiler/legends/royce-psycho-on-the-edge.test.ts"],
  async run(pom) {
    const royce = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      spoilerRoycePsychoOnTheEdge.id,
    );

    const legendView = await pom.getCardView(royce.instanceId, CYBERPUNK_P1);
    expectEqual("Royce legend effective power before GO SOLO", legendView.effectivePower, 13);
    expectEqual("Royce legend attached gear count", legendView.attachedGearIds.length, 2);

    await pom.goSolo(royce.instanceId, CYBERPUNK_P1);

    await pom.expectEddies(CYBERPUNK_P1, 2);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, royce.instanceId, false);
    await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, royce.instanceId, 2);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, royce.instanceId, 13);
    await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, royce.instanceId, "goSolo", true);
  },
};
