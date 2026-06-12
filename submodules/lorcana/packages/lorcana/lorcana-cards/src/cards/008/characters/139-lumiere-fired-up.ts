import type { CharacterCard } from "@tcg/lorcana-types";
import { lumiereFiredUpI18n } from "./139-lumiere-fired-up.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { evasive } from "../../../helpers/abilities/evasive";

export const lumiereFiredUp: CharacterCard = {
  id: "Q3Y",
  canonicalId: "ci_Q3Y",
  reprints: ["set8-139"],
  cardType: "character",
  name: "Lumiere",
  version: "Fired Up",
  inkType: ["ruby", "sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  cardNumber: 139,
  rarity: "super_rare",
  cost: 5,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_29af9e5b5190472eaa2fb7e637fa3050",
    tcgPlayer: 631689,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "Evasive",
    },
    {
      title: "SACREBLEU!:",
      description: "Whenever one of your items is banished, this character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Floodborn", "Ally"],
  abilities: [
    shift(3),
    evasive,
    {
      id: "139-3",
      name: "SACREBLEU!",
      text: "SACREBLEU!: Whenever one of your items is banished, this character gets +1 {L} this turn.",
      trigger: {
        event: "banish",
        on: "YOUR_ITEMS",
        timing: "whenever",
      },
      effect: {
        type: "modify-stat",
        target: "SELF",
        stat: "lore",
        modifier: 1,
        duration: "this-turn",
      },
      type: "triggered",
    },
  ],
  i18n: lumiereFiredUpI18n,
};
