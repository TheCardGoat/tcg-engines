import { alphaRuthlessLowlife } from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1, CYBERPUNK_P2 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const chooseCardTargetBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "chooseCardTarget",
  label: "Choice - pick a card to play",
  references: [
    "apps/multi-game-simulator/src/games/cyberpunk/engine/__tests__/useInteractionPermission.test.ts",
  ],
  async run(pom) {
    expectEqual("chooseCardTarget phase", await pom.getPhase(), "main");
    expectEqual("chooseCardTarget active player", await pom.getActivePlayerId(), CYBERPUNK_P1);
    await pom.expectBoardMode(CYBERPUNK_P1, "select-target");
    await pom.expectBoardMode(CYBERPUNK_P2, "view");
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");
    await pom.expectHandSize(CYBERPUNK_P1, 3);
    await pom.expectFieldSize(CYBERPUNK_P1, 2);
    await pom.expectHandChoiceEligibleCount(CYBERPUNK_P1, 3);

    const cardToPlay = await pom.getCardInZoneByDefinitionId(
      "hand",
      CYBERPUNK_P1,
      alphaRuthlessLowlife.id,
    );
    await pom.expectHandCardChoiceEligible(CYBERPUNK_P1, cardToPlay.instanceId, true);

    await pom.resolveCardToPlay(cardToPlay.instanceId, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectBoardMode(CYBERPUNK_P1, "select-action");
    await pom.expectHandSize(CYBERPUNK_P1, 2);
    await pom.expectFieldSize(CYBERPUNK_P1, 3);
    await pom.expectEddies(CYBERPUNK_P1, 5);
  },
};
