import type { CharacterCard } from "@tcg/lorcana-types";
import { rozAlwaysWatchingEpicI18n } from "./221-roz-always-watching-epic.i18n";

export const rozAlwaysWatchingEpic: CharacterCard = {
  id: "7xG",
  canonicalId: "ci_zgm",
  slug: "lorcana-ci_zgm",
  printings: [
    {
      id: "set13-221-epic",
      artId: "ci_zgm-epic",
      setCode: "set13",
      collectorNumber: "221",
      rarity: "epic",
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
  cardNumber: 221,
  rarity: "epic",
  specialRarity: "epic",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6b2039370f684b6d9a258e69d6f0d323",
    tcgPlayer: "704644",
  },
  text: [
    {
      title: "ALWAYS",
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
  i18n: rozAlwaysWatchingEpicI18n,
};
