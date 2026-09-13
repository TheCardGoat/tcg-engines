import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/embrace-ursur.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";

import { boundingDemigonBlue as boundingDemigonBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/bounding-demigon";

import { embraceUrsurRed as embraceUrsurRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/embrace-ursur";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);

const boundingDemigonBlue = previewCard(boundingDemigonBlueRules);

const embraceUrsurRed = previewCard(embraceUrsurRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-embrace-ursur-red",
  label: "Embrace Ursur (red)",
  description:
    "Printed ability and its legal choices. When this attacks, you may banish a card from your hand. If it's Runeblade, create a Runechant token. If it's Shadow, this gets go again.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "embrace-ursur-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const card = embraceUrsurRed;
    const choice = { card: boundingDemigonBlue };

    const engine = FabTestEngine.start(
      { hero: chane, hand: [card, choice.card], resourcePoints: 4, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(chane);
    player.play(card);
    game.advanceUntil({ stopAt: "defend", optionals: "accept", entityTargets: "maximum" });
    return matchFromEngine(engine, "usurp-preview-embrace-ursur-red");
  },
};
