import type { CharacterCard } from "@tcg/lorcana-types";
import { scuttleDirectingTrafficI18n } from "./036-scuttle-directing-traffic.i18n";

export const scuttleDirectingTraffic: CharacterCard = {
  id: "amS",
  canonicalId: "ci_amS",
  slug: "lorcana-ci_amS",
  printings: [
    {
      id: "set14-036",
      artId: "set14-036",
      setCode: "set14",
      collectorNumber: "36",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-036"],
  cardType: "character",
  name: "Scuttle",
  version: "Directing Traffic",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "014",
  cardNumber: 36,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: true,
  classifications: ["Storyborn", "Ally"],
  i18n: scuttleDirectingTrafficI18n,
};
