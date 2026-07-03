import type { ItemCard } from "@tcg/lorcana-types";
import { discardedArmorI18n } from "./204-discarded-armor.i18n";

export const discardedArmor: ItemCard = {
  id: "htD",
  canonicalId: "ci_htD",
  slug: "lorcana-ci_htD",
  printings: [
    {
      id: "set13-204",
      artId: "set13-204",
      setCode: "set13",
      collectorNumber: "204",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-204"],
  cardType: "item",
  name: "Discarded Armor",
  inkType: ["steel"],
  franchise: "Mulan",
  set: "013",
  cardNumber: 204,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c165a60ae2434c74afc216d65d8eeb9c",
  },
  text: [
    {
      title: "FOUND EQUIPMENT",
      description:
        "exert — If you discarded a card this turn, chosen character of yours gains Resist +1 until the start of your next turn.",
    },
  ],
  abilities: [
    {
      type: "activated",
      name: "FOUND EQUIPMENT",
      text: "FOUND EQUIPMENT {E} - If you discarded a card this turn, chosen character of yours gains Resist +1 until the start of your next turn.",
      cost: {
        exert: true,
      },
      condition: {
        type: "turn-metric",
        metric: "discard-cards-entered",
        ownerScope: "you",
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 1,
        duration: "until-start-of-next-turn",
        target: "CHOSEN_CHARACTER_OF_YOURS",
      },
    },
  ],
  i18n: discardedArmorI18n,
};
