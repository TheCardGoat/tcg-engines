import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/darkest-hour.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/brutal-assault";

import { boundingDemigonBlue as boundingDemigonBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/bounding-demigon";
import { darkestHourBlue as darkestHourBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/darkest-hour";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);
const boundingDemigonBlue = previewCard(boundingDemigonBlueRules);
const darkestHourBlue = previewCard(darkestHourBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-darkest-hour-blue",
  label: "Darkest Hour (blue)",
  description:
    "Printed ability and its legal choices. You may put a card from your hand on top of your deck rather than pay this card's {r} cost.\nYour next Shadow attack this turn gets +1{p}. Go again\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "darkest-hour-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const card = darkestHourBlue;
    const shadow = true;
    const attack = shadow ? boundingDemigonBlue : brutalAssaultBlue;
    const engine = FabTestEngine.start(
      { hero: chane, hand: [card, attack], resourcePoints: 8, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(chane);
    player.play(card);
    game.untilIdle({ optionals: "decline" });
    player.playAttack(attack);
    return matchFromEngine(engine, "usurp-preview-darkest-hour-blue");
  },
};
