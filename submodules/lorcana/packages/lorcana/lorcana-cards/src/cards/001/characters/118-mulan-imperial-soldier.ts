import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanImperialSoldierI18n } from "./118-mulan-imperial-soldier.i18n";

export const mulanImperialSoldier: CharacterCard = {
  id: "4Na",
  canonicalId: "ci_4Na",
  reprints: ["set1-118"],
  cardType: "character",
  name: "Mulan",
  version: "Imperial Soldier",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "001",
  cardNumber: 118,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_45037644be034dad9ec46ffdabcde550",
    tcgPlayer: 485365,
  },
  text: [
    {
      title: "LEAD BY EXAMPLE",
      description:
        "During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 1,
        stat: "lore",
        target: "YOUR_OTHER_CHARACTERS",
        type: "modify-stat",
      },
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
        timing: "whenever",
      },
      id: "4Na-1",
      name: "LEAD BY EXAMPLE",
      text: "LEAD BY EXAMPLE During your turn, whenever this character banishes another character in a challenge, your other characters get +1 {L} this turn.",
      type: "triggered",
    },
  ],
  i18n: mulanImperialSoldierI18n,
};
