import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckDaisysDateI18n } from "./122-donald-duck-daisys-date.i18n";

export const donaldDuckDaisysDate: CharacterCard = {
  id: "6ro",
  canonicalId: "ci_6ro",
  reprints: ["set5-122"],
  cardType: "character",
  name: "Donald Duck",
  version: "Daisy's Date",
  inkType: ["ruby"],
  set: "005",
  cardNumber: 122,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_79bc467a7ad540e4b2012a26e7a247df",
    tcgPlayer: 561485,
  },
  text: [
    {
      title: "PLUCKY PLAY",
      description:
        "Whenever this character challenges another character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1d9-1",
      name: "PLUCKY PLAY",
      text: "PLUCKY PLAY Whenever this character challenges another character, each opponent loses 1 lore.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: donaldDuckDaisysDateI18n,
};
