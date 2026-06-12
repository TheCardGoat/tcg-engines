import type { CharacterCard } from "@tcg/lorcana-types";
import { rayaGuidanceSeekerI18n } from "./186-raya-guidance-seeker.i18n";

export const rayaGuidanceSeeker: CharacterCard = {
  id: "dsU",
  canonicalId: "ci_dsU",
  reprints: ["set7-186"],
  cardType: "character",
  name: "Raya",
  version: "Guidance Seeker",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "007",
  cardNumber: 186,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_0ab7da34efae4501b26ae156eb69755c",
    tcgPlayer: 619513,
  },
  text: [
    {
      title: "A GREATER PURPOSE",
      description:
        "During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: "SELF",
        type: "gain-keyword",
        value: 1,
      },
      id: "1id-1",
      name: "A GREATER PURPOSE",
      text: "A GREATER PURPOSE During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn.",
      condition: {
        type: "your-turn",
      },
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: rayaGuidanceSeekerI18n,
};
