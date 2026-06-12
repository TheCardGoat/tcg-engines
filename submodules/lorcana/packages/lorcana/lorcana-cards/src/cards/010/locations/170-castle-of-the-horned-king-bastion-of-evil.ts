import type { LocationCard } from "@tcg/lorcana-types";
import { castleOfTheHornedKingBastionOfEvilI18n } from "./170-castle-of-the-horned-king-bastion-of-evil.i18n";

export const castleOfTheHornedKingBastionOfEvil: LocationCard = {
  id: "ilT",
  canonicalId: "ci_ilT",
  reprints: ["set10-170"],
  cardType: "location",
  name: "Castle of the Horned King",
  version: "Bastion of Evil",
  inkType: ["sapphire"],
  franchise: "Black Cauldron",
  set: "010",
  cardNumber: 170,
  rarity: "rare",
  cost: 1,
  willpower: 5,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_da44468c05d647ad965adcaf8f568c8c",
    tcgPlayer: 659603,
  },
  text: [
    {
      title: "INTO THE GLOOM",
      description:
        "Once during your turn, whenever a character quests while here, you may ready chosen item.",
    },
  ],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "ready",
        },
        type: "optional",
      },
      id: "lzh-1",
      name: "INTO THE GLOOM",
      text: "INTO THE GLOOM Once during your turn, whenever a character quests while here, you may ready chosen item.",
      trigger: {
        event: "quest",
        on: "CHARACTERS_HERE",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: castleOfTheHornedKingBastionOfEvilI18n,
};
