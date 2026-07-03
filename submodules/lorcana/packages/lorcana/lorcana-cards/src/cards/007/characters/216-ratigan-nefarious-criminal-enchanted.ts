import type { CharacterCard } from "@tcg/lorcana-types";
import { ratiganNefariousCriminalEnchantedI18n } from "./216-ratigan-nefarious-criminal-enchanted.i18n";

export const ratiganNefariousCriminalEnchanted: CharacterCard = {
  id: "TlT",
  canonicalId: "ci_AfF",
  slug: "lorcana-ci_AfF",
  printings: [
    {
      id: "set7-216-enchanted",
      artId: "ci_AfF-enchanted",
      setCode: "set7",
      collectorNumber: "216",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set7-143"],
  cardType: "character",
  name: "Ratigan",
  version: "Nefarious Criminal",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "007",
  cardNumber: 216,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c43f19388b414266aeddb6cd78f7c020",
    tcgPlayer: "619744",
  },
  text: [
    {
      title: "A MARVELOUS PERFORMANCE",
      description: "Whenever you play an action while this character is exerted, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "8q4-1",
      name: "A MARVELOUS PERFORMANCE",
      text: "A MARVELOUS PERFORMANCE Whenever you play an action while this character is exerted, gain 1 lore.",
      condition: {
        type: "is-exerted",
      },
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: ratiganNefariousCriminalEnchantedI18n,
};
