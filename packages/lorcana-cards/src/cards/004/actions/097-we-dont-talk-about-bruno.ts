import type { ActionCard } from "@tcg/lorcana-types";

export const weDontTalkAboutBruno: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              count: 1,
              selector: "chosen",
            },
            type: "return-to-hand",
          },
          {
            amount: 1,
            chosen: true,
            target: "CARD_OWNER",
            type: "discard",
          },
        ],
        type: "sequence",
      },
      id: "3im-1",
      text: "Return chosen character to their player's hand. That player chooses and discards a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 97,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "0cad2afabe0d8c82ff3aaacde2c1d2e1edaad12a",
  },
  franchise: "Encanto",
  id: "3im",
  inkType: ["emerald"],
  inkable: true,
  name: "We Don’t Talk About Bruno",
  set: "004",
  text: "Return chosen character to their player's hand, then that player discards a card at random.",
};
