import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/annexation-of-all-things-known.generated.ts";

import { crushAbility } from "@tcg/flesh-and-blood-types";

export const annexationOfAllThingsKnown = definePitchFamily(
  fabPitchFamilies["annexation-of-all-things-known"],
  {
    abilities: () => ({
      crushControlFaceUpGuardianArsenal: crushAbility({
        effect: {
          type: "sequence",
          steps: [
            {
              type: "rule-modification",
              mode: "restrict",
              action: "play",
              filter: {
                hasStatus: "face-up",
                playedFromZones: ["arsenal"],
              },
              subject: {
                selector: "attack-target",
              },
              duration: "until-end-of-own-next-turn",
            },
            {
              type: "play-card",
              fromZones: ["arsenal"],
              source: {
                selector: "object",
                declared: "at-resolution",
                player: "attack-target",
                zones: ["arsenal"],
                filter: {
                  hasStatus: "face-up",
                },
                count: {
                  type: "all",
                },
              },
              duration: "until-end-of-own-next-turn",
            },
          ],
        },
        observes: {
          kind: "event-object",
          selector: "damage-source",
          relationship: {
            kind: "any",
          },
          filter: {
            typeBox: {
              supertypes: ["Guardian"],
            },
          },
        },
      }),
    }),
  },
);
export const { yellow: annexationOfAllThingsKnownYellow } = annexationOfAllThingsKnown.cards;
