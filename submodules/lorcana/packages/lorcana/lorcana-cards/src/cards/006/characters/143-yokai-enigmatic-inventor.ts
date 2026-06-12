import type { CharacterCard } from "@tcg/lorcana-types";
import { yokaiEnigmaticInventorI18n } from "./143-yokai-enigmatic-inventor.i18n";

export const yokaiEnigmaticInventor: CharacterCard = {
  id: "zRb",
  canonicalId: "ci_zRb",
  reprints: ["set6-143"],
  cardType: "character",
  name: "Yokai",
  version: "Enigmatic Inventor",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  cardNumber: 143,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_aa952f818e964c30b5d4be10e3654474",
    tcgPlayer: 583210,
  },
  text: [
    {
      title: "TIME TO UPGRADE",
      description:
        "Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Inventor"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                count: 1,
                owner: "you",
                zones: ["play"],
                cardTypes: ["item"],
              },
            },
            {
              type: "cost-reduction",
              amount: 2,
              cardType: "item",
              duration: "next-play-this-turn",
              target: "CONTROLLER",
            },
          ],
        },
        type: "optional",
      },
      id: "nt2-1",
      name: "TIME TO UPGRADE",
      text: "TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: yokaiEnigmaticInventorI18n,
};
