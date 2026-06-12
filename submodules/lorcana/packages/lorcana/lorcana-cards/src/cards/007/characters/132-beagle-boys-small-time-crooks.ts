import type { CharacterCard } from "@tcg/lorcana-types";
import { beagleBoysSmalltimeCrooksI18n } from "./132-beagle-boys-small-time-crooks.i18n";

export const beagleBoysSmalltimeCrooks: CharacterCard = {
  id: "WJM",
  canonicalId: "ci_WJM",
  reprints: ["set7-132"],
  cardType: "character",
  name: "Beagle Boys",
  version: "Small-Time Crooks",
  inkType: ["ruby", "sapphire"],
  franchise: "Ducktales",
  set: "007",
  cardNumber: 132,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0d3c06bef62348d7b6dcb0fe03afa6d0",
    tcgPlayer: 619478,
  },
  text: [
    {
      title: "HURRY IT UP!",
      description:
        "Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn. (They can challenge the turn they're played. Damage dealt to them is reduced by 1.)",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "f1x-1",
      name: "HURRY IT UP!",
      text: "HURRY IT UP! Whenever this character quests, chosen character of yours gains Rush and Resist +1 this turn.",
      type: "triggered",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "gain-keyword",
            keyword: "Rush",
            target: {
              selector: "chosen",
              cardTypes: ["character"],
              owner: "you",
              zones: ["play"],
              count: 1,
            },
            duration: "this-turn",
          },
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 1,
            target: {
              ref: "previous-target",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  ],
  i18n: beagleBoysSmalltimeCrooksI18n,
};
