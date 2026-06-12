import type { CharacterCard } from "@tcg/lorcana-types";
import { taffytaMuttonfudgeSourSpeedsterI18n } from "./117-taffyta-muttonfudge-sour-speedster.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const taffytaMuttonfudgeSourSpeedster: CharacterCard = {
  id: "5D9",
  canonicalId: "ci_5D9",
  reprints: ["set5-117"],
  cardType: "character",
  name: "Taffyta Muttonfudge",
  version: "Sour Speedster",
  inkType: ["ruby"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 117,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b486db00d41f4888984650e72cc36b00",
    tcgPlayer: 555270,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "NEW ROSTER",
      description: "Once per turn, when this character moves to a location, gain 2 lore.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Racer"],
  abilities: [
    shift(2),
    {
      effect: {
        amount: 2,
        type: "gain-lore",
      },
      id: "1a5-2",
      name: "NEW ROSTER",
      text: "NEW ROSTER Once per turn, when this character moves to a location, gain 2 lore.",
      trigger: {
        event: "move",
        on: "SELF",
        restrictions: [
          {
            type: "once-per-turn",
          },
        ],
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: taffytaMuttonfudgeSourSpeedsterI18n,
};
