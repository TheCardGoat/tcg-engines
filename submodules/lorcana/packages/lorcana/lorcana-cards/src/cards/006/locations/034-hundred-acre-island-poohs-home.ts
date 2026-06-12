import type { LocationCard } from "@tcg/lorcana-types";
import { hundredAcreIslandPoohsHomeI18n } from "./034-hundred-acre-island-poohs-home.i18n";

export const hundredAcreIslandPoohsHome: LocationCard = {
  id: "QM4",
  canonicalId: "ci_QM4",
  reprints: ["set6-034"],
  cardType: "location",
  name: "Hundred Acre Island",
  version: "Pooh's Home",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  cardNumber: 34,
  rarity: "common",
  cost: 1,
  willpower: 5,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_2fd6877d711c45f68ad61690d224306a",
    tcgPlayer: 591985,
  },
  text: [
    {
      title: "FRIENDS FOREVER",
      description: "During an opponent's turn, whenever a character is banished here, gain 1 lore.",
    },
  ],
  abilities: [
    {
      id: "5uo-1",
      name: "FRIENDS FOREVER",
      trigger: {
        event: "banish",
        on: "CHARACTERS_HERE",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
        timing: "whenever",
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      text: "FRIENDS FOREVER During an opponent's turn, whenever a character is banished here, gain 1 lore.",
      type: "triggered",
    },
  ],
  i18n: hundredAcreIslandPoohsHomeI18n,
};
