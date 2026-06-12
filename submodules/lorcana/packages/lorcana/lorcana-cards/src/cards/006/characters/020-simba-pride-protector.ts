import type { CharacterCard } from "@tcg/lorcana-types";
import { simbaPrideProtectorI18n } from "./020-simba-pride-protector.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const simbaPrideProtector: CharacterCard = {
  id: "pBr",
  canonicalId: "ci_pBr",
  reprints: ["set6-020"],
  cardType: "character",
  name: "Simba",
  version: "Pride Protector",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "006",
  cardNumber: 20,
  rarity: "legendary",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_a94b5e02de4a43bdba60303fffe3d20f",
    tcgPlayer: 591991,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "UNDERSTAND THE BALANCE",
      description:
        "At the end of your turn, if this character is exerted, you may ready your other characters.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
  abilities: [
    shift(3),
    {
      id: "1i7-2",
      name: "UNDERSTAND THE BALANCE",
      type: "triggered",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          reference: "source",
          filters: [
            {
              type: "exerted",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
            excludeSelf: true,
          },
          type: "ready",
        },
        type: "optional",
      },
      text: "UNDERSTAND THE BALANCE At the end of your turn, if this character is exerted, you may ready your other characters.",
    },
  ],
  i18n: simbaPrideProtectorI18n,
};
