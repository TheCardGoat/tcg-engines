import type { CharacterCard } from "@tcg/lorcana-types";
import { mufasaAmongTheStarsI18n } from "./079-mufasa-among-the-stars.i18n";
import { shift } from "../../../helpers/abilities/shift";
import { evasive } from "../../../helpers/abilities/evasive";
import { resist } from "../../../helpers/abilities/resist";

export const mufasaAmongTheStars: CharacterCard = {
  id: "ClW",
  canonicalId: "ci_ClW",
  reprints: ["set7-079"],
  cardType: "character",
  name: "Mufasa",
  version: "Among the Stars",
  inkType: ["amethyst", "steel"],
  franchise: "Lion King",
  set: "007",
  cardNumber: 79,
  rarity: "uncommon",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_5118e8478d8b437693d1b7ff7c09d7fd",
    tcgPlayer: 618137,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "Evasive",
    },
    {
      title: "Resist +1",
    },
  ],
  classifications: ["Floodborn", "Mentor", "King"],
  abilities: [shift(5), evasive, resist(1)],
  i18n: mufasaAmongTheStarsI18n,
};
