import type { CharacterCard } from "@tcg/lorcana-types";
import { mauiStubbornTricksterI18n } from "./110-maui-stubborn-trickster.i18n";

export const mauiStubbornTrickster: CharacterCard = {
  id: "axI",
  canonicalId: "ci_axI",
  slug: "lorcana-ci_axI",
  printings: [
    {
      id: "set8-110",
      artId: "set8-110",
      setCode: "set8",
      collectorNumber: "110",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set8-110"],
  cardType: "character",
  name: "Maui",
  version: "Stubborn Trickster",
  inkType: ["emerald", "steel"],
  franchise: "Moana",
  set: "008",
  cardNumber: 110,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_e58f4c06ff8049e791b111019217c486",
    tcgPlayer: "630062",
  },
  text: "I'M NOT FINISHED YET When this character is banished, choose one:\n- Put 2 damage counters on all opposing characters.\n- Banish all opposing items.\n- Banish all opposing locations.",
  classifications: ["Storyborn", "Hero", "Deity"],
  abilities: [
    {
      id: "axI-1",
      name: "I'M NOT FINISHED YET",
      text: "I'M NOT FINISHED YET When this character is banished, choose one:\n- Put 2 damage counters on all opposing characters.\n- Banish all opposing items.\n- Banish all opposing locations.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "choice",
        optionLabels: [
          "Put 2 damage counters on all opposing characters.",
          "Banish all opposing items.",
          "Banish all opposing locations.",
        ],
        options: [
          {
            type: "put-damage",
            amount: 2,
            target: "ALL_OPPOSING_CHARACTERS",
          },
          {
            type: "banish",
            target: "ALL_OPPOSING_ITEMS",
          },
          {
            type: "banish",
            target: "ALL_OPPOSING_LOCATIONS",
          },
        ],
      },
    },
  ],
  i18n: mauiStubbornTricksterI18n,
};
