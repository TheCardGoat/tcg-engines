import type { CharacterCard } from "@tcg/lorcana-types";
import { oswaldTheLuckyRabbitD23I18n } from "./d23-006-oswald-the-lucky-rabbit.i18n";

export const oswaldTheLuckyRabbitD23: CharacterCard = {
  id: "EB8",
  canonicalId: "ci_Wrn",
  slug: "lorcana-ci_Wrn",
  printings: [
    {
      id: "set6-d23-006",
      artId: "set6-d23-006",
      setCode: "set6",
      collectorNumber: "6",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set6-d23-006", "set6-142"],
  cardType: "character",
  name: "Oswald",
  version: "The Lucky Rabbit",
  inkType: ["sapphire"],
  franchise: "D23",
  set: "006",
  cardNumber: 6,
  rarity: "special",
  cost: 2,
  strength: 2,
  willpower: 1,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5fe66ed6c5c842ac9e0ea2eba5ca3a4f",
    tcgPlayer: "579933",
  },
  text: [
    {
      title: "[Favorable Chance]",
      description:
        "During your turn, whenever a card is put into your inkwell, reveal the top card of your deck. If it's an item card you may play it for free, exerted. Otherwise, put it on the bottom of your deck.",
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
  i18n: oswaldTheLuckyRabbitD23I18n,
};
