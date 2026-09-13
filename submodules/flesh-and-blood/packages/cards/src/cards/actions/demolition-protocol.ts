import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/demolition-protocol.generated.ts";

export const demolitionProtocol = definePitchFamily(fabPitchFamilies["demolition-protocol"], {
  abilities: () => ({
    whenAttacksHeroRemoveAllSteamCountersFromUp: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "remove-all-counters",
          counter: {
            kind: "named",
            name: "steam",
          },
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              typeBox: {
                types: ["Equipment", "Weapon"],
                subtypes: ["Item"],
              },
            },
            count: {
              type: "up-to",
              amount: {
                type: "count",
                what: "evos-equipped",
              },
            },
          },
        },
      },
      label: {
        name: "evo-upgrade",
      },
    },
  }),
});
export const { red: demolitionProtocolRed } = demolitionProtocol.cards;
