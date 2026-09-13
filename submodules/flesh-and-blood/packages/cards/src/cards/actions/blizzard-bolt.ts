import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fusedResolution, wheneverThisTurn } from "@tcg/flesh-and-blood-types/authoring";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/blizzard-bolt.generated.ts";

export const blizzardBolt = definePitchFamily(fabPitchFamilies["blizzard-bolt"], {
  parameters: pitchMap({ red: { value1: 5 }, yellow: { value1: 5 }, blue: { value1: 5 } }),
  keywords: [fusion("Ice")],
  abilities: ({ value1: _value1 }) => ({
    frostbiteOnAttackDamage: fusedResolution(
      wheneverThisTurn({
        trigger: {
          kind: "event",
          event: {
            name: "dealt-damage",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "damage-source",
              relationship: {
                kind: "any",
              },
              filter: {
                typeBox: {
                  subtypes: ["Attack"],
                },
              },
            },
            target: {
              kind: "hero",
            },
          },
        },
        effect: {
          type: "create-token",
          token: "frostbite",
          controller: "attack-target",
        },
      }),
    ),
  }),
});

export const {
  red: blizzardBoltRed,
  yellow: blizzardBoltYellow,
  blue: blizzardBoltBlue,
} = blizzardBolt.cards;
