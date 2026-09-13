import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/usurp-the-shadow-throne.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { viserai as viseraiRules } from "@tcg/flesh-and-blood-cards/cards/heroes/viserai";
import { runechant as runechantRules } from "@tcg/flesh-and-blood-cards/cards/tokens/runechant";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { usurpTheShadowThroneBlue as usurpTheShadowThroneBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/usurp-the-shadow-throne";
import { vexingGloombladeBlue as vexingGloombladeBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/vexing-gloomblade";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const viserai = previewCard(viseraiRules);
const runechant = previewCard(runechantRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const snatchRed = previewCard(snatchRedRules);
const usurpTheShadowThroneBlue = previewCard(usurpTheShadowThroneBlueRules);
const vexingGloombladeBlue = previewCard(vexingGloombladeBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-usurp-the-shadow-throne-blue",
  label: "Usurp the Shadow Throne (blue)",
  description:
    "happy: usurping enables the discounted banished play and drains for newly hidden cards. Viserai Specialization\nIf you've usurped this turn, this costs 6{r} less to play and you may play it from your banished zone.\nWhen this hits a hero, turn all cards in their banished zone face-down. They lose X{h} and you gain X{h}, where X is the number of cards turned face-down this way.\nBlood Debt",
  group: "usurp-preview",
  tags: ["IAR", "preview", "usurp-the-shadow-throne-blue"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: viserai,
        hand: [vexingGloombladeBlue],
        arena: [runechant],
        banished: [usurpTheShadowThroneBlue],
        resourcePoints: 10,
        actionPoints: 2,
        life: 10,
        deck: 6,
      },
      {
        hero: dash,
        banished: [
          { card: snatchRed, state: { faceDown: false } },
          { card: nimblismBlue, state: { faceDown: false } },
        ],
        hand: [],
        life: 40,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Viserai = game.as(viserai);
    const Dash = game.as(dash);
    Viserai.must.playAttack(vexingGloombladeBlue);
    game.advanceUntil({ stopAt: "combat-close", entityTargets: "pause" });
    Viserai.targetRequired(Dash);
    game.closeCombat();
    return matchFromEngine(engine, "usurp-preview-usurp-the-shadow-throne-blue");
  },
};
