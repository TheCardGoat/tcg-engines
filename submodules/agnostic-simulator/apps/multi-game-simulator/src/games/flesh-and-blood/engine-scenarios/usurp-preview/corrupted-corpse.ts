import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/corrupted-corpse.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { voxNecropolis as voxNecropolisRules } from "@tcg/flesh-and-blood-cards/cards/weapons/vox-necropolis";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { corruptedCorpse as corruptedCorpseRules } from "@tcg/flesh-and-blood-cards/cards/actions/corrupted-corpse";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const voxNecropolis = previewCard(voxNecropolisRules);
const malice = previewCard(maliceRules);
const corruptedCorpse = previewCard(corruptedCorpseRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-corrupted-corpse",
  label: "Corrupted Corpse",
  description:
    "happy: a Vox-granted Corpse attack has go again. Incarnate\nThis card's attacks get go again.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "corrupted-corpse"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: malice,
        weapon1: [voxNecropolis],
        arena: [corruptedCorpse],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(malice);
    Malice.activate(corruptedCorpse);
    game.passBoth();
    return matchFromEngine(engine, "usurp-preview-corrupted-corpse");
  },
};
