import type { CharacterCard } from "@tcg/lorcana-types";
import { drCalicoGreeneyedManI18n } from "./181-dr-calico-green-eyed-man.i18n";

export const drCalicoGreeneyedMan: CharacterCard = {
  id: "XeV",
  canonicalId: "ci_XeV",
  reprints: ["set7-181"],
  cardType: "character",
  name: "Dr. Calico",
  version: "Green-Eyed Man",
  inkType: ["steel"],
  franchise: "Bolt",
  set: "007",
  cardNumber: 181,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f985e42477e649a5af573894d9b0ac74",
    tcgPlayer: 618160,
  },
  text: [
    {
      title: "YOU'RE BEGINNING TO IRK ME",
      description: "While this character has no damage, he gains Resist +2.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      condition: {
        type: "no-damage",
      },
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 2,
      },
      id: "uk6-1",
      name: "YOU'RE BEGINNING TO IRK ME",
      text: "YOU'RE BEGINNING TO IRK ME While this character has no damage, he gains Resist +2.",
      type: "static",
    },
  ],
  i18n: drCalicoGreeneyedManI18n,
};
