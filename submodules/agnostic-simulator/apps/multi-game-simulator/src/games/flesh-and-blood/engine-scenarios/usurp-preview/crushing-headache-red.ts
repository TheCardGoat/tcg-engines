import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/crushing-headache.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/shared/test-recipients";
import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { wreckerRompBlue as wreckerRompBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/wrecker-romp";
import { crushingHeadacheRed as crushingHeadacheRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/crushing-headache";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const bravo = previewCard(bravoRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);
const nimblismBlue = previewCard(nimblismBlueRules);
const snatchRed = previewCard(snatchRedRules);
const wreckerRompBlue = previewCard(wreckerRompBlueRules);
const crushingHeadacheRed = previewCard(crushingHeadacheRedRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-crushing-headache-red",
  label: "Crushing Headache (red)",
  description:
    "boundary: damage below four does not reveal or remove the remaining hand. Crush - When this deals 4 or more damage to a hero, they reveal their arsenal and hand. Destroy all non-attack action cards in their arsenal, and they discard all non-attack action cards in their hand revealed this way.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "crushing-headache-red"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: bravo, hand: [crushingHeadacheRed], resourcePoints: 6, deck: 6 },
      {
        hero: dash,
        hand: [nimblismBlue, brutalAssaultBlue, wreckerRompBlue, snatchRed],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(crushingHeadacheRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([brutalAssaultBlue, wreckerRompBlue, snatchRed]);
    game.helpers.resolveRestOfCombat();
    return matchFromEngine(engine, "usurp-preview-crushing-headache-red");
  },
};
