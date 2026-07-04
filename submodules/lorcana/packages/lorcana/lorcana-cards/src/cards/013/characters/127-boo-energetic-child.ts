import type { CharacterCard } from "@tcg/lorcana-types";
import { rush } from "../../../helpers/abilities/rush";
import { booEnergeticChildI18n } from "./127-boo-energetic-child.i18n";

export const booEnergeticChildAbilities: CharacterCard["abilities"] = [
  rush,
  {
    type: "triggered",
    name: "KID-TASTROPHE!",
    text: "KID-TASTROPHE! Whenever this character challenges another character with 3 {S} or less, banish that character. (No damage is dealt in that challenge.)",
    trigger: {
      event: "challenge",
      on: "SELF",
      timing: "whenever",
      defender: {
        filters: [
          {
            type: "strength-comparison",
            comparison: "less-or-equal",
            value: 3,
          },
        ],
      },
    },
    effect: {
      type: "sequence",
      steps: [
        {
          type: "create-replacement-effect",
          duration: "this-turn",
          replacement: {
            type: "prevent-damage",
            eventKinds: ["challenge-damage"],
            targetRef: "source",
            consumeOnApply: true,
          },
        },
        {
          type: "create-replacement-effect",
          duration: "this-turn",
          replacement: {
            type: "prevent-damage",
            eventKinds: ["challenge-damage"],
            targetRef: "defender",
            consumeOnApply: true,
          },
        },
        {
          type: "banish",
          target: {
            reference: "defender",
          },
        },
      ],
    },
  },
];

export const booEnergeticChild: CharacterCard = {
  id: "YmS",
  canonicalId: "ci_X9A",
  slug: "lorcana-ci_X9A",
  printings: [
    {
      id: "set13-127",
      artId: "set13-127",
      setCode: "set13",
      collectorNumber: "127",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set13-127"],
  cardType: "character",
  name: "Boo",
  version: "Energetic Child",
  inkType: ["ruby"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 127,
  rarity: "rare",
  cost: 3,
  strength: 0,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_e597aba9dc5748e49621c84f4da6f30a",
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "KID-TASTROPHE!",
      description:
        "Whenever this character challenges another character with 3 {S} or less, banish that character. (No damage is dealt in that challenge.)",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: booEnergeticChildAbilities,
  i18n: booEnergeticChildI18n,
};
