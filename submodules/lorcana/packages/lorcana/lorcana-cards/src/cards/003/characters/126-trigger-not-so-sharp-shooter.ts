import type { CharacterCard } from "@tcg/lorcana-types";
import { triggerNotsosharpShooterI18n } from "./126-trigger-not-so-sharp-shooter.i18n";

export const triggerNotsosharpShooter: CharacterCard = {
  id: "7rS",
  canonicalId: "ci_7rS",
  reprints: ["set3-126"],
  cardType: "character",
  name: "Trigger",
  version: "Not-So-Sharp Shooter",
  inkType: ["ruby"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 126,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_89a33b4b36de4c2a97042cd58ca0e6e5",
    tcgPlayer: 539092,
  },
  text: [
    {
      title: "OLD BETSY",
      description: "Your characters named Nutsy get +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        modifier: 1,
        stat: "lore",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Nutsy",
            },
          ],
        },
        type: "modify-stat",
      },
      id: "125-1",
      name: "OLD BETSY",
      text: "OLD BETSY Your characters named Nutsy get +1 {L}.",
      type: "static",
    },
  ],
  i18n: triggerNotsosharpShooterI18n,
};
