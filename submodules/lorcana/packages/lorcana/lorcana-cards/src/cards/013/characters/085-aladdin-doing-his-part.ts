import type { CharacterCard } from "@tcg/lorcana-types";
import { aladdinDoingHisPartI18n } from "./085-aladdin-doing-his-part.i18n";

export const aladdinDoingHisPart: CharacterCard = {
  id: "OkJ",
  canonicalId: "ci_OkJ",
  slug: "lorcana-ci_OkJ",
  printings: [
    {
      id: "set13-085",
      artId: "set13-085",
      setCode: "set13",
      collectorNumber: "85",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-085"],
  cardType: "character",
  name: "Aladdin",
  version: "Doing His Part",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "013",
  cardNumber: 85,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Clear It Out",
      description: "When you play this character, you may pay 1 {I} to banish chosen item.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      type: "triggered",
      name: "CLEAR IT OUT",
      text: "CLEAR IT OUT When you play this character, you may pay 1 {I} to banish chosen item.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "pay-cost",
          cost: {
            ink: 1,
          },
          effect: {
            type: "banish",
            target: {
              selector: "chosen",
              count: 1,
              owner: "any",
              zones: ["play"],
              cardTypes: ["item"],
            },
          },
        },
      },
    },
  ],
  i18n: aladdinDoingHisPartI18n,
};
