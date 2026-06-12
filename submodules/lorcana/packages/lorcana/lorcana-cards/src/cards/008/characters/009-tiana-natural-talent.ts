import type { CharacterCard } from "@tcg/lorcana-types";
import { tianaNaturalTalentI18n } from "./009-tiana-natural-talent.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const tianaNaturalTalent: CharacterCard = {
  id: "9h6",
  canonicalId: "ci_9h6",
  reprints: ["set8-009"],
  cardType: "character",
  name: "Tiana",
  version: "Natural Talent",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "008",
  cardNumber: 9,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_e1412fbad88c459a989f3738fb678789",
    tcgPlayer: 631333,
  },
  text: [
    {
      title: "Singer 6",
    },
    {
      title: "CAPTIVATING MELODY",
      description:
        "Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
  abilities: [
    singer(6),
    {
      effect: {
        duration: "until-start-of-next-turn",
        modifier: -1,
        stat: "strength",
        target: {
          selector: "all",
          count: "all",
          owner: "opponent",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "modify-stat",
      },
      id: "tr1-2",
      name: "CAPTIVATING MELODY",
      text: "CAPTIVATING MELODY Whenever you play a song, each opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: tianaNaturalTalentI18n,
};
