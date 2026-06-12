import type { CharacterCard } from "@tcg/lorcana-types";
import { rajahGhostlyTigerI18n } from "./062-rajah-ghostly-tiger.i18n";
import { vanish } from "../../../helpers/abilities/vanish";

export const rajahGhostlyTiger: CharacterCard = {
  id: "yQ2",
  canonicalId: "ci_yQ2",
  reprints: ["set7-062"],
  cardType: "character",
  name: "Rajah",
  version: "Ghostly Tiger",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "007",
  cardNumber: 62,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_85bc31bc75a34ebcbcfc164e701ae6ef",
    tcgPlayer: 618172,
  },
  text: [
    {
      title: "Vanish",
      description: "(When an opponent chooses this character for an action, banish them.)",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Illusion"],
  abilities: [vanish],
  i18n: rajahGhostlyTigerI18n,
};
