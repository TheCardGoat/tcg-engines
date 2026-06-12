import type { CharacterCard } from "@tcg/lorcana-types";
import { tipoGrowingSonI18n } from "./157-tipo-growing-son.i18n";

export const tipoGrowingSon: CharacterCard = {
  id: "gPY",
  canonicalId: "ci_gPY",
  reprints: ["set5-157"],
  cardType: "character",
  name: "Tipo",
  version: "Growing Son",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 157,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bef15d42bda94a50a0fea05384b4cd72",
    tcgPlayer: 560584,
  },
  text: [
    {
      title: "MEASURE ME AGAIN",
      description:
        "When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "hand",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "1wt-1",
      name: "MEASURE ME AGAIN",
      text: "MEASURE ME AGAIN When you play this character, you may put a card from your hand into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: tipoGrowingSonI18n,
};
