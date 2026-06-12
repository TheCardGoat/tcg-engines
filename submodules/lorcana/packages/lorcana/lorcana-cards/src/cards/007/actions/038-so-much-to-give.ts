import type { ActionCard } from "@tcg/lorcana-types";
import { soMuchToGiveI18n } from "./038-so-much-to-give.i18n";

export const soMuchToGive: ActionCard = {
  id: "Q7m",
  canonicalId: "ci_Q7m",
  reprints: ["set7-038"],
  cardType: "action",
  name: "So Much to Give",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "007",
  cardNumber: 38,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1420be51e8504e689e1166dfb5bd2790",
    tcgPlayer: 618720,
  },
  text: "Draw a card. Chosen character gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            duration: "until-start-of-next-turn",
            keyword: "Bodyguard",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      id: "jyr-1",
      text: "Draw a card. Chosen character gains Bodyguard until the start of your next turn.",
      type: "action",
    },
  ],
  i18n: soMuchToGiveI18n,
};
