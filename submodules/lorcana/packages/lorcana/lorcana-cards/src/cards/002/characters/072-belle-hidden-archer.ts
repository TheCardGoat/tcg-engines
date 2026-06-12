import type { CharacterCard } from "@tcg/lorcana-types";
import { belleHiddenArcherI18n } from "./072-belle-hidden-archer.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const belleHiddenArcher: CharacterCard = {
  id: "df2",
  canonicalId: "ci_df2",
  reprints: ["set2-072"],
  cardType: "character",
  name: "Belle",
  version: "Hidden Archer",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 72,
  rarity: "legendary",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_db68b32c197d4f808a46afc957338877",
    tcgPlayer: 516417,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "THORNY ARROWS",
      description:
        "Whenever this character is challenged, the challenging character's player discards all cards in their hand.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    shift(3),
    {
      id: "cyn-2",
      name: "THORNY ARROWS",
      text: "THORNY ARROWS Whenever this character is challenged, the challenging character's player discards all cards in their hand.",
      type: "triggered",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        amount: "all",
        target: "CHALLENGING_PLAYER",
        type: "discard",
      },
    },
  ],
  i18n: belleHiddenArcherI18n,
};
