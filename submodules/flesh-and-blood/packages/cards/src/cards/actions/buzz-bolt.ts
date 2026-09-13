import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fusedResolution, wheneverThisTurn } from "@tcg/flesh-and-blood-types/authoring";
import { fusion } from "../shared/keywords.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/buzz-bolt.generated.ts";

export const buzzBolt = definePitchFamily(fabPitchFamilies["buzz-bolt"], {
  parameters: pitchMap({
    red: { value1: 5, value2: 1, textValue1: 1 },
    yellow: { value1: 5, value2: 1, textValue1: 1 },
    blue: { value1: 5, value2: 1, textValue1: 1 },
  }),
  keywords: [fusion("Lightning")],
  abilities: ({ value1: _value1, value2, textValue1: _textValue1 }) => ({
    damageOnAttackHit: fusedResolution(
      wheneverThisTurn({
        trigger: {
          kind: "event",
          event: {
            name: "hit",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
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
          type: "deal-damage",
          damageType: "generic",
          amount: value2,
          target: {
            selector: "attack-target",
          },
          source: {
            selector: "binding",
            binding: "it",
          },
        },
      }),
    ),
  }),
});

export const { red: buzzBoltRed, yellow: buzzBoltYellow, blue: buzzBoltBlue } = buzzBolt.cards;
