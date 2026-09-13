import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/equipment/danse-macabre.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { invokeOuviaRed as invokeOuviaRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/invoke-ouvia";
import { bravo as bravoRules } from "@tcg/flesh-and-blood-cards/cards/heroes/bravo";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { ash as ashRules } from "@tcg/flesh-and-blood-cards/cards/tokens/ash";
import { stormOfSandikai as stormOfSandikaiRules } from "@tcg/flesh-and-blood-cards/cards/weapons/storm-of-sandikai";
import { danseMacabre as danseMacabreRules } from "@tcg/flesh-and-blood-cards/cards/equipment/danse-macabre";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const invokeOuviaRed = previewCard(invokeOuviaRedRules);
const bravo = previewCard(bravoRules);
const dash = previewCard(dashRules);
const ash = previewCard(ashRules);
const stormOfSandikai = previewCard(stormOfSandikaiRules);
const danseMacabre = previewCard(danseMacabreRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-danse-macabre",
  label: "Danse Macabre",
  description:
    "happy: paying {r}{r} and tapping grants go again then destroys the ally at end phase. Whenever an ally you control enters the arena, you may pay {r}{r} and {t} this. If you do, that ally's first attack this turn gets go again and destroy that ally at the beginning of the end phase.\nBlade Break",
  group: "usurp-preview",
  tags: ["IAR", "preview", "danse-macabre"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: dash,
        legs: [danseMacabre],
        weapon1: [stormOfSandikai],
        arena: [ash],
        hand: [invokeOuviaRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Dromai = game.as(dash);
    const [firstAsh] = Dromai.cardsIn("arena", ash);
    Dromai.play(invokeOuviaRed, { targetInstanceId: firstAsh!.instanceId });
    game.untilIdle({ optionals: "accept", ordering: "listed" });
    return matchFromEngine(engine, "usurp-preview-danse-macabre");
  },
};
