import type { CharacterCard } from "@tcg/lorcana-types";
import { magicCarpetPhantomRugI18n } from "./183-magic-carpet-phantom-rug.i18n";
import { vanish } from "../../../helpers/abilities/vanish";

export const magicCarpetPhantomRug: CharacterCard = {
  id: "a00",
  canonicalId: "ci_a00",
  reprints: ["set8-183"],
  cardType: "character",
  name: "Magic Carpet",
  version: "Phantom Rug",
  inkType: ["steel"],
  franchise: "Aladdin",
  set: "008",
  cardNumber: 183,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bbeb5ead52854a1d869e7e449dc6aee7",
    tcgPlayer: 631472,
  },
  text: [
    {
      title: "Vanish",
      description: "(When an opponent chooses this character for an action, banish them.)",
    },
    {
      title: "SPECTRAL FORCE",
      description:
        "Your other Illusion characters gain Challenger +1. (They get +1 {S} while challenging.)",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
  abilities: [
    vanish,
    {
      effect: {
        keyword: "Challenger",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
          filter: [{ type: "has-classification", classification: "Illusion" }],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "3wd-2",
      name: "SPECTRAL FORCE",
      text: "SPECTRAL FORCE Your other Illusion characters gain Challenger +1.",
      type: "static",
    },
  ],
  i18n: magicCarpetPhantomRugI18n,
};
