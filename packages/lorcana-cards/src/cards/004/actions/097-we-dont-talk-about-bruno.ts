import type { ActionCard } from "@tcg/lorcana-types";

export const weDontTalkAboutBruno: ActionCard = {
  id: "3im",
  cardType: "action",
  name: "We Don’t Talk About Bruno",
  inkType: ["emerald"],
  franchise: "Encanto",
  set: "004",
  text: "Return chosen character to their player's hand, then that player discards a card at random.",
  actionSubtype: "song",
  cost: 5,
  cardNumber: 97,
  inkable: true,
  externalIds: {
    ravensburger: "0cad2afabe0d8c82ff3aaacde2c1d2e1edaad12a",
  },
  abilities: [
    {
      id: "3im-1",
      text: "Return chosen character to their player's hand. That player chooses and discards a card.",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
            },
          },
          {
            type: "discard",
            amount: 1,
            target: "CARD_OWNER",
            chosen: true,
          },
        ],
      },
    },
  ],
};
