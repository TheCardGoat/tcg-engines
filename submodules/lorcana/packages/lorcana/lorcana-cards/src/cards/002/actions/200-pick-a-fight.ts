import type { ActionCard } from "@tcg/lorcana-types";
import { pickAFightI18n } from "./200-pick-a-fight.i18n";

export const pickAFight: ActionCard = {
  id: "3r0",
  canonicalId: "ci_3r0",
  reprints: ["set2-200"],
  cardType: "action",
  name: "Pick a Fight",
  inkType: ["steel"],
  franchise: "Wreck It Ralph",
  set: "002",
  cardNumber: 200,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5516a5f756734f2c89d1ef63e8c9964d",
    tcgPlayer: 527296,
  },
  text: "Chosen character can challenge ready characters this turn.",
  abilities: [
    {
      type: "action",
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        duration: "this-turn",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: pickAFightI18n,
};
