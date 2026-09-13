import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/fractal-replication.generated.ts";

export const fractalReplication = definePitchFamily(fabPitchFamilies["fractal-replication"], {
  abilities: () => ({
    whenPlayDefendFractalReplicationGainsBaseAbilitiesAll: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "play",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "played-card",
              },
            },
            {
              name: "defend",
              actor: {
                kind: "player",
                player: "ability-controller",
              },
              observes: {
                kind: "source",
                selector: "defender",
              },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "copy",
          target: {
            selector: "self",
          },
          source: {
            selector: "object",
            declared: "at-resolution",
            zones: ["combat-chain"],
            filter: {
              typeBox: {
                supertypes: ["Illusionist"],
                types: ["Action"],
                subtypes: ["Attack"],
              },
            },
            count: {
              type: "all",
            },
          },
          duration: "this-combat-chain",
          abilitiesOnly: true,
        },
      },
    },
    fractalReplicationSIsEqualGreatestBaseAmongIllusionist: {
      kind: "static",
      staticKind: "property",
      property: "power",
      value: {
        type: "max",
        property: "power",
        player: "any",
        zones: ["combat-chain"],
        filter: {
          typeBox: {
            supertypes: ["Illusionist"],
            types: ["Action"],
            subtypes: ["Attack"],
          },
        },
      },
    },
    fractalReplicationSIsEqualGreatestBaseAmongIllusionist2: {
      kind: "static",
      staticKind: "property",
      property: "defense",
      value: {
        type: "max",
        property: "defense",
        player: "any",
        zones: ["combat-chain"],
        filter: {
          typeBox: {
            supertypes: ["Illusionist"],
            types: ["Action"],
            subtypes: ["Attack"],
          },
        },
      },
    },
  }),
});
export const { red: fractalReplicationRed } = fractalReplication.cards;
