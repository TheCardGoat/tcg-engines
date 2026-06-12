import type { CharacterCard } from "@tcg/lorcana-types";
import { doloresMadrigalHearsEverythingI18n } from "./009-dolores-madrigal-hears-everything.i18n";

export const doloresMadrigalHearsEverything: CharacterCard = {
  id: "t3K",
  canonicalId: "ci_t3K",
  reprints: ["set12-009"],
  cardType: "character",
  name: "Dolores Madrigal",
  version: "Hears Everything",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 9,
  rarity: "common",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_01acad281686403cabf7d98f5026bc7a",
  },
  text: [
    {
      title: "NO SECRETS",
      description: "When you play this character, look at chosen opponent's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "t3K-1",
      name: "NO SECRETS",
      text: "NO SECRETS When you play this character, look at chosen opponent's hand.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "reveal-hand",
        target: "OPPONENT",
      },
    },
  ],
  i18n: doloresMadrigalHearsEverythingI18n,
};
