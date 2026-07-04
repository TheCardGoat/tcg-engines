import type { CharacterCard } from "@tcg/lorcana-types";
import { tylerNguyenbaker4townFanI18n } from "./004-tyler-nguyen-baker-4town-fan.i18n";

export const tylerNguyenbaker4townFan: CharacterCard = {
  id: "JHz",
  canonicalId: "ci_JHz",
  slug: "lorcana-ci_JHz",
  printings: [
    {
      id: "set13-004",
      artId: "set13-004",
      setCode: "set13",
      collectorNumber: "4",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-004"],
  cardType: "character",
  name: "Tyler Nguyen-Baker",
  version: "4*Town Fan",
  inkType: ["amber"],
  franchise: "Turning Red",
  set: "013",
  cardNumber: 4,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_a751d313e33c4a43a841a327c73108e3",
  },
  classifications: ["Storyborn", "Ally"],
  i18n: tylerNguyenbaker4townFanI18n,
};
