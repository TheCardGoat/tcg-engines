import type { ActionCard } from "@tcg/lorcana-types";
import { heffalumpsAndWoozlesI18n } from "./095-heffalumps-and-woozles.i18n";

export const heffalumpsAndWoozles: ActionCard = {
  id: "Iby",
  canonicalId: "ci_Iby",
  reprints: ["set6-095"],
  cardType: "action",
  name: "Heffalumps and Woozles",
  inkType: ["emerald"],
  franchise: "Winnie the Pooh",
  set: "006",
  cardNumber: 95,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b87dd2f01e364f679975158dd2637a6d",
    tcgPlayer: 587355,
  },
  text: "Chosen opposing character can't quest during their next turn. Draw a card.",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            duration: "next-turn",
            restriction: "cant-quest",
            target: {
              selector: "chosen",
              count: {
                upTo: 1,
              },
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "restriction",
          },
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        ],
        type: "sequence",
      },
      id: "10y-1",
      text: "Chosen opposing character can't quest during their next turn. Draw a card.",
      type: "action",
    },
  ],
  i18n: heffalumpsAndWoozlesI18n,
};
