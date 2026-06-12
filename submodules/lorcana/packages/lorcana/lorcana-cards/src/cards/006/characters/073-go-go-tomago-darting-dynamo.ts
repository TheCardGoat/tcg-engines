import type { CharacterCard } from "@tcg/lorcana-types";
import { goGoTomagoDartingDynamoI18n } from "./073-go-go-tomago-darting-dynamo.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const goGoTomagoDartingDynamo: CharacterCard = {
  id: "4JN",
  canonicalId: "ci_4JN",
  reprints: ["set6-073"],
  cardType: "character",
  name: "Go Go Tomago",
  version: "Darting Dynamo",
  inkType: ["emerald"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 73,
  rarity: "rare",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2331f6d883e04464ba99cfff895683e2",
    tcgPlayer: 578177,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "STOP WHINING, WOMAN UP",
      description:
        "When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
  abilities: [
    evasive,
    {
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 2,
          },
          effect: {
            type: "for-each",
            counter: {
              type: "damage-on-target",
            },
            target: "CHOSEN_OPPOSING_CHARACTER",
            effect: {
              amount: 1,
              target: "CONTROLLER",
              type: "gain-lore",
            },
          },
        },
      },
      id: "1b9-2",
      name: "STOP WHINING, WOMAN UP",
      text: "STOP WHINING, WOMAN UP When you play this character, you may pay 2 {I} to gain lore equal to the damage on chosen opposing character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: goGoTomagoDartingDynamoI18n,
};
