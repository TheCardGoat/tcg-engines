import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/deep-rooted-evil.generated.ts";

import { bloodDebt } from "../shared/keywords.ts";

export const deepRootedEvil = definePitchFamily(fabPitchFamilies["deep-rooted-evil"], {
  keywords: [bloodDebt],
  abilities: () => ({
    if6MoreHasBeenPutIntoBanishedZone: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "zone-count",
        zone: "banished",
        player: "controller",
        filter: {
          power: {
            op: "gte",
            value: 6,
          },
        },
        comparison: {
          op: "gte",
          value: 1,
        },
      },
      playEffect: {
        role: "permission",
        fromZones: ["banished"],
        optional: true,
      },
    },
  }),
});
export const { yellow: deepRootedEvilYellow } = deepRootedEvil.cards;
