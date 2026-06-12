import { alphaCorpoSecurity, alphaMt0d12Flathead } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const unitMt0d12FlatheadBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "unitMt0d12Flathead",
  label: "MT0D12 Flathead - high Street Cred prevents blocking",
  references: [
    "packages/engine/src/cards/alpha/units/mt0d12-flathead.test.ts",
    "apps/multi-game-simulator/src/games/cyberpunk/engine/fixtures/scenarios/units.ts",
  ],
  async run(pom) {
    const flathead = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P1,
      alphaMt0d12Flathead.id,
    );
    const blocker = await pom.getCardInZoneByDefinitionId(
      "field",
      CYBERPUNK_P2,
      alphaCorpoSecurity.id,
    );

    expectEqual("Flathead Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 8);
    await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, flathead.instanceId, "cantBeBlocked", true);
    await pom.expectFieldCardGrantedRule(CYBERPUNK_P2, blocker.instanceId, "blocker", true);

    const directCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackRival");
    if (!directCandidates.includes(flathead.instanceId)) {
      throw new Error("Expected Flathead to be a direct-attack candidate.");
    }

    await pom.attackRival(flathead.instanceId, CYBERPUNK_P1);
    await pom.resolveAttack(CYBERPUNK_P1);

    const blockers = await pom.getMoveCandidateIds(CYBERPUNK_P2, "useBlocker");
    if (blockers.includes(blocker.instanceId)) {
      throw new Error("Expected Flathead's cantBeBlocked rule to hide blocker candidates.");
    }

    const attack = await pom.getAttackState();
    if (!attack) {
      throw new Error("Expected Flathead direct attack to remain active.");
    }
    expectEqual("Flathead attack kind", attack.kind, "direct");
    expectEqual("Flathead attack step", attack.step, "defensive");
  },
};
