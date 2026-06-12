import type { CharacterCard } from "@tcg/lorcana-types";
import { bellwetherMasterManipulatorI18n } from "./082-bellwether-master-manipulator.i18n";

export const bellwetherMasterManipulator: CharacterCard = {
  id: "bgf",
  canonicalId: "ci_bgf",
  reprints: ["set10-082"],
  cardType: "character",
  name: "Bellwether",
  version: "Master Manipulator",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "010",
  cardNumber: 82,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5c98a0c3b0924e90bb20d53354594c02",
    tcgPlayer: 658342,
  },
  text: [
    {
      title: "VENDETTA",
      description:
        "When this character is challenged and banished, put 1 damage counter on each opposing character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "opponent",
          selector: "all",
          zones: ["play"],
        },
        type: "put-damage",
      },
      id: "x28-1",
      name: "VENDETTA",
      sourceZones: ["play", "discard"],
      text: "VENDETTA When this character is challenged and banished, put 1 damage counter on each opposing character.",
      trigger: {
        event: "challenged-and-banished",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: bellwetherMasterManipulatorI18n,
};
