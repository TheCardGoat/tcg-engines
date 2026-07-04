import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinHeroicOutlawEnchantedI18n } from "./211-aladdin-heroic-outlaw-enchanted.i18n";

export const aladdinHeroicOutlawEnchanted: CharacterCard = {
  id: "wXz",
  canonicalId: "ci_wrC",
  slug: "lorcana-ci_wrC",
  printings: [
    {
      id: "set1-211-enchanted",
      artId: "ci_wrC-enchanted",
      setCode: "set1",
      collectorNumber: "211",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set1-104"],
  cardType: "character",
  name: "Aladdin",
  version: "Heroic Outlaw",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "001",
  cardNumber: 211,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7c621010e3e6471d9916eee4bcd0b11d",
    tcgPlayer: "510157",
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "DARING EXPLOIT",
      description:
        "During your turn, whenever this character banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    {
      id: "D7K-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5 {I}",
    },
    {
      id: "D7K-2",
      type: "triggered",
      name: "DARING EXPLOIT",
      text: "DARING EXPLOIT During your turn, whenever this character banishes another character in a challenge, you gain 2 lore and each opponent loses 2 lore.",
      trigger: {
        event: "banish-in-challenge",
        on: "SELF",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "sequence",
        effects: [
          {
            type: "gain-lore",
            amount: 2,
          },
          {
            type: "lose-lore",
            amount: 2,
            target: "EACH_OPPONENT",
          },
        ],
      },
    },
  ],
  i18n: aladdinHeroicOutlawEnchantedI18n,
};
