import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/actions/banneret-of-swordsmanship.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { boltyn as boltynRules } from "@tcg/flesh-and-blood-cards/cards/heroes/boltyn";
import { crossTheLineRed as crossTheLineRedRules } from "@tcg/flesh-and-blood-cards/cards/actions/cross-the-line";
import { banneretOfSwordsmanshipYellow as banneretOfSwordsmanshipYellowRules } from "@tcg/flesh-and-blood-cards/cards/actions/banneret-of-swordsmanship";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";

const dash = previewCard(dashRules);
const boltyn = previewCard(boltynRules);
const crossTheLineRed = previewCard(crossTheLineRedRules);
const banneretOfSwordsmanshipYellow = previewCard(banneretOfSwordsmanshipYellowRules);

export const scenario: FabEngineScenario = {
  id: "usurp-preview-banneret-of-swordsmanship-yellow",
  label: "Banneret of Swordsmanship (yellow)",
  description:
    "Charging this to soul creates a Flurry token. Solflare - When this is charged to your soul, create a Flurry token.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "banneret-of-swordsmanship-yellow"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: boltyn,
        hand: [crossTheLineRed, banneretOfSwordsmanshipYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Boltyn = engine.as(boltyn);
    Boltyn.playAttack(crossTheLineRed, {
      charge: true,
      chargeCard: banneretOfSwordsmanshipYellow,
    });
    engine.closeCombat();
    return matchFromEngine(engine, "usurp-preview-banneret-of-swordsmanship-yellow");
  },
};
