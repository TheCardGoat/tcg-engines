import type { CharacterCard } from "@tcg/lorcana-types";
import { doloresMadrigalWithinEarshotI18n } from "./078-dolores-madrigal-within-earshot.i18n";

export const doloresMadrigalWithinEarshot: CharacterCard = {
  id: "9wm",
  canonicalId: "ci_9wm",
  reprints: ["set7-078"],
  cardType: "character",
  name: "Dolores Madrigal",
  version: "Within Earshot",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "007",
  cardNumber: 78,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_530a9f4cf6274b8d8293c816a38bdf61",
    tcgPlayer: 619447,
  },
  text: [
    {
      title: "I HEAR YOU",
      description:
        "Whenever one of your characters sings a song, chosen opponent reveals their hand.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "9wm-1",
      name: "I HEAR YOU",
      text: "I HEAR YOU Whenever one of your characters sings a song, chosen opponent reveals their hand.",
      type: "triggered",
      trigger: {
        event: "sing",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      effect: {
        type: "reveal-hand",
        target: "OPPONENT",
      },
    },
  ],
  i18n: doloresMadrigalWithinEarshotI18n,
};
