import type { CharacterCard } from "@tcg/lorcana-types";
import { rayaKumandranRiderI18n } from "./107-raya-kumandran-rider.i18n";

export const rayaKumandranRider: CharacterCard = {
  id: "IVl",
  canonicalId: "ci_aR1",
  reprints: ["set6-107"],
  cardType: "character",
  name: "Raya",
  version: "Kumandran Rider",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "006",
  cardNumber: 107,
  rarity: "rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b1ea1c67fc224e968a4906149590585c",
    tcgPlayer: 592036,
  },
  text: [
    {
      title: "COME ON, LET'S DO THIS",
      description:
        "Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                excludeSelf: true,
              },
              type: "ready",
            },
            {
              duration: "this-turn",
              restriction: "cant-quest",
              target: {
                reference: "selected-first",
              },
              type: "restriction",
            },
          ],
        },
        type: "optional",
      },
      id: "1dx-1",
      name: "COME ON, LET'S DO THIS",
      text: "COME ON, LET'S DO THIS Once during your turn, whenever a card is put into your inkwell, you may ready another chosen character of yours. They can't quest for the rest of this turn.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: rayaKumandranRiderI18n,
};
