import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyKlutzySkierI18n } from "./121-goofy-klutzy-skier.i18n";

export const goofyKlutzySkier: CharacterCard = {
  id: "4xG",
  canonicalId: "ci_sej",
  reprints: ["set11-121"],
  cardType: "character",
  name: "Goofy",
  version: "Klutzy Skier",
  inkType: ["ruby"],
  set: "011",
  cardNumber: 121,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_05285db16a3b4cb28941b7a24913d33f",
    tcgPlayer: 677151,
  },
  text: [
    {
      title: "YAAAAAAA-HOO-HOO-HOO-HOOEY",
      description: "{E}, Banish this character — Banish chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "4xG-1",
      name: "YAAAAAAA-HOO-HOO-HOO-HOOEY",
      text: "YAAAAAAA-HOO-HOO-HOO-HOOEY {E}, Banish this character — Banish chosen character.",
      type: "activated",
      cost: {
        exert: true,
        banishSelf: true,
      },
      effect: {
        type: "banish",
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
  i18n: goofyKlutzySkierI18n,
};
