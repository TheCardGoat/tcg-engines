import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanInjuredSoldierI18n } from "./116-mulan-injured-soldier.i18n";

export const mulanInjuredSoldier: CharacterCard = {
  id: "sfy",
  canonicalId: "ci_Z2S",
  reprints: ["set4-116", "set9-125"],
  cardType: "character",
  name: "Mulan",
  version: "Injured Soldier",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 116,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2acf4a3090844ac6a8e091f806c28aed",
    tcgPlayer: 650060,
  },
  text: [
    {
      title: "BATTLE WOUND",
      description: "This character enters play with 2 damage.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        amount: 2,
        type: "enters-with-damage",
      },
      id: "1g0-1",
      name: "BATTLE WOUND",
      text: "BATTLE WOUND This character enters play with 2 damage.",
      type: "static",
    },
  ],
  i18n: mulanInjuredSoldierI18n,
};
