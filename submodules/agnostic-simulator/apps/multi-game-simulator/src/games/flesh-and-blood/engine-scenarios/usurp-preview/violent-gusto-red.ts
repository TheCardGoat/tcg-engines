import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { restBeforeBattleYellow as auraRules } from "@tcg/flesh-and-blood-cards/cards/actions/rest-before-battle";
import { violentGustoRed as gustoRules } from "@tcg/flesh-and-blood-cards/cards/actions/violent-gusto";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const restBeforeBattleYellow = previewCard(auraRules);
const violentGustoRed = previewCard(gustoRules);
const bravo = previewCard(bravoRules);
const dash = previewCard(dashRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-violent-gusto-red",
  label: "Violent Gusto (red)",
  description:
    "Paused at Violent Gusto's optional on-attack trigger with two matching opposing Auras. Accept, choose one Aura, and let the attack hit to return both copies.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "violent-gusto-red", "on-attack", "aura", "choice", "on-hit"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: bravo,
        hand: [violentGustoRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [],
        arena: [restBeforeBattleYellow, restBeforeBattleYellow],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    engine.as(bravo).playAttack(violentGustoRed, { stopAt: "on-attack" });
    return matchFromEngine(engine, "usurp-preview-violent-gusto-red");
  },
};
