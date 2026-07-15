import type { CharacterCard } from "@tcg/lorcana-types";
import { kingCandySweetAbominationEnchantedI18n } from "./218-king-candy-sweet-abomination-enchanted.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const kingCandySweetAbominationEnchanted: CharacterCard = {
  id: "S7N",
  canonicalId: "ci_KFt",
  slug: "lorcana-ci_KFt",
  printings: [
    {
      id: "set5-218-enchanted",
      artId: "ci_KFt-enchanted",
      setCode: "set5",
      collectorNumber: "218",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set5-154"],
  cardType: "character",
  name: "King Candy",
  version: "Sweet Abomination",
  inkType: ["sapphire"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 218,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_9c2a04a39aee4b989bf2b1f18bf923ba",
    tcgPlayer: "561995",
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "CHANGING THE CODE",
      description:
        "When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
    },
  ],
  classifications: ["Floodborn", "Villain", "King", "Racer"],
  abilities: [
    shift(3),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              amount: 2,
              target: "CONTROLLER",
              type: "draw",
            },
            {
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["hand"],
              },
              type: "put-on-bottom",
            },
          ],
        },
        type: "optional",
      },
      id: "q61-2",
      name: "CHANGING THE CODE",
      text: "CHANGING THE CODE When you play this character, you may draw 2 cards, then put a card from your hand on the bottom of your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kingCandySweetAbominationEnchantedI18n,
};
