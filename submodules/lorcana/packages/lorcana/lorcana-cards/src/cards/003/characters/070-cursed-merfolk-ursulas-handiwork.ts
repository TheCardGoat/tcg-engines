import type { CharacterCard } from "@tcg/lorcana-types";
import { cursedMerfolkUrsulasHandiworkI18n } from "./070-cursed-merfolk-ursulas-handiwork.i18n";

export const cursedMerfolkUrsulasHandiwork: CharacterCard = {
  id: "c1H",
  canonicalId: "ci_8Dp",
  reprints: ["set3-070", "set9-071"],
  cardType: "character",
  name: "Cursed Merfolk",
  version: "Ursula's Handiwork",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "003",
  cardNumber: 70,
  rarity: "rare",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_c571350ccb314e4aac4f3e79d9a29c87",
    tcgPlayer: 650013,
  },
  text: [
    {
      title: "POOR SOULS",
      description:
        "Whenever this character is challenged, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      id: "1pi-1",
      name: "POOR SOULS",
      text: "POOR SOULS Whenever this character is challenged, each opponent chooses and discards a card.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: cursedMerfolkUrsulasHandiworkI18n,
};
