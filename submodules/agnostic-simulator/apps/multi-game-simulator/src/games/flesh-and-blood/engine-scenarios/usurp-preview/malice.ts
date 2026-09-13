import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/heroes/malice.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { snatchRed as snatchRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { restlessMagisterRed as restlessMagisterRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";

import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const snatchRed = previewCard(snatchRedRules);
const restlessMagisterRed = previewCard(restlessMagisterRedRules);

const malice = previewCard(maliceRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-malice",
  label: "Malice",
  description:
    "happy: a zombie you control dying is banished face-down and creates a Corrupted Corpse. Action - {r}, {t}: Until end of turn, you may play target zombie from your graveyard. Go again\nWhenever a zombie you control dies, banish it face-down and create a Corrupted Corpse in your banished Zone.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "malice"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arena: [restlessMagisterRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Malice = game.as(malice);
    const Dash = game.as(dash);
    const magister = Malice.findCardInZone("arena", restlessMagisterRed);
    Dash.playAttack(snatchRed, { target: magister });
    Malice.defendWith([]);
    Dash.pass();
    Malice.pass();
    Dash.pass();
    Malice.pass();
    Dash.choose("player-2");
    game.untilIdle();
    return matchFromEngine(engine, "usurp-preview-malice");
  },
};
