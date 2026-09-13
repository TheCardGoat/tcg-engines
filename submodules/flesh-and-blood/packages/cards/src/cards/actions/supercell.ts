import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/supercell.generated.ts";

export const supercell = definePitchFamily(fabPitchFamilies["supercell"], {
  abilities: () => ({
    putXSteamCountersOnXHyperDriversControl: {
      kind: "resolution",
      effect: {
        type: "add-counter",
        counter: {
          kind: "named",
          name: "steam",
        },
        count: {
          type: "x",
        },
        target: {
          selector: "object",
          declared: "on-stack",
          player: "controller",
          zones: ["permanent"],
          filter: {
            name: "Hyper Driver",
          },
          count: {
            type: "x",
          },
        },
      },
    },
    createHyperDriverTokenWithXSteamCounters: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "hyper-driver",
        controller: "controller",
        withCounters: {
          counter: {
            kind: "named",
            name: "steam",
          },
          count: {
            type: "x",
          },
        },
      },
    },
    xNumber3GreaterShuffleConstructNitroMechanoidFromBanishedZoneIntoDeck: {
      kind: "resolution",
      condition: {
        type: "compare-amount",
        amount: { type: "x" },
        comparison: { op: "gte", value: 3 },
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "move-card",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["banished"],
                filter: {
                  and: [
                    {
                      typeBox: {
                        subtypes: ["Construct"],
                      },
                    },
                    {
                      name: "Construct Nitro Mechanoid",
                    },
                  ],
                },
                count: 1,
              },
              to: {
                zone: "deck",
              },
            },
            {
              type: "shuffle",
              zone: "deck",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: supercellBlue } = supercell.cards;
