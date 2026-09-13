import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/restless-outlaw.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { restlessOutlawRed as restlessOutlawRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-outlaw";
import { corruptedCorpse as corruptedCorpseRules } from "@tcg/flesh-and-blood-cards/cards/actions/corrupted-corpse";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/brutal-assault";
import { gravyBones as gravyBonesRules } from "@tcg/flesh-and-blood-cards/cards/heroes/gravy-bones";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const restlessOutlawRed = previewCard(restlessOutlawRedRules);
const corruptedCorpse = previewCard(corruptedCorpseRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);
const gravyBones = previewCard(gravyBonesRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-restless-outlaw-red",
  label: "Restless Outlaw (red)",
  description:
    "dying to an attack creates a Corrupted Corpse in its controller's banished zone. When this dies, create a Corrupted Corpse in your banished zone.\nDecay",
  group: "usurp-preview",
  tags: ["IAR", "preview", "restless-outlaw-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, deck: 6 },
      { hero: gravyBones, hand: [], arena: [restlessOutlawRed], deck: [corruptedCorpse] },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    game.as(dash).playAttack(brutalAssaultBlue, {
      target: game.as(gravyBones).findCardInZone("arena", restlessOutlawRed),
    });
    game.closeCombat({ ordering: "listed" });
    return matchFromEngine(engine, "usurp-preview-restless-outlaw-red");
  },
};
