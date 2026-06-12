import type { ActionCard } from "@tcg/lorcana-types";
import { trustInMeI18n } from "./095-trust-in-me.i18n";

export const trustInMe: ActionCard = {
  id: "c7R",
  canonicalId: "ci_c7R",
  reprints: ["set10-095"],
  cardType: "action",
  name: "Trust In Me",
  inkType: ["emerald"],
  franchise: "Jungle Book",
  set: "010",
  cardNumber: 95,
  rarity: "rare",
  cost: 6,
  inkable: false,
  externalIds: {
    lorcast: "crd_a8554e2076074a8599f09e171436ac14",
    tcgPlayer: 658461,
  },
  text: "Choose one:\n- Each opposing character gets -1 until the start of your next turn.\n- Each opponent chooses and discards 2 cards.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: -1,
            duration: "until-start-of-next-turn",
            target: {
              selector: "all",
              count: "all",
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "discard",
            amount: 2,
            chosen: true,
            from: "hand",
            target: "EACH_OPPONENT",
          },
        ],
      },
    },
  ],
  i18n: trustInMeI18n,
};
