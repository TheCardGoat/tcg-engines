import { alphaCorpoSecurity, alphaVCorporateExile } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
  type CyberpunkFixtureBehavior,
} from "./cyberpunk-fixture-behavior";

export const legendVCorporateExileBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "legendVCorporateExile",
  label: "V - Corporate Exile - GO SOLO",
  references: ["packages/engine/src/cards/alpha/legends/v-corporate-exile.test.ts"],
  async run(pom) {
    const v = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      alphaVCorporateExile.id,
    );
    const defender = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );

    await pom.expectEddies(CYBERPUNK_P1, 6);
    await pom.goSolo(v.instanceId, CYBERPUNK_P1);

    await pom.expectEddies(CYBERPUNK_P1, 1);
    await pom.expectFieldSize(CYBERPUNK_P1, 2);
    await pom.expectFieldCardSpent(CYBERPUNK_P1, v.instanceId, false);
    await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, v.instanceId, 8);
    await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, v.instanceId, "goSolo", true);

    await pom.attackUnit(v.instanceId, defender.instanceId, CYBERPUNK_P1);

    const attack = expectDefined("V attack state", await pom.getAttackState());
    expectEqual("V attack kind", attack.kind, "fight");
    await pom.expectFieldCardSpent(CYBERPUNK_P1, v.instanceId, true);
  },
};
