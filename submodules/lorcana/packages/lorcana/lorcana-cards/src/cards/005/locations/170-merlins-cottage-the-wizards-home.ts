import type { LocationCard } from "@tcg/lorcana-types";
import { merlinsCottageTheWizardsHomeI18n } from "./170-merlins-cottage-the-wizards-home.i18n";

export const merlinsCottageTheWizardsHome: LocationCard = {
  id: "yVb",
  canonicalId: "ci_yVb",
  reprints: ["set5-170"],
  cardType: "location",
  name: "Merlin's Cottage",
  version: "The Wizard's Home",
  inkType: ["sapphire"],
  franchise: "Sword in the Stone",
  set: "005",
  cardNumber: 170,
  rarity: "uncommon",
  cost: 1,
  willpower: 7,
  moveCost: 1,
  lore: 0,
  inkable: true,
  externalIds: {
    lorcast: "crd_cc13be0e046742f4ae3e0aaffb5d3f9e",
    tcgPlayer: 559715,
  },
  text: [
    {
      title: "KNOWLEDGE IS POWER",
      description: "Each player plays with the top card of their deck face up.",
    },
  ],
  abilities: [
    {
      id: "fdq-1",
      name: "KNOWLEDGE IS POWER",
      text: "KNOWLEDGE IS POWER Each player plays with the top card of their deck face up.",
      type: "static",
      effect: {
        type: "reveal-top-card",
        target: "EACH_PLAYER",
      },
    },
  ],
  i18n: merlinsCottageTheWizardsHomeI18n,
};
