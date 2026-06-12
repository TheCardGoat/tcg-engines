import type { CharacterCard } from "@tcg/lorcana-types";
import { heiheiAccidentalExplorerI18n } from "./107-heihei-accidental-explorer.i18n";

export const heiheiAccidentalExplorer: CharacterCard = {
  id: "93O",
  canonicalId: "ci_93O",
  reprints: ["set3-107"],
  cardType: "character",
  name: "HeiHei",
  version: "Accidental Explorer",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  cardNumber: 107,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_27a77344b85748bd9d7d45de2969c918",
    tcgPlayer: 538342,
  },
  text: [
    {
      title: "MINDLESS WANDERING",
      description:
        "Once per turn, when this character moves to a location, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "j8v-1",
      name: "MINDLESS WANDERING",
      text: "MINDLESS WANDERING Once per turn, when this character moves to a location, each opponent loses 1 lore.",
      trigger: {
        event: "move",
        on: "SELF",
        timing: "when",
        restrictions: [
          {
            type: "once-per-turn",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: heiheiAccidentalExplorerI18n,
};
