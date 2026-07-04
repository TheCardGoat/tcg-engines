import type { CharacterCard } from "@tcg/lorcana-types";
import { scuttleBirdbrainedI18n } from "./147-scuttle-birdbrained.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const scuttleBirdbrained: CharacterCard = {
  id: "z8J",
  canonicalId: "ci_z8J",
  slug: "lorcana-ci_z8J",
  printings: [
    {
      id: "set10-147",
      artId: "set10-147",
      setCode: "set10",
      collectorNumber: "147",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set10-147"],
  cardType: "character",
  name: "Scuttle",
  version: "Birdbrained",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "010",
  cardNumber: 147,
  rarity: "uncommon",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f734275e89e94f6a8b2ace1f90c3efb0",
    tcgPlayer: "659383",
  },
  text: "Ward",
  classifications: ["Dreamborn", "Ally"],
  abilities: [ward],
  i18n: scuttleBirdbrainedI18n,
};
