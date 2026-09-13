import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/equipment/reach-of-the-abyss.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { reachOfTheAbyss as reachOfTheAbyssRules } from "@tcg/flesh-and-blood-cards/cards/equipment/reach-of-the-abyss";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/brutal-assault";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const reachOfTheAbyss = previewCard(reachOfTheAbyssRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);
const malice = previewCard(maliceRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-reach-of-the-abyss",
  label: "Reach of the Abyss",
  description:
    "Printed ability and its legal choices. When the combat chain closes, if this defended, banish all defending cards.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "reach-of-the-abyss"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const defend = true;

    const engine = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, deck: 6 },
      { hero: malice, hand: [brutalAssaultBlue], arms: [reachOfTheAbyss], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const defender = game.as(malice);
    game.as(dash).playAttack(brutalAssaultBlue);
    if (defend) defender.defendWith(reachOfTheAbyss, brutalAssaultBlue);
    else defender.defendWith(brutalAssaultBlue);
    game.closeCombat();
    return matchFromEngine(engine, "usurp-preview-reach-of-the-abyss");
  },
};
