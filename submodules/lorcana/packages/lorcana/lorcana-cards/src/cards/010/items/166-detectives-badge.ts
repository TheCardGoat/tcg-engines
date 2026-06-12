import type { ItemCard } from "@tcg/lorcana-types";
import { detectivesBadgeI18n } from "./166-detectives-badge.i18n";

export const detectivesBadge: ItemCard = {
  id: "os1",
  canonicalId: "ci_os1",
  reprints: ["set10-166"],
  cardType: "item",
  name: "Detective's Badge",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 166,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_423d5717f2d347448441e9da6d022847",
    tcgPlayer: 660340,
  },
  text: [
    {
      title: "PROTECT AND SERVE",
      description:
        "{E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn.",
    },
  ],
  abilities: [
    {
      id: "os1-1",
      name: "PROTECT AND SERVE",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Resist",
            value: 1,
            duration: "until-start-of-next-turn",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "property-modification",
            property: "classification",
            operation: "add",
            value: "Detective",
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
      text: "PROTECT AND SERVE {E}, 1 {I} — Chosen character gains Resist +1 and the Detective classification until the start of your next turn.",
    },
  ],
  i18n: detectivesBadgeI18n,
};
