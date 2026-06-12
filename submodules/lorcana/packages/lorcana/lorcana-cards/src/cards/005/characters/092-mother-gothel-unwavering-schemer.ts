import type { CharacterCard } from "@tcg/lorcana-types";
import { motherGothelUnwaveringSchemerI18n } from "./092-mother-gothel-unwavering-schemer.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const motherGothelUnwaveringSchemer: CharacterCard = {
  id: "7PI",
  canonicalId: "ci_7PI",
  reprints: ["set5-092"],
  cardType: "character",
  name: "Mother Gothel",
  version: "Unwavering Schemer",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "005",
  cardNumber: 92,
  rarity: "common",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_df75fce740274e7092a368c0dfa0b417",
    tcgPlayer: 561633,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "THE WORLD IS DARK",
      description:
        "When you play this character, each opponent chooses one of their characters and returns that card to their hand.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
  abilities: [
    shift(4),
    {
      id: "7PI-2",
      name: "THE WORLD IS DARK",
      text: "THE WORLD IS DARK When you play this character, each opponent chooses one of their characters and returns that card to their hand.",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "for-each-opponent",
        effect: {
          type: "return-to-hand",
          chosenBy: "opponent",
          target: {
            selector: "chosen",
            count: 1,
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: motherGothelUnwaveringSchemerI18n,
};
