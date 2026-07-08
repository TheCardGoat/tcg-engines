import type { CharacterCard } from "@tcg/lorcana-types";
import { rozAlwaysWatchingI18n } from "./145-roz-always-watching.i18n";

export const rozAlwaysWatching: CharacterCard = {
  id: "zgm",
  canonicalId: "ci_zgm",
  slug: "lorcana-ci_zgm",
  printings: [
    {
      id: "set13-145",
      artId: "set13-145",
      setCode: "set13",
      collectorNumber: "145",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-145"],
  cardType: "character",
  name: "Roz",
  version: "Always Watching",
  inkType: ["sapphire"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 145,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Always",
      description: "Each opponent plays with the top card of their deck faceup.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Monster"],
  abilities: [
    {
      type: "static",
      name: "ALWAYS",
      text: "ALWAYS Each opponent plays with the top card of their deck faceup.",
      effect: {
        type: "reveal-top-card",
        target: "OPPONENTS",
      },
    },
  ],
  i18n: rozAlwaysWatchingI18n,
};
