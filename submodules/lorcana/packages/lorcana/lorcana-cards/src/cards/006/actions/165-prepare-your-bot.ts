import type { ActionCard } from "@tcg/lorcana-types";
import { prepareYourBotI18n } from "./165-prepare-your-bot.i18n";

export const prepareYourBot: ActionCard = {
  id: "o3v",
  canonicalId: "ci_o3v",
  reprints: ["set6-165"],
  cardType: "action",
  name: "Prepare Your Bot",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 165,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_21d32224cf9f452ab94f70d9a2b40d79",
    tcgPlayer: 587504,
  },
  text: [
    {
      title: "Choose one:",
    },
    {
      title: "* Ready chosen item.",
    },
    {
      title: "* Ready chosen Robot character. They can't quest for the rest of this turn.",
    },
  ],
  abilities: [
    {
      type: "action",
      effect: {
        type: "choice",
        options: [
          {
            type: "ready",
            target: "CHOSEN_ITEM",
          },
          {
            type: "sequence",
            steps: [
              {
                type: "ready",
                target: {
                  selector: "chosen",
                  count: 1,
                  owner: "you",
                  zones: ["play"],
                  cardTypes: ["character"],
                  filter: [
                    {
                      type: "has-classification",
                      classification: "Robot",
                    },
                  ],
                },
              },
              {
                type: "restriction",
                restriction: "cant-quest",
                duration: "this-turn",
                target: {
                  ref: "previous-target",
                },
              },
            ],
          },
        ],
      },
    },
  ],
  i18n: prepareYourBotI18n,
};
