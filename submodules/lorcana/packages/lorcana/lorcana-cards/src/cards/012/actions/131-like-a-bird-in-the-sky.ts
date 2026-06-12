import type { ActionCard } from "@tcg/lorcana-types";
import { likeABirdInTheSkyI18n } from "./131-like-a-bird-in-the-sky.i18n";

export const likeABirdInTheSky: ActionCard = {
  id: "49o",
  canonicalId: "ci_49o",
  reprints: ["set12-131"],
  cardType: "action",
  name: "Like A Bird In the Sky",
  inkType: ["ruby"],
  franchise: "Toy Story",
  set: "012",
  cardNumber: 131,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2a4015409c2d48788a2885b200a080e4",
  },
  text: "Chosen character gets +1 {L} and gains Evasive until the start of your next turn.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      text: "Chosen character gets +1 {L} and gains Evasive until the start of your next turn.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            duration: "until-start-of-next-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "gain-keyword",
            keyword: "Evasive",
            duration: "until-start-of-next-turn",
            target: {
              ref: "previous-target",
            },
          },
        ],
      },
    },
  ],
  i18n: likeABirdInTheSkyI18n,
};
