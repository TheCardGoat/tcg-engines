import type { CharacterCard } from "@tcg/lorcana-types";
import { omnidroidV9I18n } from "./184-omnidroid-v9.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const omnidroidV9: CharacterCard = {
  id: "RM2",
  canonicalId: "ci_RM2",
  reprints: ["set12-184"],
  cardType: "character",
  name: "Omnidroid",
  version: "V.9",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "012",
  cardNumber: 184,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_d7153226a02845a4a71dbc705def5172",
  },
  text: [
    {
      title: "Shift 2 {I}",
    },
    {
      title: "ENEMY DETECTED",
      description:
        "When you play this character, if you used Shift to play it, you may deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Robot"],
  abilities: [
    shift(2),
    {
      id: "RM2-2",
      name: "ENEMY DETECTED",
      type: "triggered",
      text: "ENEMY DETECTED When you play this character, if you used Shift to play it, you may deal 2 damage to chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: "CHOSEN_CHARACTER",
        },
      },
    },
  ],
  i18n: omnidroidV9I18n,
};
