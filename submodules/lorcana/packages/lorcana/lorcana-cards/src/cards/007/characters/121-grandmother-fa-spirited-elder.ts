import type { CharacterCard } from "@tcg/lorcana-types";
import { grandmotherFaSpiritedElderI18n } from "./121-grandmother-fa-spirited-elder.i18n";

export const grandmotherFaSpiritedElder: CharacterCard = {
  id: "XL5",
  canonicalId: "ci_XL5",
  reprints: ["set7-121"],
  cardType: "character",
  name: "Grandmother Fa",
  version: "Spirited Elder",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "007",
  cardNumber: 121,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_466c1ad68e6040a0973b922ee491924d",
    tcgPlayer: 619472,
  },
  text: [
    {
      title: "I'VE GOT ALL THE LUCK WE'LL NEED",
      description:
        "Whenever this character quests, you may give chosen character of yours +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          duration: "this-turn",
          modifier: 2,
          stat: "strength",
          target: "CHOSEN_CHARACTER_OF_YOURS",
          type: "modify-stat",
        },
      },
      id: "XL5-1",
      name: "I'VE GOT ALL THE LUCK WE'LL NEED",
      text: "I'VE GOT ALL THE LUCK WE'LL NEED Whenever this character quests, you may give chosen character of yours +2 {S} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: grandmotherFaSpiritedElderI18n,
};
