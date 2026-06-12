import type { LocationCard } from "@tcg/lorcana-types";
import { beastsCastleWinterGardensI18n } from "./136-beasts-castle-winter-gardens.i18n";

export const beastsCastleWinterGardens: LocationCard = {
  id: "xnX",
  canonicalId: "ci_xnX",
  reprints: ["set11-136"],
  cardType: "location",
  name: "Beast's Castle",
  version: "Winter Gardens",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "011",
  cardNumber: 136,
  rarity: "common",
  cost: 1,
  willpower: 6,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_5f6b06befa5143649062b5ac4414d7ba",
    tcgPlayer: 675513,
  },
  text: [
    {
      title: "SNOWBALL STANDOFF",
      description: "Whenever a character here challenges another character, gain 1 lore.",
    },
  ],
  abilities: [
    {
      id: "vod-1",
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      name: "SNOWBALL STANDOFF",
      trigger: {
        defender: {},
        event: "challenge",
        on: "CHARACTERS_HERE",
        timing: "whenever",
      },
      type: "triggered",
      text: "SNOWBALL STANDOFF Whenever a character here challenges another character, gain 1 lore.",
    },
  ],
  i18n: beastsCastleWinterGardensI18n,
};
