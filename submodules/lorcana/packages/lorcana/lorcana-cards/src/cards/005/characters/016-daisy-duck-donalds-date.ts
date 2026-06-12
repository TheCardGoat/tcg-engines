import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckDonaldsDateI18n } from "./016-daisy-duck-donalds-date.i18n";

export const daisyDuckDonaldsDate: CharacterCard = {
  id: "lih",
  canonicalId: "ci_lih",
  reprints: ["set5-016"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Donald's Date",
  inkType: ["amber"],
  set: "005",
  cardNumber: 16,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_8ae92c4a53ef47acb4aefde6341cba60",
    tcgPlayer: 559158,
  },
  text: [
    {
      title: "BIG PRIZE",
      description:
        "Whenever this character quests, each opponent reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "czn-1",
      name: "BIG PRIZE",
      text: "BIG PRIZE Whenever this character quests, each opponent reveals the top card of their deck. If it's a character card, they may put it into their hand. Otherwise, they put it on the bottom of their deck.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "scry",
        amount: 1,
        target: "EACH_OPPONENT",
        chooser: "OPPONENT",
        revealAll: true,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            filter: { type: "card-type", cardType: "character" },
            reveal: true,
          },
          {
            zone: "deck-bottom",
            remainder: true,
            reveal: true,
          },
        ],
      },
    },
  ],
  i18n: daisyDuckDonaldsDateI18n,
};
