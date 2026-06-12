import type { CharacterCard } from "@tcg/lorcana-types";
import { magicBroomBrigadeCommanderI18n } from "./186-magic-broom-brigade-commander.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const magicBroomBrigadeCommander: CharacterCard = {
  id: "g7O",
  canonicalId: "ci_g7O",
  reprints: ["set4-186"],
  cardType: "character",
  name: "Magic Broom",
  version: "Brigade Commander",
  inkType: ["steel"],
  franchise: "Fantasia",
  set: "004",
  cardNumber: 186,
  rarity: "common",
  cost: 6,
  strength: 2,
  willpower: 6,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_989cc7ce93b04fae9388328e9f46d840",
    tcgPlayer: 550618,
  },
  text: [
    {
      title: "Resist +1",
    },
    {
      title: "ARMY OF BROOMS",
      description:
        "This character gets +2 {S} for each other character named Magic Broom you have in play.",
    },
  ],
  classifications: ["Dreamborn", "Broom"],
  abilities: [
    resist(1),
    {
      effect: {
        modifier: {
          type: "filtered-count",
          filters: [{ type: "has-name", name: "Magic Broom" }],
          owner: "you",
          cardType: "character",
          excludeSelf: true,
          multiplier: 2,
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "pct-2",
      name: "ARMY OF BROOMS",
      text: "ARMY OF BROOMS This character gets +2 {S} for each other character named Magic Broom you have in play.",
      type: "static",
    },
  ],
  i18n: magicBroomBrigadeCommanderI18n,
};
