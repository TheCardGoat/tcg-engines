import type { CharacterCard } from "@tcg/lorcana-types";
import { lenaSabrewingPureEnergyI18n } from "./049-lena-sabrewing-pure-energy.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const lenaSabrewingPureEnergy: CharacterCard = {
  id: "q7a",
  canonicalId: "ci_q7a",
  reprints: ["set8-049"],
  cardType: "character",
  name: "Lena Sabrewing",
  version: "Pure Energy",
  inkType: ["amethyst", "steel"],
  franchise: "Ducktales",
  set: "008",
  cardNumber: 49,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5d5fd6b02f3646c9ae4661c9a36177c6",
    tcgPlayer: 631383,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "SUPERNATURAL VENGEANCE",
      description: "{E} — Deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Sorcerer"],
  abilities: [
    evasive,
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1r9-2",
      name: "SUPERNATURAL VENGEANCE",
      text: "SUPERNATURAL VENGEANCE {E} – Deal 1 damage to chosen character.",
      type: "activated",
    },
  ],
  i18n: lenaSabrewingPureEnergyI18n,
};
