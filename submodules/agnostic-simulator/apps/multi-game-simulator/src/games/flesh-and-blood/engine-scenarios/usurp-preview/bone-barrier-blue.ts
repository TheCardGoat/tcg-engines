import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/defense-reactions/bone-barrier.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { kassai as kassaiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/kassai";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { gravyBones as gravyBonesRules } from "@tcg/flesh-and-blood-cards/cards/heroes/gravy-bones";
import { barnacleYellow as barnacleYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/barnacle";
import { boneBarrierBlue as boneBarrierBlueRules } from "@tcg/flesh-and-blood-cards/cards/defense-reactions/bone-barrier";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const kassai = previewCard(kassaiRules);
const snatchRed = previewCard(snatchRedRules);
const gravyBones = previewCard(gravyBonesRules);
const barnacleYellow = previewCard(barnacleYellowRules);
const boneBarrierBlue = previewCard(boneBarrierBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-bone-barrier-blue",
  label: "Bone Barrier (blue)",
  description:
    "happy: discarding an ally gives the defending barrier +2{d}. When this defends, you may destroy an ally you control or discard an ally. If you do, this gets +2{d}.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "bone-barrier-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: kassai,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: gravyBones,
        hand: [boneBarrierBlue, barnacleYellow],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Kassai = game.as(kassai);
    const Gravy = game.as(gravyBones);
    Kassai.playAttack(snatchRed);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    Gravy.defendWith();
    game.toReaction("defender");
    Gravy.must.playReaction(boneBarrierBlue);
    game.passBoth();
    game.passBoth();
    Gravy.accept();
    Gravy.choose("discard");
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    return matchFromEngine(engine, "usurp-preview-bone-barrier-blue");
  },
};
