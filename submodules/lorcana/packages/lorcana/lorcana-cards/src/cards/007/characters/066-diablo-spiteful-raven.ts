import type { CharacterCard } from "@tcg/lorcana-types";
import { diabloSpitefulRavenI18n } from "./066-diablo-spiteful-raven.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { challenger } from "../../../helpers/abilities/challenger";

export const diabloSpitefulRaven: CharacterCard = {
  id: "4Ff",
  canonicalId: "ci_4Ff",
  reprints: ["set7-066"],
  cardType: "character",
  name: "Diablo",
  version: "Spiteful Raven",
  inkType: ["amethyst", "emerald"],
  franchise: "Sleeping Beauty",
  set: "007",
  cardNumber: 66,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f13e08ae1efd4ae4be493361797a3497",
    tcgPlayer: 618721,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "Challenger +2 (While challenging, this character gets +2 {S})",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [evasive, challenger(2)],
  i18n: diabloSpitefulRavenI18n,
};
