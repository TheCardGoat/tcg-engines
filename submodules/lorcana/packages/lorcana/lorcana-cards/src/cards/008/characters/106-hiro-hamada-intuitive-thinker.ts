import type { CharacterCard } from "@tcg/lorcana-types";
import { hiroHamadaIntuitiveThinkerI18n } from "./106-hiro-hamada-intuitive-thinker.i18n";

export const hiroHamadaIntuitiveThinker: CharacterCard = {
  id: "OeW",
  canonicalId: "ci_OeW",
  reprints: ["set8-106"],
  cardType: "character",
  name: "Hiro Hamada",
  version: "Intuitive Thinker",
  inkType: ["emerald", "sapphire"],
  franchise: "Big Hero 6",
  set: "008",
  cardNumber: 106,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6153926b4f794e639c0b628501b8fc1a",
    tcgPlayer: 631418,
  },
  text: [
    {
      title: "LOOK FOR A NEW ANGLE",
      description: "{E} — Ready chosen Floodborn character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "has-classification", classification: "Floodborn" }],
        },
        type: "ready",
      },
      id: "OeW-1",
      name: "LOOK FOR A NEW ANGLE",
      text: "LOOK FOR A NEW ANGLE {E} — Ready chosen Floodborn character.",
      type: "activated",
    },
  ],
  i18n: hiroHamadaIntuitiveThinkerI18n,
};
