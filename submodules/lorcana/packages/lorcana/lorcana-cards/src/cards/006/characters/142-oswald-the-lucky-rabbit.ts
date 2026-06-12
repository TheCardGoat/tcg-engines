import type { CharacterCard } from "@tcg/lorcana-types";
import { oswaldTheLuckyRabbitI18n } from "./142-oswald-the-lucky-rabbit.i18n";

export const oswaldTheLuckyRabbit: CharacterCard = {
  id: "Wrn",
  canonicalId: "ci_Wrn",
  reprints: ["set6-142"],
  cardType: "character",
  name: "Oswald",
  version: "The Lucky Rabbit",
  inkType: ["sapphire"],
  set: "006",
  cardNumber: 142,
  rarity: "legendary",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5fe66ed6c5c842ac9e0ea2eba5ca3a4f",
    tcgPlayer: 579933,
  },
  text: [
    {
      title: "FAVORABLE CHANCE",
      description:
        "During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it's an item card, you may play that item for free and it enters play exerted. Otherwise, put it on the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "tu2-1",
      type: "triggered",
      name: "FAVORABLE CHANCE",
      text: "FAVORABLE CHANCE During your turn, whenever a card is put into your inkwell, you may reveal the top card of your deck. If it’s an item card, you may play that item for free and it enters play exerted. Otherwise, put it on the bottom of your deck.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
        ],
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          destinations: [
            {
              zone: "play",
              min: 0,
              max: 1,
              cost: "free",
              reveal: true,
              entersExerted: true,
              filters: [
                {
                  type: "card-type",
                  cardType: "item",
                },
              ],
            },
            {
              zone: "deck-bottom",
              remainder: true,
            },
          ],
        },
      },
    },
  ],
  i18n: oswaldTheLuckyRabbitI18n,
};
