import type { CharacterCard } from "@tcg/lorcana-types";
import { lordMacguffinCleverSwordsmanI18n } from "./078-lord-macguffin-clever-swordsman.i18n";

export const lordMacguffinCleverSwordsman: CharacterCard = {
  id: "XII",
  canonicalId: "ci_XII",
  reprints: ["set12-078"],
  cardType: "character",
  name: "Lord MacGuffin",
  version: "Clever Swordsman",
  inkType: ["emerald"],
  franchise: "Brave",
  set: "012",
  cardNumber: 78,
  rarity: "uncommon",
  cost: 5,
  strength: 6,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_71d961ae91de4bd1970b32e561d1f3af",
  },
  text: [
    {
      title: "WAIT FOR IT...",
      description:
        "This character may enter play exerted to deal 3 damage to chosen damaged character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "XII-1",
      name: "WAIT FOR IT...",
      type: "static",
      text: "WAIT FOR IT... This character may enter play exerted to deal 3 damage to chosen damaged character.",
      effect: {
        type: "restriction",
        restriction: "may-enter-play-exerted",
        target: "SELF",
      },
    },
    {
      id: "XII-2",
      name: "WAIT FOR IT...",
      type: "triggered",
      text: "WAIT FOR IT... This character may enter play exerted to deal 3 damage to chosen damaged character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "is-exerted",
      },
      effect: {
        type: "deal-damage",
        amount: 3,
        target: "CHOSEN_DAMAGED_CHARACTER",
      },
    },
  ],
  i18n: lordMacguffinCleverSwordsmanI18n,
};
