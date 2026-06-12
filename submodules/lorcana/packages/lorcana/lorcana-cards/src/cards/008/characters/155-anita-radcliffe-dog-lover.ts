import type { CharacterCard } from "@tcg/lorcana-types";
import { anitaRadcliffeDogLoverI18n } from "./155-anita-radcliffe-dog-lover.i18n";

export const anitaRadcliffeDogLover: CharacterCard = {
  id: "q1w",
  canonicalId: "ci_q1w",
  reprints: ["set8-155"],
  cardType: "character",
  name: "Anita Radcliffe",
  version: "Dog Lover",
  inkType: ["sapphire"],
  franchise: "101 Dalmatians",
  set: "008",
  cardNumber: 155,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_3e1fbfdb7f9c42119cd02bba07f694e7",
    tcgPlayer: 633100,
  },
  text: [
    {
      title: "I'LL TAKE CARE OF YOU",
      description:
        "When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "q1w-1",
      name: "I'LL TAKE CARE OF YOU",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "gain-keyword",
          keyword: "Resist",
          value: 1,
          target: {
            selector: "chosen",
            cardTypes: ["character"],
            owner: "you",
            zones: ["play"],
            count: 1,
            filter: [
              {
                type: "has-classification",
                classification: "Puppy",
              },
            ],
          },
          duration: "until-start-of-next-turn",
        },
        type: "optional",
      },
      text: "I'LL TAKE CARE OF YOU When you play this character, you may give chosen Puppy character Resist +1 until the start of your next turn.",
    },
  ],
  i18n: anitaRadcliffeDogLoverI18n,
};
