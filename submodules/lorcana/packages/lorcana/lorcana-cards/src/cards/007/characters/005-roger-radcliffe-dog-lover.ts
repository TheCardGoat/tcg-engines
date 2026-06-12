import type { CharacterCard } from "@tcg/lorcana-types";
import { rogerRadcliffeDogLoverI18n } from "./005-roger-radcliffe-dog-lover.i18n";

export const rogerRadcliffeDogLover: CharacterCard = {
  id: "aPy",
  canonicalId: "ci_aPy",
  reprints: ["set7-005"],
  cardType: "character",
  name: "Roger Radcliffe",
  version: "Dog Lover",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "007",
  cardNumber: 5,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fb3fdf1042f04416b070bdd8566a53e6",
    tcgPlayer: 619408,
  },
  text: [
    {
      title: "THERE YOU GO",
      description:
        "Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: { type: "up-to", value: 1 },
          target: "YOUR_PUPPY_CHARACTERS",
          type: "remove-damage",
        },
        type: "optional",
      },
      id: "1t4-1",
      name: "THERE YOU GO",
      text: "THERE YOU GO Whenever this character quests, you may remove up to 1 damage from each of your Puppy characters.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: rogerRadcliffeDogLoverI18n,
};
