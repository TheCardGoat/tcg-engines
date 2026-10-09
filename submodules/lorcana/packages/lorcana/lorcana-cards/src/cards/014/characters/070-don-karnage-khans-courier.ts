import type { CharacterCard } from "@tcg/lorcana-types";
import { donKarnageKhansCourierI18n } from "./070-don-karnage-khans-courier.i18n";

export const donKarnageKhansCourier: CharacterCard = {
  id: "gNn",
  canonicalId: "ci_gNn",
  slug: "lorcana-ci_gNn",
  printings: [
    {
      id: "set14-070",
      artId: "set14-070",
      setCode: "set14",
      collectorNumber: "70",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-070"],
  cardType: "character",
  name: "Don Karnage",
  version: "Khan's Courier",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 70,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  classifications: ["Storyborn", "Villain", "Prince", "Pirate"],
  i18n: donKarnageKhansCourierI18n,
};
