import type { CharacterCard } from "@tcg/lorcana-types";
import { launchpadSkyPatrolI18n } from "./143-launchpad-sky-patrol.i18n";

export const launchpadSkyPatrol: CharacterCard = {
  id: "id9",
  canonicalId: "ci_id9",
  slug: "lorcana-ci_id9",
  printings: [
    {
      id: "set13-143",
      artId: "set13-143",
      setCode: "set13",
      collectorNumber: "143",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-143"],
  cardType: "character",
  name: "Launchpad",
  version: "Sky Patrol",
  inkType: ["sapphire"],
  franchise: "Darkwing Duck",
  set: "013",
  cardNumber: 143,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      type: "keyword",
      keyword: "Alert",
    },
  ],
  i18n: launchpadSkyPatrolI18n,
};
