import type { CharacterCard } from "@tcg/lorcana-types";
import { amosSladeTenaciousTrackerI18n } from "./180-amos-slade-tenacious-tracker.i18n";
import { alert } from "../../../helpers/abilities/alert";

export const amosSladeTenaciousTracker: CharacterCard = {
  id: "1j8",
  canonicalId: "ci_1j8",
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
  externalIds: {
    lorcast: "crd_da80d9da41e84566969a1c1585dfc75c",
    tcgPlayer: 673738,
  },
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [alert],
  i18n: amosSladeTenaciousTrackerI18n,
};
