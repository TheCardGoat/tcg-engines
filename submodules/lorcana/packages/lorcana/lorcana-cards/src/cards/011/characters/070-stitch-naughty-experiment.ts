import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchNaughtyExperimentI18n } from "./070-stitch-naughty-experiment.i18n";

export const stitchNaughtyExperiment: CharacterCard = {
  id: "wMm",
  canonicalId: "ci_wMm",
  reprints: ["set11-070"],
  cardType: "character",
  name: "Stitch",
  version: "Naughty Experiment",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 70,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_38185e538f0e444bbffd676c96efd9c9",
    tcgPlayer: 675386,
  },
  text: [
    {
      title: "I DARE YOU!",
      description:
        "{E} — Chosen opposing character gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
  abilities: [
    {
      id: "1hh-1",
      name: "I DARE YOU!",
      cost: {
        exert: true,
      },
      effect: {
        keyword: "Reckless",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "gain-keyword",
        duration: "until-start-of-next-turn",
      },
      type: "activated",
      text: "I DARE YOU! {E} — Chosen opposing character gains Reckless until the start of your next turn.",
    },
  ],
  i18n: stitchNaughtyExperimentI18n,
};
