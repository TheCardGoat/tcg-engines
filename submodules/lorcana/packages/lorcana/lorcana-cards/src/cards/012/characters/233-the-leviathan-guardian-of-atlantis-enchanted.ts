import type { CharacterCard } from "@tcg/lorcana-types";
import { theLeviathanGuardianOfAtlantisEnchantedI18n } from "./233-the-leviathan-guardian-of-atlantis-enchanted.i18n";

export const theLeviathanGuardianOfAtlantisEnchanted: CharacterCard = {
  id: "ESm",
  canonicalId: "ci_lYe",
  slug: "lorcana-ci_lYe",
  printings: [
    {
      id: "set12-233-enchanted",
      artId: "ci_lYe-enchanted",
      setCode: "set12",
      collectorNumber: "233",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set12-125"],
  cardType: "character",
  name: "The Leviathan",
  version: "Guardian of Atlantis",
  inkType: ["ruby"],
  franchise: "Atlantis",
  set: "012",
  cardNumber: 233,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 10,
  strength: 10,
  willpower: 10,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_acf86cd5ee4e434fac91134e9ecf07c5",
    tcgPlayer: "692224",
  },
  text: [
    {
      title: "IT'S",
      description:
        "A MACHINE! When you play this character, if 2 or more cards were put into your discard this turn, you may banish any number of chosen opposing characters with total {S} 10 or less.",
    },
  ],
  classifications: ["Dreamborn", "Monster", "Robot"],
  abilities: [
    {
      id: "lYe-1",
      name: "IT'S A MACHINE!",
      type: "triggered",
      text: "IT'S A MACHINE! When you play this character, if 2 or more cards were put into your discard this turn, you may banish any number of chosen opposing characters with total cost 10 or less.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "banish",
          target: {
            selector: "chosen",
            count: {
              upTo: 10,
            },
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
            totalStrengthBudget: 10,
          },
        },
      },
    },
  ],
  i18n: theLeviathanGuardianOfAtlantisEnchantedI18n,
};
