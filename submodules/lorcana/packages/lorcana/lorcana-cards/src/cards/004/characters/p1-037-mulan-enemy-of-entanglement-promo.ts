import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanEnemyOfEntanglementP1PromoI18n } from "./p1-037-mulan-enemy-of-entanglement-promo.i18n";

export const mulanEnemyOfEntanglementP1Promo: CharacterCard = {
  id: "b6X",
  canonicalId: "ci_laZ",
  slug: "lorcana-ci_laZ",
  printings: [
    {
      id: "set4-p1-037-promo",
      artId: "ci_laZ-promo",
      setCode: "set4",
      collectorNumber: "37",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set4-115"],
  cardType: "character",
  name: "Mulan",
  version: "Enemy of Entanglement",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 37,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_263c69baf83347208e5cd76863a4afd9",
    tcgPlayer: "547645",
  },
  text: [
    {
      title: "TIME TO SHINE",
      description: "Whenever you play an action, this character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1p7-1",
      name: "TIME TO SHINE",
      text: "TIME TO SHINE Whenever you play an action, this character gets +2 {S} this turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: mulanEnemyOfEntanglementP1PromoI18n,
};
