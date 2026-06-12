import type { CharacterCard } from "@tcg/lorcana-types";
import { cheshireCatFromTheShadowsI18n } from "./075-cheshire-cat-from-the-shadows.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const cheshireCatFromTheShadows: CharacterCard = {
  id: "zI1",
  canonicalId: "ci_zI1",
  reprints: ["set2-075"],
  cardType: "character",
  name: "Cheshire Cat",
  version: "From the Shadows",
  inkType: ["emerald"],
  franchise: "Alice in Wonderland",
  set: "002",
  cardNumber: 75,
  rarity: "common",
  cost: 8,
  strength: 5,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7212b4d89eff4f039568f65cc8fd9855",
    tcgPlayer: 526613,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "Evasive",
    },
    {
      title: "WICKED SMILE",
      description: "{E} — Banish chosen damaged character.",
    },
  ],
  classifications: ["Floodborn"],
  abilities: [
    shift(5),
    evasive,
    {
      id: "wxg-3",
      name: "WICKED SMILE",
      text: "WICKED SMILE {E} — Banish chosen damaged character.",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        target: "CHOSEN_DAMAGED_CHARACTER",
        type: "banish",
      },
    },
  ],
  i18n: cheshireCatFromTheShadowsI18n,
};
