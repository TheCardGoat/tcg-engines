import type { CharacterCard } from "@tcg/lorcana-types";
import { cogsworthIlluminaryWatchmanI18n } from "./037-cogsworth-illuminary-watchman.i18n";

export const cogsworthIlluminaryWatchman: CharacterCard = {
  id: "Usw",
  canonicalId: "ci_Usw",
  reprints: ["set5-037"],
  cardType: "character",
  name: "Cogsworth",
  version: "Illuminary Watchman",
  inkType: ["amethyst"],
  franchise: "Beauty and the Beast",
  set: "005",
  cardNumber: 37,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5004569c2e0246e8bc9014bc00c21cd1",
    tcgPlayer: 561610,
  },
  text: [
    {
      title: "TIME TO MOVE IT!",
      description:
        "When you play this character, chosen character gains Rush this turn. (They can challenge the turn they're played.)",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "1n5-1",
      name: "TIME TO MOVE IT!",
      text: "TIME TO MOVE IT! When you play this character, chosen character gains Rush this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: cogsworthIlluminaryWatchmanI18n,
};
