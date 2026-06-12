import type { ActionCard } from "@tcg/lorcana-types";
import { weDontTalkAboutBrunoI18n } from "./097-we-dont-talk-about-bruno.i18n";

export const weDontTalkAboutBruno: ActionCard = {
  id: "ILB",
  canonicalId: "ci_Xd1",
  reprints: ["set4-097"],
  cardType: "action",
  name: "We Don’t Talk About Bruno",
  inkType: ["emerald"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 97,
  rarity: "rare",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_3694abe0d09349ca9dbef6861ea42f5a",
    tcgPlayer: 550541,
  },
  text: "Return chosen character to their player's hand, then that player discards a card at random.",
  actionSubtype: "song",
  abilities: [
    {
      id: "3im-1",
      text: "Return chosen character to their player's hand, then that player discards a card at random.",
      effect: {
        steps: [
          {
            target: {
              selector: "chosen",
              count: 1,
              zones: ["play"],
              cardTypes: ["character"],
              owner: "any",
            },
            type: "return-to-hand",
          },
          {
            amount: 1,
            random: true,
            target: "CARD_OWNER",
            type: "discard",
          },
        ],
        type: "sequence",
      },
      type: "action",
    },
  ],
  i18n: weDontTalkAboutBrunoI18n,
};
