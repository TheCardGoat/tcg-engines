import type { LocationCard } from "@tcg/lorcana-types";
import { neverLandMermaidLagoonI18n } from "./032-never-land-mermaid-lagoon.i18n";

export const neverLandMermaidLagoon: LocationCard = {
  id: "E8P",
  canonicalId: "ci_E8P",
  reprints: ["set3-032"],
  cardType: "location",
  name: "Never Land",
  version: "Mermaid Lagoon",
  inkType: ["amber"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 32,
  rarity: "common",
  cost: 1,
  willpower: 4,
  moveCost: 1,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_b9ecaeeeee5a467ea41b58edda3b8f13",
    tcgPlayer: 534089,
  },
  i18n: neverLandMermaidLagoonI18n,
};
