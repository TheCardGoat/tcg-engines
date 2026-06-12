import type { ItemCard } from "@tcg/lorcana-types";
import { fieldOfIceI18n } from "./166-field-of-ice.i18n";

export const fieldOfIce: ItemCard = {
  id: "DSK",
  canonicalId: "ci_DSK",
  reprints: ["set4-166"],
  cardType: "item",
  name: "Field of Ice",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "004",
  cardNumber: 166,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_e8595996603e4e3ab8d772a573e75f5b",
    tcgPlayer: 548594,
  },
  text: [
    {
      title: "ICY DEFENSE",
      description:
        "Whenever you play a character, they gain Resist +1 until the start of your next turn.",
    },
  ],
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: {
          selector: "all",
          count: 1,
          reference: "trigger-subject",
        },
        type: "gain-keyword",
        value: 1,
        duration: "until-start-of-next-turn",
      },
      id: "1kk-1",
      name: "ICY DEFENSE",
      text: "ICY DEFENSE Whenever you play a character, they gain Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: fieldOfIceI18n,
};
