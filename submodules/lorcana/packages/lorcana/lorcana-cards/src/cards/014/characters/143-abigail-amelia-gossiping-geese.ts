import type { CharacterCard } from "@tcg/lorcana-types";
import { abigailAmeliaGossipingGeeseI18n } from "./143-abigail-amelia-gossiping-geese.i18n";

export const abigailAmeliaGossipingGeese: CharacterCard = {
  id: "DRn",
  canonicalId: "ci_DRn",
  slug: "lorcana-ci_DRn",
  printings: [
    {
      id: "set14-143",
      artId: "set14-143",
      setCode: "set14",
      collectorNumber: "143",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-143"],
  cardType: "character",
  name: "Abigail & Amelia",
  version: "Gossiping Geese",
  inkType: ["sapphire"],
  franchise: "Aristocats",
  set: "014",
  cardNumber: 143,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_597a36b3d75a4909b88a99129bae542e",
  },
  classifications: ["Storyborn"],
  i18n: abigailAmeliaGossipingGeeseI18n,
};
