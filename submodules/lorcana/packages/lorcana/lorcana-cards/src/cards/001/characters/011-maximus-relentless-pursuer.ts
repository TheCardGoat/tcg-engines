import type { CharacterCard } from "@tcg/lorcana-types";
import { maximusRelentlessPursuerI18n } from "./011-maximus-relentless-pursuer.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const maximusRelentlessPursuer: CharacterCard = {
  id: "bqd",
  canonicalId: "ci_bqd",
  reprints: ["set1-011"],
  cardType: "character",
  name: "Maximus",
  version: "Relentless Pursuer",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 11,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_dbc44ab9437a44568efdf23b37f3f278",
    tcgPlayer: 494101,
  },
  text: [
    {
      title: "HORSE KICK",
      description: "When you play this character, chosen character gets -2 {S} this turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    rush,
    {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "2z0-2",
      name: "HORSE KICK",
      text: "HORSE KICK When you play this character, chosen character gets -2 {S} this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: maximusRelentlessPursuerI18n,
};
