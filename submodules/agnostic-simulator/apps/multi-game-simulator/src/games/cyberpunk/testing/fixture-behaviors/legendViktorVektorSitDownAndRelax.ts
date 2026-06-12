import {
  alphaKiroshiOptics,
  alphaMantisBlades,
  alphaViktorVektorSitDownAndRelax,
} from "@tcg/cyberpunk-cards";

import { CYBERPUNK_P1 } from "../cyberpunk-simulator-pom";
import { expectEqual, type CyberpunkFixtureBehavior } from "./cyberpunk-fixture-behavior";

export const legendViktorVektorSitDownAndRelaxBehavior: CyberpunkFixtureBehavior = {
  scenarioId: "legendViktorVektorSitDownAndRelax",
  label: "Viktor Vektor - call searches top deck for gear",
  references: ["packages/engine/src/cards/alpha/legends/viktor-vektor-sit-down-and-relax.test.ts"],
  async run(pom) {
    const viktor = await pom.getCardInZoneByDefinitionId(
      "legendArea",
      CYBERPUNK_P1,
      alphaViktorVektorSitDownAndRelax.id,
    );

    await pom.callLegend(viktor.instanceId, CYBERPUNK_P1);

    const calledViktor = await pom.getCardInZoneByInstanceId(
      "legendArea",
      CYBERPUNK_P1,
      viktor.instanceId,
    );
    expectEqual("Viktor is face-up", calledViktor.faceDown, false);
    await pom.expectEddies(CYBERPUNK_P1, 2);
    await pom.expectPendingChoiceType(CYBERPUNK_P1, "searchDeck");

    const revealed = await pom.getSearchDeckRevealedCardIds(CYBERPUNK_P1);
    expectEqual("Viktor reveal count", revealed.length, 5);
    const revealedDefinitions = await Promise.all(
      revealed.map((cardId) => pom.getCardDefinitionId(cardId)),
    );
    const selected = [
      revealed[revealedDefinitions.indexOf(alphaKiroshiOptics.id)]!,
      revealed[revealedDefinitions.indexOf(alphaMantisBlades.id)]!,
    ];
    if (selected.some((cardId) => !cardId)) {
      throw new Error("Expected Viktor search to reveal Kiroshi Optics and Mantis Blades.");
    }

    await pom.resolveSearchDeck(selected, CYBERPUNK_P1);

    await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
    await pom.expectHandSize(CYBERPUNK_P1, 3);
    expectEqual("Viktor deck after selecting two gear", await pom.getDeckSize(CYBERPUNK_P1), 37);
  },
};
