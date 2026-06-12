import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { alphaKiroshiOptics } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("legendViktorOpponentPrivateSearch fixture behavior", () => {
  test("Viktor Vektor - opponent private search in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendViktorOpponentPrivateSearch",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      expectEqual(
        "P1 prompt status during opponent search",
        await pom.getPromptStatus(CYBERPUNK_P1),
        "waiting",
      );
      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      expectEqual(
        "P1 hidden opponent search card count",
        (await pom.getSearchDeckRevealedCardIds(CYBERPUNK_P1)).length,
        0,
      );

      await pom.expectPendingChoiceType(CYBERPUNK_P2, "searchDeck");
      const revealed = await pom.getSearchDeckRevealedCardIds(CYBERPUNK_P2);
      expectEqual("P2 revealed search card count", revealed.length, 5);

      const definitions = await Promise.all(
        revealed.map((cardId) => pom.getCardDefinitionId(cardId)),
      );
      const kiroshiId = revealed[definitions.indexOf(alphaKiroshiOptics.id)];
      if (!kiroshiId) {
        throw new Error("Expected P2 Viktor search to reveal Kiroshi Optics.");
      }

      await pom.resolveSearchDeck([kiroshiId], CYBERPUNK_P2);

      await pom.expectPendingChoiceType(CYBERPUNK_P2, null);
      await pom.expectHandSize(CYBERPUNK_P2, 2);
      expectEqual("P2 deck after private search", await pom.getDeckSize(CYBERPUNK_P2), 38);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
