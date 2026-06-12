import type { ActionCard } from "@tcg/lorcana-types";
import { inkGeyserI18n } from "./119-ink-geyser.i18n";

export const inkGeyser: ActionCard = {
  id: "NRZ",
  canonicalId: "ci_NRZ",
  reprints: ["set7-119"],
  cardType: "action",
  name: "Ink Geyser",
  inkType: ["emerald", "sapphire"],
  franchise: "Lorcana",
  set: "007",
  cardNumber: 119,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_1043af1f4d454d8d83c4a85a75e1ad05",
    tcgPlayer: 618175,
  },
  text: "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
  abilities: [
    {
      type: "action",
      text: "Each player exerts all the cards in their inkwell. Then each player with more than 3 cards in their inkwell returns cards at random from their inkwell to their hand until they have 3 cards in their inkwell.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "exert",
            target: {
              selector: "all",
              count: "all",
              owner: "any",
              zones: ["inkwell"],
            },
          },
          {
            type: "return-random-from-inkwell",
            target: "EACH_PLAYER",
            leave: 3,
          },
        ],
      },
    },
  ],
  i18n: inkGeyserI18n,
};
