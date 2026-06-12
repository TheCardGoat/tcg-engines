import type { CharacterCard } from "@tcg/lorcana-types";
import { mulanEnemyOfEntanglementI18n } from "./115-mulan-enemy-of-entanglement.i18n";

export const mulanEnemyOfEntanglement: CharacterCard = {
  id: "Pd1",
  canonicalId: "ci_Pd1",
  reprints: ["set4-115"],
  cardType: "character",
  name: "Mulan",
  version: "Enemy of Entanglement",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 115,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_263c69baf83347208e5cd76863a4afd9",
    tcgPlayer: 547645,
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
  i18n: mulanEnemyOfEntanglementI18n,
};
