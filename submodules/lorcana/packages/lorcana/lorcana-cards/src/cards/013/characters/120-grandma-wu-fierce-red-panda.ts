import type { CharacterCard } from "@tcg/lorcana-types";
import { temporaryShift } from "../../../helpers/abilities/shift";
import { grandmaWuFierceRedPandaI18n } from "./120-grandma-wu-fierce-red-panda.i18n";

export const grandmaWuFierceRedPanda: CharacterCard = {
  id: "ZQC",
  canonicalId: "ci_ZQC",
  slug: "lorcana-ci_ZQC",
  printings: [
    {
      id: "set13-120",
      artId: "set13-120",
      setCode: "set13",
      collectorNumber: "120",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-120"],
  cardType: "character",
  name: "Grandma Wu",
  version: "Fierce Red Panda",
  inkType: ["ruby"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 120,
  rarity: "rare",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Temporary Shift 4 {I}",
      description:
        "(You may pay 4 {I} to play this on top of one of your characters named Grandma Wu. At the end of your turn, remove all damage from this character and return only this card to your hand.)",
    },
    {
      title: "Intimidating Charge",
      description:
        "Whenever this character challenges another character, you gain 2 lore and each opponent loses 2 lore.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Red Panda"],
  abilities: [
    temporaryShift("Grandma Wu", 4),
    {
      type: "triggered",
      name: "INTIMIDATING CHARGE",
      text: "INTIMIDATING CHARGE Whenever this character challenges another character, you gain 2 lore and each opponent loses 2 lore.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-lore",
            amount: 2,
            target: "CONTROLLER",
          },
          {
            type: "lose-lore",
            amount: 2,
            target: "OPPONENTS",
          },
        ],
      },
    },
  ],
  i18n: grandmaWuFierceRedPandaI18n,
};
