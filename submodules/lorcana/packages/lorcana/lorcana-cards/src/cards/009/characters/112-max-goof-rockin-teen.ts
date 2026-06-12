import type { CharacterCard } from "@tcg/lorcana-types";
import { maxGoofRockinTeenI18n } from "./112-max-goof-rockin-teen.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const maxGoofRockinTeen: CharacterCard = {
  id: "X6A",
  canonicalId: "ci_3CP",
  reprints: ["set9-112"],
  cardType: "character",
  name: "Max Goof",
  version: "Rockin' Teen",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 112,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4d1c2c4913d1417294da21592cee8363",
    tcgPlayer: 650150,
  },
  text: [
    {
      title: "Singer 5",
    },
    {
      title: "I JUST WANNA STAY HOME",
      description: "This character can't move to locations.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    singer(5),
    {
      id: "X6A-1",
      name: "I JUST WANNA STAY HOME",
      text: "I JUST WANNA STAY HOME This character can't move to locations.",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-move",
        target: "SELF",
      },
    },
  ],
  i18n: maxGoofRockinTeenI18n,
};
