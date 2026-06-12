import type { CharacterCard } from "@tcg/lorcana-types";
import { flynnRiderCharmingRogueI18n } from "./074-flynn-rider-charming-rogue.i18n";

export const flynnRiderCharmingRogue: CharacterCard = {
  id: "a9K",
  canonicalId: "ci_a9K",
  reprints: ["set1-074"],
  cardType: "character",
  name: "Flynn Rider",
  version: "Charming Rogue",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 74,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_c0742f7731e04b749870bceb5c6b133b",
    tcgPlayer: 506833,
  },
  text: [
    {
      title: "HERE COMES THE SMOLDER",
      description:
        "Whenever this character is challenged, the challenging player chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        from: "hand",
        target: "CHALLENGING_PLAYER",
        type: "discard",
      },
      id: "qk8-1",
      name: "HERE COMES THE SMOLDER",
      text: "HERE COMES THE SMOLDER Whenever this character is challenged, the challenging player chooses and discards a card.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: flynnRiderCharmingRogueI18n,
};
