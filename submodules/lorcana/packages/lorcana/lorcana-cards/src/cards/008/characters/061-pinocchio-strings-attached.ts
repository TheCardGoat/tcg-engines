import type { CharacterCard } from "@tcg/lorcana-types";
import { pinocchioStringsAttachedI18n } from "./061-pinocchio-strings-attached.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const pinocchioStringsAttached: CharacterCard = {
  id: "HBo",
  canonicalId: "ci_828",
  slug: "lorcana-ci_828",
  printings: [
    {
      id: "set8-061",
      artId: "set8-061",
      setCode: "set8",
      collectorNumber: "61",
      rarity: "legendary",
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
  cardNumber: 61,
  rarity: "legendary",
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
  i18n: pinocchioStringsAttachedI18n,
};
