import { describe, test } from "vite-plus/test";
import { welcomeToNightCityRetailModdedKusanagi } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Modded Kusanagi (Retail) jsdom happy path", () => {
  test("modded Kusanagi (Retail) - ADRENALINE can attack rival directly on played turn", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "unitModdedKusanagiRetail" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const kusanagi = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailModdedKusanagi.id,
      );

      await pom.playCardFromHand(kusanagi.instanceId, CYBERPUNK_P1);
      const kusanagiOnField = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailModdedKusanagi.id,
      );
      expectEqual("Modded Kusanagi played this turn", kusanagiOnField.playedThisTurn, true);

      const directCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "attackRival");
      if (!directCandidates.includes(kusanagiOnField.instanceId)) {
        throw new Error(
          "Expected Modded Kusanagi to be able to attack rival directly on played turn.",
        );
      }

      await pom.attackRival(kusanagiOnField.instanceId, CYBERPUNK_P1);

      const attack = await pom.getAttackState();
      if (!attack) {
        throw new Error("Expected Modded Kusanagi to start a direct attack.");
      }
      expectEqual("Modded Kusanagi attack kind", attack.kind, "direct");
      expectEqual("Modded Kusanagi attack attacker", attack.attackerId, kusanagiOnField.instanceId);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, kusanagiOnField.instanceId, true);
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
