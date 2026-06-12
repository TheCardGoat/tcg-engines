import type { CharacterCard } from "@tcg/lorcana-types";
import { almaMadrigalHeartOfTheFamilyI18n } from "./045-alma-madrigal-heart-of-the-family.i18n";

export const almaMadrigalHeartOfTheFamily: CharacterCard = {
  id: "guV",
  canonicalId: "ci_guV",
  reprints: ["set12-045"],
  cardType: "character",
  name: "Alma Madrigal",
  version: "Heart of the Family",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 45,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_938c76c3d0fd41f8b0a1a4dac95f04bc",
  },
  text: [
    {
      title: "FIND",
      description:
        "A WAY Whenever this character quests, move up to 1 damage from chosen character of yours to chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Madrigal"],
  abilities: [
    {
      id: "guV-1",
      name: "FIND A WAY",
      type: "triggered",
      text: "FIND A WAY Whenever this character quests, move up to 1 damage from chosen character of yours to chosen opposing character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "move-damage",
        amount: {
          type: "up-to",
          value: 1,
        },
        from: "CHOSEN_CHARACTER_OF_YOURS",
        to: "CHOSEN_OPPOSING_CHARACTER",
      },
    },
  ],
  i18n: almaMadrigalHeartOfTheFamilyI18n,
};
