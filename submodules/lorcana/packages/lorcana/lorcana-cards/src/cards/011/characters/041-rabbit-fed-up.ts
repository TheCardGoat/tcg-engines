import type { CharacterCard } from "@tcg/lorcana-types";
import { rabbitFedUpI18n } from "./041-rabbit-fed-up.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const rabbitFedUp: CharacterCard = {
  id: "8cq",
  canonicalId: "ci_8cq",
  reprints: ["set11-041"],
  cardType: "character",
  name: "Rabbit",
  version: "Fed Up",
  inkType: ["amethyst"],
  franchise: "Winnie the Pooh",
  set: "011",
  cardNumber: 41,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_260df0802696480898a5d7f6634c5a43",
    tcgPlayer: 673408,
  },
  text: "Challenger +3",
  classifications: ["Storyborn", "Ally"],
  abilities: [challenger(3)],
  i18n: rabbitFedUpI18n,
};
