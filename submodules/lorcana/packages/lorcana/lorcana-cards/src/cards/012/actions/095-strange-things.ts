import type { ActionCard } from "@tcg/lorcana-types";
import { strangeThingsI18n } from "./095-strange-things.i18n";

export const strangeThings: ActionCard = {
  id: "KiR",
  canonicalId: "ci_KiR",
  reprints: ["set12-095"],
  cardType: "action",
  name: "Strange Things",
  inkType: ["emerald"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 95,
  rarity: "uncommon",
  cost: 4,
  inkable: true,
  externalIds: {
    lorcast: "crd_ae857d482ec44b298970ad55a6431753",
  },
  text: "Up to 2 chosen characters can't quest until the start of your next turn. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "restriction",
            restriction: "cant-quest",
            duration: "until-start-of-next-turn",
            target: {
              selector: "chosen",
              count: {
                upTo: 2,
              },
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
      },
    },
  ],
  i18n: strangeThingsI18n,
};
