import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaStormChaserI18n } from "./042-elsa-storm-chaser.i18n";

export const elsaStormChaser: CharacterCard = {
  id: "pQC",
  canonicalId: "ci_pQC",
  reprints: ["set4-042"],
  cardType: "character",
  name: "Elsa",
  version: "Storm Chaser",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 42,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_178373b0fe2f483b90202bfeb6014e0a",
    tcgPlayer: 547847,
  },
  text: [
    {
      title: "TEMPEST",
      description:
        "{E} — Chosen character gains Challenger +2 and Rush this turn. (They get +2 {S} while challenging. They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "ih5-1",
      name: "TEMPEST",
      text: "TEMPEST {E} — Chosen character gains Challenger +2 and Rush this turn.",
      type: "activated",
    },
  ],
  i18n: elsaStormChaserI18n,
};
