import { previewCard } from "../preview-card";
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { restlessMagisterRed as magisterRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { restlessTemplarRed as templarRules } from "@tcg/flesh-and-blood-cards/cards/actions/restless-templar";
import { snatchRed as snatchRules } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { malice as maliceRules } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const restlessMagisterRed = previewCard(magisterRules);
const restlessTemplarRed = previewCard(templarRules);
const snatchRed = previewCard(snatchRules);
const dash = previewCard(dashRules);
const malice = previewCard(maliceRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-restless-templar-red",
  label: "Restless Templar (red)",
  description:
    "A controlled Zombie with Decay has died, leaving Restless Templar in the arena and creating Gate to i'Arathael.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "restless-templar-red", "ally", "decay", "gate-to-i-arathael"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: malice, arena: [restlessTemplarRed, restlessMagisterRed], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const attacker = engine.as(dash);
    const defender = engine.as(malice);
    attacker.playAttack(snatchRed, {
      target: defender.findCardInZone("arena", restlessMagisterRed),
    });
    defender.defendWith([]);
    attacker.pass();
    defender.pass();
    attacker.pass();
    defender.pass();
    attacker.choose("player-2");
    engine.untilIdle({ ordering: "listed" });
    return matchFromEngine(engine, "usurp-preview-restless-templar-red");
  },
};
