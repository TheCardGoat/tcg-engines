import type { CharacterCard, Effect } from "@tcg/lorcana-types";
import { ward } from "../../../helpers/abilities";
import { minnieMouseUrbanVisionaryI18n } from "./155-minnie-mouse-urban-visionary.i18n";

const returnOneInk: Effect = {
  type: "optional",
  chooser: "CONTROLLER",
  effect: {
    type: "return-to-hand",
    target: { selector: "chosen", count: 1, owner: "you", zones: ["inkwell"] },
  },
};
const exertOwnInk: Effect = {
  type: "exert",
  target: { selector: "all", count: "all", owner: "you", zones: ["inkwell"] },
};

export const minnieMouseUrbanVisionary: CharacterCard = {
  id: "n5b",
  canonicalId: "ci_n5b",
  slug: "lorcana-ci_n5b",
  printings: [
    {
      id: "set14-155",
      artId: "set14-155",
      setCode: "set14",
      collectorNumber: "155",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-155"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Urban Visionary",
  inkType: ["sapphire"],
  set: "014",
  cardNumber: 155,
  rarity: "super_rare",
  cost: 8,
  strength: 6,
  willpower: 6,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_3c5e60f59da54544b4757e8f00d5c902",
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "ALL BY DESIGN",
      description:
        "At the end of your turn, if this character is exerted, you may look at the cards in your inkwell and then you may return one to your hand. If you do either, exert all cards in your inkwell.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    ward,
    {
      id: "minnie-1",
      name: "ALL BY DESIGN",
      type: "triggered",
      text: "ALL BY DESIGN At the end of your turn, if this character is exerted, you may look at the cards in your inkwell and then you may return one to your hand. If you do either, exert all cards in your inkwell.",
      trigger: {
        event: "end-turn",
        on: "YOU",
        timing: "at",
      },
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "optional",
            chooser: "CONTROLLER",
            effect: { type: "reveal-inkwell", target: "CONTROLLER" },
          },
          {
            type: "conditional",
            condition: { type: "if-you-do" },
            then: { type: "sequence", steps: [returnOneInk, exertOwnInk] },
            else: {
              type: "sequence",
              steps: [
                returnOneInk,
                { type: "conditional", condition: { type: "if-you-do" }, then: exertOwnInk },
              ],
            },
          },
        ],
      },
    },
  ],
  i18n: minnieMouseUrbanVisionaryI18n,
};
