import type { CharacterCard } from "@tcg/lorcana-types";
import { moanaOfMotunuiI18n } from "./014-moana-of-motunui.i18n";

export const moanaOfMotunui: CharacterCard = {
  id: "u8U",
  canonicalId: "ci_Pdi",
  reprints: ["set1-014", "set9-020"],
  cardType: "character",
  name: "Moana",
  version: "Of Motunui",
  inkType: ["amber"],
  franchise: "Moana",
  set: "001",
  cardNumber: 14,
  rarity: "rare",
  cost: 5,
  strength: 1,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_612c000e0f7047659edee1e275069811",
    tcgPlayer: 649968,
  },
  text: [
    {
      title: "WE CAN FIX IT",
      description:
        "Whenever this character quests, you may ready your other Princess characters. They can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          steps: [
            {
              type: "ready",
              target: {
                selector: "all",
                count: "all",
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "has-classification",
                    classification: "Princess",
                  },
                ],
                excludeSelf: true,
              },
            },
            {
              duration: "this-turn",
              restriction: "cant-quest",
              target: {
                selector: "all",
                count: "all",
                owner: "you",
                zones: ["play"],
                cardTypes: ["character"],
                filter: [
                  {
                    type: "has-classification",
                    classification: "Princess",
                  },
                ],
                excludeSelf: true,
              },
              type: "restriction",
            },
          ],
          type: "sequence",
        },
        type: "optional",
      },
      id: "n94-1",
      name: "WE CAN FIX IT",
      text: "WE CAN FIX IT Whenever this character quests, you may ready your other exerted Princess characters. If you do, they can't quest for the rest of this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: moanaOfMotunuiI18n,
};
