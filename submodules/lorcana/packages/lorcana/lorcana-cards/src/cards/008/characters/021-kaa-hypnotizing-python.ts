import type { CharacterCard } from "@tcg/lorcana-types";
import { kaaHypnotizingPythonI18n } from "./021-kaa-hypnotizing-python.i18n";

export const kaaHypnotizingPython: CharacterCard = {
  id: "mhw",
  canonicalId: "ci_mhw",
  reprints: ["set8-021"],
  cardType: "character",
  name: "Kaa",
  version: "Hypnotizing Python",
  inkType: ["amber", "emerald"],
  franchise: "Jungle Book",
  set: "008",
  cardNumber: 21,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_c71a707f446d4f01b5c4e66bdde91643",
    tcgPlayer: 631365,
  },
  text: [
    {
      title: "LOOK ME IN THE EYE",
      description:
        "Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "until-start-of-next-turn",
            modifier: -2,
            stat: "strength",
            target: "CHOSEN_OPPOSING_CHARACTER",
            type: "modify-stat",
          },
          {
            duration: "until-start-of-next-turn",
            keyword: "Reckless",
            target: {
              ref: "previous-target",
            },
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      id: "1v1-1",
      name: "LOOK ME IN THE EYE",
      text: "LOOK ME IN THE EYE Whenever this character quests, chosen opposing character gets -2 {S} and gains Reckless until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: kaaHypnotizingPythonI18n,
};
