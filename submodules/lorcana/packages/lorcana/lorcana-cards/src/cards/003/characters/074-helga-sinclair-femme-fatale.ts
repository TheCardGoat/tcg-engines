import type { CharacterCard } from "@tcg/lorcana-types";
import { helgaSinclairFemmeFataleI18n } from "./074-helga-sinclair-femme-fatale.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const helgaSinclairFemmeFatale: CharacterCard = {
  id: "akr",
  canonicalId: "ci_akr",
  reprints: ["set3-074"],
  cardType: "character",
  name: "Helga Sinclair",
  version: "Femme Fatale",
  inkType: ["emerald"],
  franchise: "Atlantis",
  set: "003",
  cardNumber: 74,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_bd43b98b4db44fc49f0aea4790ad393a",
    tcgPlayer: 537764,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "THIS CHANGES EVERYTHING",
      description:
        "Whenever this character quests, you may deal 3 damage to chosen damaged character.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
  abilities: [
    shift(3),
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 3,
          target: "CHOSEN_DAMAGED_CHARACTER",
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "1t9-2",
      name: "THIS CHANGES EVERYTHING",
      text: "THIS CHANGES EVERYTHING Whenever this character quests, you may deal 3 damage to chosen damaged character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: helgaSinclairFemmeFataleI18n,
};
