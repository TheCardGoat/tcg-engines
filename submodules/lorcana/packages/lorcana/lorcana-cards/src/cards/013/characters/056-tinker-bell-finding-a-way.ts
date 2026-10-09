import type { CharacterCard } from "@tcg/lorcana-types";
import { tinkerBellFindingAWayI18n } from "./056-tinker-bell-finding-a-way.i18n";

export const tinkerBellFindingAWay: CharacterCard = {
  id: "gng",
  canonicalId: "ci_gng",
  slug: "lorcana-ci_gng",
  printings: [
    {
      id: "set13-056",
      artId: "set13-056",
      setCode: "set13",
      collectorNumber: "56",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-056"],
  cardType: "character",
  name: "Tinker Bell",
  version: "Finding a Way",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "013",
  cardNumber: 56,
  rarity: "uncommon",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_4c9e820a4ede4c6a89d09ab41558812d",
    tcgPlayer: "704577",
  },
  classifications: ["Storyborn", "Ally", "Fairy"],
  i18n: tinkerBellFindingAWayI18n,
};
