import type { CharacterCard } from "@tcg/lorcana-types";
import { drSaraBellumHeadOfResearchI18n } from "./152-dr-sara-bellum-head-of-research.i18n";

export const drSaraBellumHeadOfResearch: CharacterCard = {
  id: "4yx",
  canonicalId: "ci_4yx",
  reprints: ["set12-152"],
  cardType: "character",
  name: "Dr. Sara Bellum",
  version: "Head of Research",
  inkType: ["sapphire"],
  franchise: "Darkwing Duck",
  set: "012",
  cardNumber: 152,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_51c67ec5aa334b43a036c79e0bceb3b7",
  },
  text: [
    {
      title: "SCIENTIFIC SCRUTINY",
      description:
        "When you play this character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Inventor"],
  abilities: [
    {
      id: "4yx-1",
      name: "SCIENTIFIC SCRUTINY",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        destinations: [
          {
            zone: "deck-top",
            min: 0,
            max: 1,
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      text: "SCIENTIFIC SCRUTINY When you play this character, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  i18n: drSaraBellumHeadOfResearchI18n,
};
