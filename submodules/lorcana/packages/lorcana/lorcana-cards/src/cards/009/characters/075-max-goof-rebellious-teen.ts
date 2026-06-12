import type { CharacterCard } from "@tcg/lorcana-types";
import { maxGoofRebelliousTeenI18n } from "./075-max-goof-rebellious-teen.i18n";

export const maxGoofRebelliousTeen: CharacterCard = {
  id: "A7j",
  canonicalId: "ci_A7j",
  reprints: ["set9-075"],
  cardType: "character",
  name: "Max Goof",
  version: "Rebellious Teen",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 75,
  rarity: "rare",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_0599c55386a649bb9af21a906ed52db5",
    tcgPlayer: 647681,
  },
  text: [
    {
      title: "PERSONAL SOUNDTRACK",
      description:
        "When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            type: "return-from-discard",
            target: "CONTROLLER",
            cardType: "song",
            filter: {
              cardType: "song",
              maxCost: 3,
            },
          },
        },
        type: "optional",
      },
      id: "1va-1",
      name: "PERSONAL SOUNDTRACK",
      text: "PERSONAL SOUNDTRACK When you play this character, you may pay 1 {I} to return a song card with cost 3 or less from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: maxGoofRebelliousTeenI18n,
};
