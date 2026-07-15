import type { CharacterCard } from "@tcg/lorcana-types";
import { liloRockStarEnchantedI18n } from "./223-lilo-rock-star-enchanted.i18n";

export const liloRockStarEnchanted: CharacterCard = {
  id: "rmm",
  canonicalId: "ci_2am",
  slug: "lorcana-ci_2am",
  printings: [
    {
      id: "set11-223-enchanted",
      artId: "ci_2am-enchanted",
      setCode: "set11",
      collectorNumber: "223",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set11-017"],
  cardType: "character",
  name: "Lilo",
  version: "Rock Star",
  inkType: ["amber"],
  franchise: "Lilo and Stitch",
  set: "011",
  cardNumber: 223,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 6,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_41acb92e0c494214949c72c409593b50",
    tcgPlayer: "677158",
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "I'LL COUNT YOU IN",
      description:
        "Whenever this character quests, you may play a character with cost 2 or less from your discard for free.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    {
      id: "11h-1",
      cost: {
        ink: 4,
      },
      keyword: "Shift",
      type: "keyword",
      text: "Shift 4 {I}",
    },
    {
      id: "11h-2",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "character",
          costRestriction: {
            comparison: "less-or-equal",
            value: 2,
          },
          filter: {
            maxCost: 2,
          },
          from: "discard",
          type: "play-card",
          cost: "free",
        },
        type: "optional",
      },
      name: "I'LL COUNT YOU IN",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
      text: "I’LL COUNT YOU IN Whenever this character quests, you may play a character with cost 2 or less from your discard for free.",
    },
  ],
  i18n: liloRockStarEnchantedI18n,
};
