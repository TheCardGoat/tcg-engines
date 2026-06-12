import type { CharacterCard } from "@tcg/lorcana-types";
import { isabelaMadrigalInTheMomentI18n } from "./025-isabela-madrigal-in-the-moment.i18n";

export const isabelaMadrigalInTheMoment: CharacterCard = {
  id: "pWM",
  canonicalId: "ci_pWM",
  reprints: ["set7-025"],
  cardType: "character",
  name: "Isabela Madrigal",
  version: "In the Moment",
  inkType: ["amber"],
  franchise: "Encanto",
  set: "007",
  cardNumber: 25,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_b5348c3b5e494988a10e2adbfd366f50",
    tcgPlayer: 619420,
  },
  text: [
    {
      title: "I'M TIRED OF PERFECT",
      description:
        "Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "SELF",
        type: "restriction",
      },
      id: "xh0-1",
      name: "I'M TIRED OF PERFECT",
      text: "I'M TIRED OF PERFECT Whenever one of your characters sings a song, this character can't be challenged until the start of your next turn.",
      trigger: {
        event: "sing",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: isabelaMadrigalInTheMomentI18n,
};
