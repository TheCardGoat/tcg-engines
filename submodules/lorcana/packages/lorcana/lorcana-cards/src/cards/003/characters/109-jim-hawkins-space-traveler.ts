import type { CharacterCard } from "@tcg/lorcana-types";
import { jimHawkinsSpaceTravelerI18n } from "./109-jim-hawkins-space-traveler.i18n";

export const jimHawkinsSpaceTraveler: CharacterCard = {
  id: "emY",
  canonicalId: "ci_emY",
  reprints: ["set3-109"],
  cardType: "character",
  name: "Jim Hawkins",
  version: "Space Traveler",
  inkType: ["ruby"],
  franchise: "Treasure Planet",
  set: "003",
  cardNumber: 109,
  rarity: "legendary",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_163516a9fa684676b2bed66aa7a64a35",
    tcgPlayer: 532660,
  },
  text: [
    {
      title: "THIS IS IT!",
      description:
        "When you play this character, you may play a location with cost 4 or less for free.",
    },
    {
      title: "TAKE THE HELM",
      description: "Whenever you play a location, this character may move there for free.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "location",
          cost: "free",
          costRestriction: {
            comparison: "less-or-equal",
            value: 4,
          },
          from: "hand",
          type: "play-card",
        },
        type: "optional",
      },
      id: "emY-1",
      name: "THIS IS IT!",
      text: "THIS IS IT! When you play this character, you may play a location with cost 4 or less for free.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          character: "SELF",
          cost: "free",
          location: {
            ref: "trigger-subject",
          },
          type: "move-to-location",
        },
        type: "optional",
      },
      id: "emY-2",
      name: "TAKE THE HELM",
      text: "TAKE THE HELM Whenever you play a location, this character may move there for free.",
      trigger: {
        event: "play",
        on: {
          cardType: "location",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: jimHawkinsSpaceTravelerI18n,
};
