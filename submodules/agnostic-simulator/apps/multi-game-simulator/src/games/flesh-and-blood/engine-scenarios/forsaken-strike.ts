import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "@tcg/flesh-and-blood-cards/cards/heroes/gravy-bones";
import { malice } from "@tcg/flesh-and-blood-cards/cards/heroes/malice";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { forsakenStrikeYellow } from "@tcg/flesh-and-blood-cards/cards/actions/forsaken-strike";
import { restlessCorporalRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-corporal";
import { restlessClericRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-cleric";
import { restlessMagisterRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-magister";
import { cintariSellsword } from "@tcg/flesh-and-blood-cards/cards/tokens/cintari-sellsword";
import { snatchRed } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { previewCard } from "./preview-card";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

export const FORSAKEN_STRIKE_SCENARIOS: FabScenarioCollection = {
  "forsaken-strike-six-rewards": {
    id: "forsaken-strike-six-rewards",
    label: "Forsaken Strike — six rewards and target filters",
    description:
      "Select up to three zombies in your arena, then up to three in your hand. Each paid zombie grants a reward; modes may repeat. Sellsword, Snatch, and opposing zombies cannot pay the costs. Try six power choices for 15 attack, six Gates, or mix in go again for a follow-up Strike.",
    group: "edge",
    tags: ["IAR", "forsaken-strike", "additional-cost", "modal", "targets"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      const zombies = [restlessCorporalRed, restlessClericRed, restlessMagisterRed].map(
        previewCard,
      );
      const engine = FabTestEngine.start(
        {
          hero: previewCard(gravyBones),
          hand: [
            previewCard(forsakenStrikeYellow),
            previewCard(forsakenStrikeYellow),
            ...zombies,
            previewCard(snatchRed),
          ],
          arena: [...zombies, previewCard(cintariSellsword)],
          deck: [],
        },
        {
          hero: previewCard(dash),
          hand: [],
          arena: [previewCard(restlessCorporalRed)],
          life: 30,
          deck: [],
        },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const player = engine.as(gravyBones);
      // The six paid rewards create simultaneous triggered abilities. Fixture
      // engines bypass the practice automation seed, so opt the human seat into
      // trigger-order auto-answering explicitly (the practice product default).
      const preferences = engine.getState().automationPreferences[player.id];
      if (preferences) {
        engine.getState().automationPreferences[player.id] = {
          ...preferences,
          autoOrderTriggers: true,
        };
      }
      engine.playInstance(
        player.id,
        player.cardsIn("hand", forsakenStrikeYellow)[0]!.instanceId,
        {},
        "explicit",
      );
      return matchFromEngine(engine, "forsaken-strike-six-rewards");
    },
  },
  "forsaken-strike-malice": {
    id: "forsaken-strike-malice",
    label: "Forsaken Strike — Malice death versus discard",
    description:
      "Destroy your arena zombie and discard the hand zombie, then choose two rewards. Malice banishes only the destroyed zombie face-down and creates a Corrupted Corpse; the discarded zombie remains in the graveyard. Both paid zombies still grant rewards.",
    group: "edge",
    tags: ["IAR", "forsaken-strike", "malice", "dies", "discard"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      const engine = FabTestEngine.start(
        {
          hero: previewCard(malice),
          hand: [previewCard(forsakenStrikeYellow), previewCard(restlessCorporalRed)],
          arena: [previewCard(restlessCorporalRed)],
          deck: [],
        },
        { hero: previewCard(dash), hand: [], life: 20, deck: [] },
        { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
      );
      const player = engine.as(malice);
      engine.playInstance(
        player.id,
        player.cardIn("hand", forsakenStrikeYellow).instanceId,
        {},
        "explicit",
      );
      return matchFromEngine(engine, "forsaken-strike-malice");
    },
  },
};
