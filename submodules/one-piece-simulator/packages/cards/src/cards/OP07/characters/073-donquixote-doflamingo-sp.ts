import type { CharacterCard } from "@tcg/op-types";
import { op07DonquixoteDoflamingoSp073I18n } from "./073-donquixote-doflamingo-sp.i18n.ts";

export const op07DonquixoteDoflamingoSp073: CharacterCard = {
  id: "OP01-073",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "OP07",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates The Seven Warlords of the Sea"],
  attribute: "special",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Look at 5 cards from the top of your deck and place them at the top or bottom of the deck in any order.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 5,
            position: "topOrBottom",
          },
        ],
      },
    ],
  },
  i18n: op07DonquixoteDoflamingoSp073I18n,
};
