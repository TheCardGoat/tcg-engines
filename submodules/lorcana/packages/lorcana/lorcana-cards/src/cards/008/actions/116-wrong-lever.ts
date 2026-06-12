import type { ActionCard } from "@tcg/lorcana-types";
import { wrongLeverI18n } from "./116-wrong-lever.i18n";

export const wrongLever: ActionCard = {
  id: "NXU",
  canonicalId: "ci_M7a",
  reprints: ["set8-116"],
  cardType: "action",
  name: "Wrong Lever!",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  cardNumber: 116,
  rarity: "rare",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_a209d31e37bc44e78b2f56cf474bde5d",
    tcgPlayer: 631988,
  },
  text: "Choose one:\n- Return chosen character to their player's hand.\n- Put a Pull the Lever! card from your discard pile on the bottom of your deck to put chosen character on the bottom of their owner's deck.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "return-to-hand",
            target: "CHOSEN_CHARACTER",
          },
          {
            type: "sequence",
            steps: [
              {
                type: "put-on-bottom",
                target: {
                  selector: "all",
                  count: "all",
                  owner: "you",
                  zones: ["discard"],
                  cardTypes: ["action"],
                  filter: [
                    {
                      type: "has-name",
                      name: "Pull the Lever!",
                    },
                  ],
                },
              },
              {
                type: "conditional",
                condition: {
                  type: "if-you-do",
                },
                then: {
                  type: "put-on-bottom",
                  target: {
                    selector: "chosen",
                    count: 1,
                    owner: "any",
                    zones: ["play"],
                    cardTypes: ["character"],
                  },
                },
              },
            ],
          },
        ],
      },
    },
  ],
  i18n: wrongLeverI18n,
};
