import type { CharacterCard } from "@tcg/lorcana-types";
import { chiefTuiWeavingATaleI18n } from "./161-chief-tui-weaving-a-tale.i18n";

export const chiefTuiWeavingATale: CharacterCard = {
  id: "qN1",
  canonicalId: "ci_qN1",
  reprints: ["set11-161"],
  cardType: "character",
  name: "Chief Tui",
  version: "Weaving a Tale",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "011",
  cardNumber: 161,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1bd99dad44d341dda6d1f73ffb2bc529",
    tcgPlayer: 676227,
  },
  text: [
    {
      title: "AND THEN...",
      description:
        "Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Mentor", "King"],
  abilities: [
    {
      id: "1om-1",
      name: "AND THEN...",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          destinations: [
            {
              zone: "deck-top",
              min: 0,
              max: 1,
            },
            {
              zone: "deck-bottom",
              remainder: true,
            },
          ],
        },
        type: "optional",
      },
      text: "AND THEN... Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [
          {
            type: "once-per-turn",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: chiefTuiWeavingATaleI18n,
};
