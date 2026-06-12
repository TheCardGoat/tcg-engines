import type { CharacterCard } from "@tcg/lorcana-types";
import { aliceClumsyAsCanBeI18n } from "./104-alice-clumsy-as-can-be.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const aliceClumsyAsCanBe: CharacterCard = {
  id: "Xgj",
  canonicalId: "ci_Xgj",
  reprints: ["set8-104"],
  cardType: "character",
  name: "Alice",
  version: "Clumsy as Can Be",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "008",
  cardNumber: 104,
  rarity: "rare",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_2de38611ab924e2da249c2ceeb1eb89d",
    tcgPlayer: 631417,
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "ACCIDENT PRONE",
      description: "Whenever this character quests, put 1 damage counter on each other character.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(3),
    {
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: "all",
          owner: "any",
          selector: "all",
          zones: ["play"],
          excludeSelf: true,
        },
        type: "put-damage",
      },
      id: "luf-2",
      name: "ACCIDENT PRONE",
      text: "ACCIDENT PRONE Whenever this character quests, put 1 damage counter on each other character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: aliceClumsyAsCanBeI18n,
};
