import type { CharacterCard } from "@tcg/lorcana-types";
import { vincenzoSantoriniTheExplosivesExpertI18n } from "./197-vincenzo-santorini-the-explosives-expert.i18n";

export const vincenzoSantoriniTheExplosivesExpert: CharacterCard = {
  id: "QiE",
  canonicalId: "ci_QiE",
  reprints: ["set8-197"],
  cardType: "character",
  name: "Vincenzo Santorini",
  version: "The Explosives Expert",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "008",
  cardNumber: 197,
  rarity: "rare",
  cost: 7,
  strength: 2,
  willpower: 8,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_bf626cba6fd7425793d1cbfb0ee6aa2b",
    tcgPlayer: 631481,
  },
  text: [
    {
      title: "I JUST LIKE TO BLOW THINGS UP",
      description: "When you play this character, you may deal 3 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 3,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "t0e-1",
      name: "I JUST LIKE TO BLOW THINGS UP",
      text: "I JUST LIKE TO BLOW THINGS UP When you play this character, you may deal 3 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: vincenzoSantoriniTheExplosivesExpertI18n,
};
