import type { CharacterCard } from "@tcg/lorcana-types";
import { jafarNewlyCrownedEnchantedI18n } from "./210-jafar-newly-crowned-enchanted.i18n";

export const jafarNewlyCrownedEnchanted: CharacterCard = {
  id: "G6C",
  canonicalId: "ci_zaZ",
  slug: "lorcana-ci_zaZ",
  printings: [
    {
      id: "set7-210-enchanted",
      artId: "ci_zaZ-enchanted",
      setCode: "set7",
      collectorNumber: "210",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-051"],
  cardType: "character",
  name: "Jafar",
  version: "Newly Crowned",
  inkType: ["amethyst", "steel"],
  franchise: "Aladdin",
  set: "007",
  cardNumber: 210,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1cda76d2cbe84ccda25bd2dc1b21844b",
    tcgPlayer: "619738",
  },
  text: [
    {
      title: "THIS IS NOT DONE YET",
      description:
        "During an opponent's turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            ref: "trigger-source",
          },
        },
        type: "optional",
      },
      id: "1i1-1",
      name: "THIS IS NOT DONE YET",
      text: "THIS IS NOT DONE YET During an opponent's turn, whenever one of your Illusion characters is banished, you may return that card to your hand.",
      trigger: {
        event: "banish",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Illusion",
        },
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "opponent",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: jafarNewlyCrownedEnchantedI18n,
};
