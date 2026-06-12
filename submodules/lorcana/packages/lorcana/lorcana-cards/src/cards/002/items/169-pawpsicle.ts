import type { ItemCard } from "@tcg/lorcana-types";
import { pawpsicleI18n } from "./169-pawpsicle.i18n";

export const pawpsicle: ItemCard = {
  id: "VrY",
  canonicalId: "ci_VrY",
  reprints: ["set2-169"],
  cardType: "item",
  name: "Pawpsicle",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "002",
  cardNumber: 169,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_60f1bf0ac9ac46ca92e290a11ac334e5",
    tcgPlayer: 527535,
  },
  text: [
    {
      title: "JUMBO POP",
      description: "When you play this item, you may draw a card.",
    },
    {
      title: "THAT'S REDWOOD",
      description: "Banish this item — Remove up to 2 damage from chosen character.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "s1u-1",
      name: "JUMBO POP",
      text: "JUMBO POP When you play this item, you may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        amount: { type: "up-to", value: 2 },
        target: "CHOSEN_CHARACTER",
        type: "remove-damage",
      },
      id: "s1u-2",
      name: "THAT'S REDWOOD",
      text: "THAT'S REDWOOD Banish this item — Remove up to 2 damage from chosen character.",
      type: "activated",
    },
  ],
  i18n: pawpsicleI18n,
};
