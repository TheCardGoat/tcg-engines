import type { CharacterCard } from "@tcg/lorcana-types";
import { maidMarianLadyOfTheListsI18n } from "./022-maid-marian-lady-of-the-lists.i18n";

export const maidMarianLadyOfTheLists: CharacterCard = {
  id: "w0u",
  canonicalId: "ci_w0u",
  reprints: ["set5-022"],
  cardType: "character",
  name: "Maid Marian",
  version: "Lady of the Lists",
  inkType: ["amber"],
  franchise: "Robin Hood",
  set: "005",
  cardNumber: 22,
  rarity: "uncommon",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0140dc8d8b8444878839e0c94f358497",
    tcgPlayer: 561948,
  },
  text: [
    {
      title: "IF IT PLEASES THE LADY",
      description:
        "When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Princess"],
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -5,
        stat: "strength",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "modify-stat",
      },
      id: "o8f-1",
      name: "IF IT PLEASES THE LADY",
      text: "IF IT PLEASES THE LADY When you play this character, chosen opposing character gets -5 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: maidMarianLadyOfTheListsI18n,
};
