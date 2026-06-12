import type { CharacterCard } from "@tcg/lorcana-types";
import { basilGreatMouseDetectiveI18n } from "./138-basil-great-mouse-detective.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const basilGreatMouseDetective: CharacterCard = {
  id: "rNe",
  canonicalId: "ci_rNe",
  reprints: ["set2-138"],
  cardType: "character",
  name: "Basil",
  version: "Great Mouse Detective",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 138,
  rarity: "common",
  cost: 6,
  strength: 3,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_ebdef6b29bb74afaa3e5efea83fe89c7",
    tcgPlayer: 525232,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "THERE'S ALWAYS A CHANCE",
      description:
        "If you used Shift to play this character, you may draw 2 cards when he enters play.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Detective"],
  abilities: [
    shift(5),
    {
      id: "1vg-2",
      name: "THERE'S ALWAYS A CHANCE",
      text: "THERE'S ALWAYS A CHANCE If you used Shift to play this character, you may draw 2 cards when he enters play.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      condition: {
        type: "used-shift",
      },
    },
  ],
  i18n: basilGreatMouseDetectiveI18n,
};
