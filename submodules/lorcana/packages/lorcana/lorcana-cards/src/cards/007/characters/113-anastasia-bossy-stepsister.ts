import type { CharacterCard } from "@tcg/lorcana-types";
import { anastasiaBossyStepsisterI18n } from "./113-anastasia-bossy-stepsister.i18n";

export const anastasiaBossyStepsister: CharacterCard = {
  id: "zB6",
  canonicalId: "ci_zB6",
  reprints: ["set7-113"],
  cardType: "character",
  name: "Anastasia",
  version: "Bossy Stepsister",
  inkType: ["emerald"],
  franchise: "Cinderella",
  set: "007",
  cardNumber: 113,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_17faea698cdc496d81f840310128074b",
    tcgPlayer: 619467,
  },
  text: [
    {
      title: "OH, I HATE THIS!",
      description:
        "Whenever this character is challenged, the challenging player chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "CHALLENGING_PLAYER",
        type: "discard",
      },
      id: "6rw-1",
      name: "OH, I HATE THIS!",
      text: "OH, I HATE THIS! Whenever this character is challenged, the challenging player chooses and discards a card.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: anastasiaBossyStepsisterI18n,
};
