import type { CharacterCard } from "@tcg/lorcana-types";
import { maxGoofMusicLoverI18n } from "./003-max-goof-music-lover.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const maxGoofMusicLover: CharacterCard = {
  id: "kSA",
  canonicalId: "ci_kSA",
  slug: "lorcana-ci_kSA",
  printings: [
    {
      id: "set14-003",
      artId: "set14-003",
      setCode: "set14",
      collectorNumber: "3",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-003"],
  cardType: "character",
  name: "Max Goof",
  version: "Music Lover",
  inkType: ["amber"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 3,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Singer 5",
    },
    {
      title: "Best Night Ever",
      description:
        "While you have another character with Singer in play, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    singer(5),
    {
      id: "kSA-2",
      name: "Best Night Ever",
      type: "static",
      text: "Best Night Ever While you have another character with Singer in play, this character gets +1 {L}.",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          excludeSelf: true,
          filters: [{ type: "has-keyword", keyword: "Singer" }],
        },
        comparison: { operator: "gte", value: 1 },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
    },
  ],
  i18n: maxGoofMusicLoverI18n,
};
