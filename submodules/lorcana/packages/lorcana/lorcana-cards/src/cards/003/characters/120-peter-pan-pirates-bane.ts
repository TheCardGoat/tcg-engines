import type { CharacterCard } from "@tcg/lorcana-types";
import { peterPanPiratesBaneI18n } from "./120-peter-pan-pirates-bane.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const peterPanPiratesBane: CharacterCard = {
  id: "3nS",
  canonicalId: "ci_rxb",
  reprints: ["set3-120"],
  cardType: "character",
  name: "Peter Pan",
  version: "Pirate's Bane",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "003",
  cardNumber: 120,
  rarity: "rare",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b5e74b533270492982dff9472aee8664",
    tcgPlayer: 539274,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "Evasive",
    },
    {
      title: "YOU'RE NEXT!",
      description:
        "Whenever he challenges a Pirate character, this character takes no damage from the challenge.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    shift(4),
    evasive,
    {
      effect: {
        duration: "this-turn",
        replacement: {
          consumeOnApply: true,
          eventKinds: ["challenge-damage"],
          targetRef: "source",
          type: "prevent-damage",
        },
        type: "create-replacement-effect",
      },
      id: "3nS-3",
      name: "YOU'RE NEXT!",
      text: "YOU'RE NEXT! Whenever he challenges a Pirate character, this character takes no damage from the challenge.",
      trigger: {
        defender: {
          filters: [
            {
              type: "has-classification",
              classification: "Pirate",
            },
          ],
        },
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: peterPanPiratesBaneI18n,
};
