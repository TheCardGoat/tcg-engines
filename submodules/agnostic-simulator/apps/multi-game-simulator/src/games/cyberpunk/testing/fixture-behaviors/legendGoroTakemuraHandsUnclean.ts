import { alphaCorpoSecurity, alphaGoroTakemuraHandsUnclean } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

export const legendGoroTakemuraHandsUncleanBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "legendGoroTakemuraHandsUnclean",
  label: "Goro Takemura - Hands Unclean - GO SOLO + BLOCKER",
  references: ["packages/engine/src/cards/alpha/legends/goro-takemura-hands-unclean.test.ts"],
  async run(pom) {
    const goro = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      alphaGoroTakemuraHandsUnclean.id,
    );
    const defender = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );

    await pom.goSolo(goro.instanceId, CYBERPUNK_P1);

    await pom.expectEddies(CYBERPUNK_P1, 1);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, false);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, goro.instanceId, 7);
    await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, goro.instanceId, "goSolo", true);
    await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, goro.instanceId, "blocker", true);

    await pom.attackUnit(goro.instanceId, defender.instanceId, CYBERPUNK_P1);

    const attack = expectDefined("Goro attack state", await pom.getAttackState());
    expectEqual("Goro attack kind", attack.kind, "fight");
    await pom.expectFieldCardSpent(CYBERPUNK_P1, goro.instanceId, true);
  },
};
