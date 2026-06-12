import type { ItemCard } from "@tcg/lorcana-types";
import { webbysDiaryI18n } from "./031-webbys-diary.i18n";

export const webbysDiary: ItemCard = {
  id: "XSg",
  canonicalId: "ci_XSg",
  reprints: ["set10-031"],
  cardType: "item",
  name: "Webby's Diary",
  inkType: ["amber"],
  franchise: "Ducktales",
  set: "010",
  cardNumber: 31,
  rarity: "uncommon",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_553961389abc4bd4b49cc302ee271ba8",
    tcgPlayer: 658789,
  },
  text: [
    {
      title: "LATEST ENTRY",
      description:
        "Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
        },
        type: "optional",
      },
      id: "XSg-1",
      name: "LATEST ENTRY",
      text: "LATEST ENTRY Whenever you put a card under one of your characters or locations, you may pay 1 {I} to draw a card.",
      trigger: {
        event: "put-card-under",
        on: "YOUR_CHARACTERS_OR_LOCATIONS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: webbysDiaryI18n,
};
