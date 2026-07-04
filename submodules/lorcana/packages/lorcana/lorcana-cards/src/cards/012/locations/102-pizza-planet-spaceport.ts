import type { LocationCard } from "@tcg/lorcana-types";
import { pizzaPlanetSpaceportI18n } from "./102-pizza-planet-spaceport.i18n";

export const pizzaPlanetSpaceport: LocationCard = {
  id: "59B",
  canonicalId: "ci_59B",
  slug: "lorcana-ci_59B",
  printings: [
    {
      id: "set12-102",
      artId: "set12-102",
      setCode: "set12",
      collectorNumber: "102",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set12-102"],
  cardType: "location",
  name: "Pizza Planet",
  version: "Spaceport",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 102,
  rarity: "rare",
  cost: 2,
  willpower: 7,
  moveCost: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b5d8124396864ca4a60ab2e5482185a8",
    tcgPlayer: "690209",
  },
  text: [
    {
      title: "YOU ARE CLEAR TO ENTER",
      description: "Your Toy characters can move here for free.",
    },
    {
      title: "HEAVILY GUARDED",
      description: "Whenever a character is challenged while here, each opponent loses 1 lore.",
    },
  ],
  abilities: [
    {
      id: "AzD-1",
      name: "YOU ARE CLEARED TO ENTER",
      text: "YOU ARE CLEARED TO ENTER Your Toy characters can move here for free.",
      type: "static",
      effect: {
        type: "move-cost-reduction",
        reduction: "free",
        location: "here",
        filter: {
          classification: "Toy",
        },
      },
    },
    {
      id: "AzD-2",
      name: "HEAVILY GUARDED",
      text: "HEAVILY GUARDED Whenever a character is challenged while here, each opponent loses 1 lore.",
      type: "triggered",
      trigger: {
        event: "challenged",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    },
  ],
  i18n: pizzaPlanetSpaceportI18n,
};
