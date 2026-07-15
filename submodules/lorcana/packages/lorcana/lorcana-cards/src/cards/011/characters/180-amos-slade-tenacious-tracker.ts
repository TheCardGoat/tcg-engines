import type { CharacterCard } from "@tcg/lorcana-types";
import { alert } from "../../../helpers/abilities/alert";
import { amosSladeTenaciousTrackerI18n } from "./180-amos-slade-tenacious-tracker.i18n";

export const amosSladeTenaciousTracker: CharacterCard = {
  id: "1j8",
  canonicalId: "ci_1j8",
  slug: "lorcana-ci_1j8",
  printings: [
    {
      id: "set11-180",
      artId: "set11-180",
      setCode: "set11",
      collectorNumber: "180",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set11-180"],
  cardType: "character",
  name: "Amos Slade",
  version: "Tenacious Tracker",
  inkType: ["steel"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 180,
  rarity: "common",
  cost: 4,
  strength: 6,
  willpower: 4,
  lore: 1,
  inkable: false,
  abilities: [alert],
  externalIds: {
    lorcast: "crd_da80d9da41e84566969a1c1585dfc75c",
    tcgPlayer: "673738",
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn"],
  i18n: amosSladeTenaciousTrackerI18n,
};
