import type { CharacterCard } from "@tcg/lorcana-types";
import { madHatterUnrulyEccentricD23I18n } from "./d23-016-mad-hatter-unruly-eccentric.i18n";

export const madHatterUnrulyEccentricD23: CharacterCard = {
  id: "UlU",
  canonicalId: "ci_RyL",
  slug: "lorcana-ci_RyL",
  printings: [
    {
      id: "set7-d23-016",
      artId: "set7-d23-016",
      setCode: "set7",
      collectorNumber: "16",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set7-d23-016", "set7-094"],
  cardType: "character",
  name: "Mad Hatter",
  version: "Unruly Eccentric",
  inkType: ["emerald", "ruby"],
  franchise: "D23",
  set: "007",
  cardNumber: 16,
  rarity: "special",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_6826d906dfc147e89f475f146034e75f",
    tcgPlayer: "619741",
  },
  text: [
    {
      title: "Unbirthday Present",
      description:
        "Whenever a damaged character challenges another character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      id: "11o-1",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "UNBIRTHDAY PRESENT",
      trigger: {
        event: "challenge",
        timing: "whenever",
        on: "ANY_CHARACTER",
        attacker: {
          filters: [
            {
              type: "damaged",
            },
          ],
        },
      },
      type: "triggered",
      text: "UNBIRTHDAY PRESENT Whenever a damaged character challenges another character, you may draw a card.",
    },
  ],
  i18n: madHatterUnrulyEccentricD23I18n,
};
