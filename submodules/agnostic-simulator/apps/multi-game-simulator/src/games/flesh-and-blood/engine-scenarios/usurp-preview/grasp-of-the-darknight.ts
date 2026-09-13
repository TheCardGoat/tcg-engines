import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/equipment/grasp-of-the-darknight.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { snatchYellow as snatchYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { graspOfTheDarknight as graspOfTheDarknightRules } from "@tcg/flesh-and-blood-cards/cards/equipment/grasp-of-the-darknight";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const chane = previewCard(chaneRules);
const dash = previewCard(dashRules);
const snatchYellow = previewCard(snatchYellowRules);
const graspOfTheDarknight = previewCard(graspOfTheDarknightRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-grasp-of-the-darknight",
  label: "Grasp of the Darknight",
  description:
    "happy: pay {r} and destroy this to Opt 1, create a Runechant, and go again. Action - {r}, destroy this: Opt 1, then create a Runechant token. Go again",
  group: "usurp-preview",
  tags: ["IAR", "preview", "grasp-of-the-darknight"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        arms: [graspOfTheDarknight],
        hand: [],
        deckTop: [snatchYellow],
        deck: 6,
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    Chane.activate(graspOfTheDarknight, { optBottom: 1 });
    game.helpers.resolveUntilIdle();
    return matchFromEngine(engine, "usurp-preview-grasp-of-the-darknight");
  },
};
