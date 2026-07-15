import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyKlutzySkierEpicI18n } from "./216-goofy-klutzy-skier-epic.i18n";

export const goofyKlutzySkierEpic: CharacterCard = {
  id: "0G5",
  canonicalId: "ci_sej",
  slug: "lorcana-ci_sej",
  printings: [
    {
      id: "set11-216-epic",
      artId: "ci_sej-epic",
      setCode: "set11",
      collectorNumber: "216",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set11-121"],
  cardType: "character",
  name: "Goofy",
  version: "Klutzy Skier",
  inkType: ["ruby"],
  set: "011",
  cardNumber: 216,
  rarity: "common",
  specialRarity: "epic",
  cost: 3,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_05285db16a3b4cb28941b7a24913d33f",
    tcgPlayer: "677151",
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
  i18n: goofyKlutzySkierEpicI18n,
};
