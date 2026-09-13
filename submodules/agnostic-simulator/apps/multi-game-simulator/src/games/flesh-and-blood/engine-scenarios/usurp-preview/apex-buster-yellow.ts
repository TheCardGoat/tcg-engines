import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/apex-buster.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { rhinar as rhinarRules } from "@tcg/flesh-and-blood-cards/cards/heroes/rhinar";
import { apexBusterYellow as apexBusterYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/apex-buster";

import { nimblismBlue as nimblismBlueRules } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";

import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const rhinar = previewCard(rhinarRules);
const apexBusterYellow = previewCard(apexBusterYellowRules);

const nimblismBlue = previewCard(nimblismBlueRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-apex-buster-yellow",
  label: "Apex Buster (yellow)",
  description:
    "happy: the instant destroys the card defending the 6{p} attack. Instant - {r}{r}, discard this: Destroy target card that is defending an attack you control with 6 or more base {p}.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "apex-buster-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [apexBusterYellow, apexBusterYellow],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Rhinar = game.as(rhinar);
    game.as(dash);
    Rhinar.playAttack(apexBusterYellow);
    return matchFromEngine(engine, "usurp-preview-apex-buster-yellow");
  },
};
