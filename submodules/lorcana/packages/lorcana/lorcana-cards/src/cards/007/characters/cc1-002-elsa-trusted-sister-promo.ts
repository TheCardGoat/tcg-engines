import type { CharacterCard } from "@tcg/lorcana-types";
import { elsaTrustedSisterCC1PromoI18n } from "./cc1-002-elsa-trusted-sister-promo.i18n";

export const elsaTrustedSisterCC1Promo: CharacterCard = {
  id: "n1z",
  canonicalId: "ci_DdM",
  slug: "lorcana-ci_DdM",
  printings: [
    {
      id: "set7-cc1-002-promo",
      artId: "ci_DdM-promo",
      setCode: "set7",
      collectorNumber: "2",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set7-055"],
  cardType: "character",
  name: "Elsa",
  version: "Trusted Sister",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "007",
  cardNumber: 2,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6e04382533a045eda3c48e76e9dda411",
    tcgPlayer: "619434",
  },
  text: [
    {
      title: "WHAT DO WE DO NOW?",
      description:
        "Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen", "Sorcerer"],
  abilities: [
    {
      condition: {
        type: "has-named-character",
        name: "Anna",
        controller: "you",
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "yr0-1",
      name: "WHAT DO WE DO NOW?",
      text: "WHAT DO WE DO NOW? Whenever this character quests, if you have a character named Anna in play, gain 1 lore.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: elsaTrustedSisterCC1PromoI18n,
};
