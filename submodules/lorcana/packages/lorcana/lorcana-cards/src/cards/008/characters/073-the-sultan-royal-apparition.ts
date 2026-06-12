import type { CharacterCard } from "@tcg/lorcana-types";
import { theSultanRoyalApparitionI18n } from "./073-the-sultan-royal-apparition.i18n";
import { vanish } from "../../../helpers/abilities/vanish";

export const theSultanRoyalApparition: CharacterCard = {
  id: "m6L",
  canonicalId: "ci_m6L",
  reprints: ["set8-073"],
  cardType: "character",
  name: "The Sultan",
  version: "Royal Apparition",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 73,
  rarity: "rare",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_34f916796e6844d081bdebaa3f7df182",
    tcgPlayer: 633425,
  },
  text: [
    {
      title: "Vanish",
      description: "(When an opponent chooses this character for an action, banish them.)",
    },
    {
      title: "COMMANDING PRESENCE",
      description:
        "Whenever one of your Illusion characters quests, exert chosen opposing character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "King", "Illusion"],
  abilities: [
    vanish,
    {
      effect: {
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "opponent",
          selector: "chosen",
          zones: ["play"],
        },
        type: "exert",
      },
      id: "nun-2",
      name: "COMMANDING PRESENCE",
      text: "COMMANDING PRESENCE Whenever one of your Illusion characters quests, exert chosen opposing character.",
      trigger: {
        event: "quest",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Illusion",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theSultanRoyalApparitionI18n,
};
