import { previewCard } from "../preview-card";
// Preview fixture seeded from src/cards/resources/soul-of-existence-purple.test.ts.
import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash as dashRules } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { chane as chaneRules } from "@tcg/flesh-and-blood-cards/cards/heroes/chane";
import { brutalAssaultBlue as brutalAssaultBlueRules } from "@tcg/flesh-and-blood-cards/cards/shared/test-recipients";

import { soulOfExistencePurple as soulOfExistencePurpleRules } from "@tcg/flesh-and-blood-cards/cards/resources/soul-of-existence-purple";
import { matchFromEngine } from "../runtime";
import type { FabEngineScenario } from "../types";
const dash = previewCard(dashRules);
const chane = previewCard(chaneRules);
const brutalAssaultBlue = previewCard(brutalAssaultBlueRules);

const soulOfExistencePurple = previewCard(soulOfExistencePurpleRules);
export const scenario: FabEngineScenario = {
  id: "usurp-preview-soul-of-existence-purple",
  label: "Soul of Existence (purple)",
  description:
    "happy: pitching this to play a card loses 1{h}. Legendary\nWhen this is pitched, lose 1{h}.",
  group: "usurp-preview",
  tags: ["IAR", "preview", "soul-of-existence-purple"],
  viewerId: "player-1",
  botMode: "pass-only",
  boot() {
    const engine = FabTestEngine.start(
      {
        hero: chane,
        hand: [brutalAssaultBlue, soulOfExistencePurple],
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const game = engine;
    const Chane = game.as(chane);
    Chane.must.pitch(soulOfExistencePurple).playAttack(brutalAssaultBlue);
    game.helpers.resolveRestOfCombat();
    return matchFromEngine(engine, "usurp-preview-soul-of-existence-purple");
  },
};
