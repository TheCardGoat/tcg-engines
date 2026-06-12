import type { CharacterCard } from "@tcg/lorcana-types";
import { reckless } from "../../../helpers/abilities/reckless";
import { aresGodOfWarI18n } from "./104-ares-god-of-war.i18n";

export const aresGodOfWar: CharacterCard = {
  id: "S33",
  canonicalId: "ci_S33",
  reprints: ["set10-104"],
  cardType: "character",
  name: "Ares",
  version: "God of War",
  inkType: ["ruby"],
  franchise: "Hercules",
  set: "010",
  cardNumber: 104,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_1b9b2bd814d249f2ab8ae1db9949c045",
    tcgPlayer: 660339,
  },
  text: "Reckless CALL TO BATTLE Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.",
  classifications: ["Storyborn", "Deity"],
  abilities: [
    reckless,
    {
      effect: {
        steps: [
          {
            chooser: "CONTROLLER",
            effect: {
              type: "ready",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character"],
              },
            },
            type: "optional",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: {
              ref: "previous-target",
            },
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "3s2-2",
      name: "CALL TO BATTLE",
      text: "CALL TO BATTLE Once during your turn, whenever you put a card under one of your characters or locations, you may ready chosen character. If you do, that character can't quest for the rest of this turn.",
      trigger: {
        event: "put-card-under",
        on: "YOUR_CHARACTERS_OR_LOCATIONS",
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
  i18n: aresGodOfWarI18n,
};
