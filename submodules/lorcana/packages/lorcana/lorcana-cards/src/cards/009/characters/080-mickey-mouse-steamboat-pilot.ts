import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseSteamboatPilotI18n } from "./080-mickey-mouse-steamboat-pilot.i18n";

export const mickeyMouseSteamboatPilot: CharacterCard = {
  id: "ii9",
  canonicalId: "ci_5sX",
  slug: "lorcana-ci_5sX",
  printings: [
    {
      id: "set9-080",
      artId: "set9-080",
      setCode: "set9",
      collectorNumber: "80",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-089", "set9-080"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Steamboat Pilot",
  inkType: ["emerald"],
  set: "009",
  cardNumber: 80,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: true,
  externalIds: {
    lorcast: "crd_d72f9b00497a4ff0ac7ddb0f85da659d",
    tcgPlayer: "651112",
  },
  classifications: ["Storyborn", "Hero", "Captain"],
  i18n: mickeyMouseSteamboatPilotI18n,
};
