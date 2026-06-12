import type { CharacterCard } from "@tcg/lorcana-types";
import { luisaMadrigalNoPressureI18n } from "./151-luisa-madrigal-no-pressure.i18n";

export const luisaMadrigalNoPressure: CharacterCard = {
  id: "bZm",
  canonicalId: "ci_bZm",
  reprints: ["set12-151"],
  cardType: "character",
  name: "Luisa Madrigal",
  version: "No Pressure",
  inkType: ["sapphire"],
  franchise: "Encanto",
  set: "012",
  cardNumber: 151,
  rarity: "uncommon",
  cost: 7,
  strength: 5,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_bf1a00bfa25345b8abe1f0d008935e39",
  },
  text: [
    {
      title: "SHOULDER THE BURDEN",
      description:
        "Whenever this character quests, you may move up to 3 damage from chosen character to this character.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "bZm-1",
      name: "SHOULDER THE BURDEN",
      type: "triggered",
      text: "SHOULDER THE BURDEN Whenever this character quests, you may move up to 3 damage from chosen character to this character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      effect: {
        type: "optional",
        effect: {
          type: "move-damage",
          amount: {
            type: "up-to",
            value: 3,
          },
          from: "CHOSEN_CHARACTER",
          to: "SELF",
        },
      },
    },
  ],
  i18n: luisaMadrigalNoPressureI18n,
};
