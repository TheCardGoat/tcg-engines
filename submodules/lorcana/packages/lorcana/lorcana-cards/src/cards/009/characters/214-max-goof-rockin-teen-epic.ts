import type { CharacterCard } from "@tcg/lorcana-types";
import { maxGoofRockinTeenEpicI18n } from "./214-max-goof-rockin-teen-epic.i18n";

import { singer } from "../../../helpers/abilities/singer";

export const maxGoofRockinTeenEpic: CharacterCard = {
  id: "Swu",
  canonicalId: "ci_3CP",
  slug: "lorcana-ci_3CP",
  printings: [
    {
      id: "set9-214-epic",
      artId: "ci_3CP-epic",
      setCode: "set9",
      collectorNumber: "214",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set9-112"],
  cardType: "character",
  name: "Max Goof",
  version: "Rockin' Teen",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 214,
  rarity: "common",
  specialRarity: "epic",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4d1c2c4913d1417294da21592cee8363",
    tcgPlayer: "650150",
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
  i18n: maxGoofRockinTeenEpicI18n,
};
