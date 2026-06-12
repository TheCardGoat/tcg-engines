import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchCovertAgentI18n } from "./089-stitch-covert-agent.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const stitchCovertAgent: CharacterCard = {
  id: "uqB",
  canonicalId: "ci_uqB",
  reprints: ["set3-089"],
  cardType: "character",
  name: "Stitch",
  version: "Covert Agent",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "003",
  cardNumber: 89,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_a9fd85371b4f4a45bb279981167941d1",
    tcgPlayer: 539083,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "HIDE",
      description: "While this character is at a location, he gains Ward.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Alien"],
  abilities: [
    evasive,
    {
      condition: {
        type: "at-location",
      },
      effect: {
        keyword: "Ward",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1c3-2",
      name: "HIDE",
      text: "HIDE While this character is at a location, he gains Ward.",
      type: "static",
    },
  ],
  i18n: stitchCovertAgentI18n,
};
