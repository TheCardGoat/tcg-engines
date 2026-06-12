import type { CharacterCard } from "@tcg/lorcana-types";
import { chacaJuniorChipmunkI18n } from "./088-chaca-junior-chipmunk.i18n";

export const chacaJuniorChipmunk: CharacterCard = {
  id: "Vx6",
  canonicalId: "ci_Vx6",
  reprints: ["set8-088"],
  cardType: "character",
  name: "Chaca",
  version: "Junior Chipmunk",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  cardNumber: 88,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4be229ca7b79419896cf9bea3c11ee66",
    tcgPlayer: 631409,
  },
  text: [
    {
      title: "IN CAHOOTS",
      description:
        "When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "has-named-character",
        name: "Tipo",
        controller: "you",
      },
      effect: {
        keyword: "Reckless",
        duration: "their-next-turn",
        target: "CHOSEN_OPPOSING_CHARACTER",
        type: "gain-keyword",
      },
      id: "mhv-1",
      name: "IN CAHOOTS",
      text: "IN CAHOOTS When you play this character, if you have a character named Tipo in play, chosen opposing character gains Reckless during their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: chacaJuniorChipmunkI18n,
};
