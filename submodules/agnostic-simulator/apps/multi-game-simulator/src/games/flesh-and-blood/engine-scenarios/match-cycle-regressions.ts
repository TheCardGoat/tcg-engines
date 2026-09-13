import { FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { arakni } from "@tcg/flesh-and-blood-cards/cards/heroes/arakni";
import { moneyWhereYaMouthIsRed } from "@tcg/flesh-and-blood-cards/cards/actions/money-where-ya-mouth-is";
import { enlightenedStrikeRed } from "@tcg/flesh-and-blood-cards/cards/actions/enlightened-strike";
import { codexOfFrailtyYellow } from "@tcg/flesh-and-blood-cards/cards/actions/codex-of-frailty";
import { headJabRed } from "@tcg/flesh-and-blood-cards/cards/actions/head-jab";
import { snatchRed } from "@tcg/flesh-and-blood-cards/cards/actions/snatch";
import { nimblismBlue } from "@tcg/flesh-and-blood-cards/cards/actions/nimblism";
import { previewCard } from "./preview-card";
import { matchFromEngine } from "./runtime";
import type { FabScenarioCollection } from "./types";

export const MATCH_CYCLE_REGRESSION_SCENARIOS: FabScenarioCollection = {
  "money-where-go-again": {
    id: "money-where-go-again",
    label: "Money Where Ya Mouth Is — one action point",
    description:
      "Play Money Where Ya Mouth Is, then Head Jab. Go again must allow the six-power attack from one starting action point.",
    group: "edge",
    tags: ["go-again", "wager", "regression"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      return matchFromEngine(
        FabTestEngine.start(
          {
            hero: previewCard(dash),
            hand: [moneyWhereYaMouthIsRed, headJabRed].map(previewCard),
            actionPoints: 1,
            resourcePoints: 1,
            deck: 6,
          },
          { hero: previewCard(arakni), hand: [], life: 6, deck: 6 },
          { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
        ),
        "money-where-go-again",
      );
    },
  },
  "enlightened-strike-modes": {
    id: "enlightened-strike-modes",
    label: "Enlightened Strike — readable choices",
    description:
      "Play Enlightened Strike, pay its additional cost, and select one of the three printed modes.",
    group: "edge",
    tags: ["modal", "localization", "regression"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      return matchFromEngine(
        FabTestEngine.start(
          {
            hero: previewCard(dash),
            hand: [enlightenedStrikeRed, nimblismBlue].map(previewCard),
            actionPoints: 1,
            deck: 6,
          },
          { hero: previewCard(arakni), hand: [], deck: 6 },
          { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
        ),
        "enlightened-strike-modes",
      );
    },
  },
  "codex-graveyard-choice": {
    id: "codex-graveyard-choice",
    label: "Codex of Frailty — choose from graveyard",
    description:
      "Play Codex from arsenal. Choose one of two graveyard attacks, then discard. The opponent has one eligible attack.",
    group: "edge",
    tags: ["arsenal", "targets", "regression"],
    viewerId: "player-1",
    botMode: "pass-only",
    boot() {
      return matchFromEngine(
        FabTestEngine.start(
          {
            hero: previewCard(arakni),
            arsenal: [previewCard(codexOfFrailtyYellow)],
            hand: [previewCard(nimblismBlue)],
            graveyard: [snatchRed, headJabRed].map(previewCard),
            actionPoints: 1,
            deck: 6,
          },
          {
            hero: previewCard(dash),
            hand: [previewCard(nimblismBlue)],
            graveyard: [previewCard(snatchRed)],
            deck: 6,
          },
          { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
        ),
        "codex-graveyard-choice",
      );
    },
  },
};
