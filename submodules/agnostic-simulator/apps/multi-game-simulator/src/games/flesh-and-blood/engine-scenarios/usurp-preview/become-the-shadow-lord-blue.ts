import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/become-the-shadow-lord.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";

import { putridStirringsRed as putridStirringsRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/putrid-stirrings";

import { becomeTheShadowLordBlue as becomeTheShadowLordBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/become-the-shadow-lord";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);

const putridStirringsRed = previewCard(putridStirringsRedRules);

const becomeTheShadowLordBlue = previewCard(becomeTheShadowLordBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-become-the-shadow-lord-blue",
  label: "Become the Shadow Lord (blue)",
  description:
    "happy: banishing a Shadow Runeblade creates a Runechant and a Gate to i'Arathael. Banish a card from your hand. If it's Runeblade, create a Runechant token. If it's Shadow, create a Gate to i'Arathael token.\nGo again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "become-the-shadow-lord-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [becomeTheShadowLordBlue, putridStirringsRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    Chane.play(becomeTheShadowLordBlue);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: putridStirringsRed.canonicalId,
    });
    return matchFromEngine(engine, "usurp-preview-become-the-shadow-lord-blue");
  },
};
