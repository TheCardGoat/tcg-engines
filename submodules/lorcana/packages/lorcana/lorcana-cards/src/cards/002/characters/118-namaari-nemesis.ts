import type { CharacterCard } from "@tcg/lorcana-types";
import { namaariNemesisI18n } from "./118-namaari-nemesis.i18n";

export const namaariNemesis: CharacterCard = {
  id: "SWw",
  canonicalId: "ci_SWw",
  reprints: ["set2-118"],
  cardType: "character",
  name: "Namaari",
  version: "Nemesis",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 118,
  rarity: "super_rare",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_6b414f08443c4f009d32f627f1d46256",
    tcgPlayer: 527757,
  },
  text: [
    {
      title: "THIS SHOULDN'T TAKE LONG",
      description: "{E}, Banish this character — Banish chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Princess"],
  abilities: [
    {
      id: "ywq-1",
      name: "THIS SHOULDN'T TAKE LONG",
      text: "THIS SHOULDN'T TAKE LONG {E}, Banish this character — Banish chosen character.",
      type: "activated",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        target: "CHOSEN_CHARACTER",
        type: "banish",
      },
    },
  ],
  i18n: namaariNemesisI18n,
};
