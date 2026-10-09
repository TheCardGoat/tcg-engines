import type { CharacterCard } from "@tcg/lorcana-types";
import { miguelRiveraPromisingMusicianI18n } from "./010-miguel-rivera-promising-musician.i18n";

export const miguelRiveraPromisingMusician: CharacterCard = {
  id: "Xnj",
  canonicalId: "ci_Xnj",
  slug: "lorcana-ci_Xnj",
  printings: [
    {
      id: "set14-010",
      artId: "set14-010",
      setCode: "set14",
      collectorNumber: "10",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-010"],
  cardType: "character",
  name: "Miguel Rivera",
  version: "Promising Musician",
  inkType: ["amber"],
  franchise: "Coco",
  set: "014",
  cardNumber: 10,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Crowd Pleaser",
      description: "Whenever this character sings a song, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "Xnj-1",
      name: "Crowd Pleaser",
      type: "triggered",
      text: "Crowd Pleaser Whenever this character sings a song, gain 1 lore.",
      trigger: {
        event: "sing",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
    },
  ],
  i18n: miguelRiveraPromisingMusicianI18n,
};
