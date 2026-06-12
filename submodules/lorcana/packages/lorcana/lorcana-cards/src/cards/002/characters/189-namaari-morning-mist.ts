import type { CharacterCard } from "@tcg/lorcana-types";
import { namaariMorningMistI18n } from "./189-namaari-morning-mist.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const namaariMorningMist: CharacterCard = {
  id: "EAX",
  canonicalId: "ci_PU4",
  reprints: ["set2-189"],
  cardType: "character",
  name: "Namaari",
  version: "Morning Mist",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "002",
  cardNumber: 189,
  rarity: "legendary",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_8b02499c992945e2990cb669d7468256",
    tcgPlayer: 527798,
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "BLADES",
      description: "This character can challenge ready characters.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Princess"],
  abilities: [
    bodyguard,
    {
      effect: {
        ability: "can-challenge-ready",
        target: "SELF",
        type: "grant-ability",
      },
      id: "1dg-2",
      name: "BLADES",
      text: "BLADES This character can challenge ready characters.",
      type: "static",
    },
  ],
  i18n: namaariMorningMistI18n,
};
