import type { CharacterCard } from "@tcg/lorcana-types";
import { pinocchioStringsAttachedEpicI18n } from "./224-pinocchio-strings-attached-epic.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const pinocchioStringsAttachedEpic: CharacterCard = {
  id: "cl6",
  canonicalId: "ci_828",
  slug: "lorcana-ci_828",
  printings: [
    {
      id: "set8-224-epic",
      artId: "ci_828-epic",
      setCode: "set8",
      collectorNumber: "224",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set8-061"],
  cardType: "character",
  name: "Pinocchio",
  version: "Strings Attached",
  inkType: ["amethyst"],
  franchise: "Pinocchio",
  set: "008",
  cardNumber: 224,
  rarity: "legendary",
  specialRarity: "epic",
  cost: 4,
  strength: 0,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_df6cc478635f4764bb880e560219173a",
    tcgPlayer: "634264",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "GOT TO KEEP REAL QUIET",
      description: "Once during your turn, whenever you ready this character, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    evasive,
    {
      id: "1m2-2",
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      name: "GOT TO KEEP REAL QUIET",
      trigger: {
        event: "ready",
        on: "SELF",
        timing: "whenever",
        restrictions: [{ type: "during-turn", whose: "your" }, { type: "once-per-turn" }],
      },
      type: "triggered",
      text: "GOT TO KEEP REAL QUIET Once during your turn, whenever you ready this character, you may draw a card.",
    },
  ],
  i18n: pinocchioStringsAttachedEpicI18n,
};
