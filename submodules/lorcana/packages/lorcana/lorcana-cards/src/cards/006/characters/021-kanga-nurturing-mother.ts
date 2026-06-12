import type { CharacterCard } from "@tcg/lorcana-types";
import { kangaNurturingMotherI18n } from "./021-kanga-nurturing-mother.i18n";

export const kangaNurturingMother: CharacterCard = {
  id: "jsu",
  canonicalId: "ci_jsu",
  reprints: ["set6-021"],
  cardType: "character",
  name: "Kanga",
  version: "Nurturing Mother",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "006",
  cardNumber: 21,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_4557d5bc41de40728df0ebbbdce4787f",
    tcgPlayer: 593019,
  },
  text: [
    {
      title: "SAFE AND SOUND",
      description:
        "Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        restriction: "cant-be-challenged",
        target: "CHOSEN_CHARACTER_OF_YOURS",
        duration: "until-start-of-next-turn",
        type: "restriction",
      },
      id: "qu5-1",
      name: "SAFE AND SOUND",
      text: "SAFE AND SOUND Whenever this character quests, choose a character of yours and that character can't be challenged until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: kangaNurturingMotherI18n,
};
