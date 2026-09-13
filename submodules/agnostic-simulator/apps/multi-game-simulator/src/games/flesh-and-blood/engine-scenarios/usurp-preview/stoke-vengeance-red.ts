import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/stoke-vengeance.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { stokeVengeanceRed as stokeVengeanceRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/stoke-vengeance";
import { edgeOfAutumn as edgeOfAutumnRules } from "@tcg/flesh-and-blood-cards/cards/weapons/edge-of-autumn";
import { katsu as katsuRules } from "@tcg/flesh-and-blood-cards/cards/heroes/katsu";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/brutal-assault";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const stokeVengeanceRed = previewCard(stokeVengeanceRedRules);
const edgeOfAutumn = previewCard(edgeOfAutumnRules);
const katsu = previewCard(katsuRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-stoke-vengeance-red",
  label: "Stoke Vengeance (red)",
  description:
    'after Edge of Autumn, go again permits a follow-up attack with plus two power. Combo - If Edge of Autumn was the last attack this combat chain, this gets go again and "When this hits, your next attack this combat chain gets +2{p}."',
  group: "usurp-preview",
  tags: ["IAR", "preview", "stoke-vengeance-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: katsu,
        hand: [stokeVengeanceRed, brutalAssaultBlue],
        weapon1: [edgeOfAutumn],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const player = game.as(katsu);
    player.activateAttack(edgeOfAutumn);
    game.advanceUntil({ stopAt: "resolution", optionals: "decline", ordering: "listed" });
    player.playAttack(stokeVengeanceRed);
    return matchFromEngine(engine, "usurp-preview-stoke-vengeance-red");
  },
};
