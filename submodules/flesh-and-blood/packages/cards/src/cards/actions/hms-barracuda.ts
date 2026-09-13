import { overpower } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hms-barracuda.generated.ts";

export const hmsBarracuda = definePitchFamily(fabPitchFamilies["hms-barracuda"], {
  keywords: [],
  abilities: () => ({
    hitsDestroyAlly: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "hit",
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
          type: "destroy",
          target: {
            selector: "object",
            declared: "at-resolution",
            player: "opponent",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Ally"],
              },
            },
            count: 1,
          },
        },
      },
    },
    there2MoreBluePitchZoneGets1PowerOverpower: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "zone-count",
        zone: "pitch",
        player: "controller",
        filter: {
          color: ["blue"],
        },
        comparison: {
          op: "gte",
          value: 2,
        },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 1,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "keyword",
              keyword: overpower,
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
      label: {
        name: "high-tide",
      },
    },
  }),
});

export const { yellow: hmsBarracudaYellow } = hmsBarracuda.cards;
