import type { CharacterCard } from "@tcg/lorcana-types";
import { perlaNimbleSeamstressI18n } from "./032-perla-nimble-seamstress.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { support } from "../../../helpers/abilities/support";

export const perlaNimbleSeamstress: CharacterCard = {
  id: "D8H",
  canonicalId: "ci_D8H",
  reprints: ["set7-032"],
  cardType: "character",
  name: "Perla",
  version: "Nimble Seamstress",
  inkType: ["amber", "emerald"],
  franchise: "Cinderella",
  set: "007",
  cardNumber: 32,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fd0e022a8b8c4171a610ffe0a440d8be",
    tcgPlayer: 618131,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive, support],
  i18n: perlaNimbleSeamstressI18n,
};
