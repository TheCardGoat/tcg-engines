import { legendary } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/oblivion.generated.ts";

export const oblivion = definePitchFamily(fabPitchFamilies["oblivion"], {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Vynnset",
    },
  ],
  abilities: () => ({
    playOnlyIfControlExactly6Runechants: {
      kind: "static",
      staticKind: "play",
      condition: {
        type: "zone-count",
        zone: "permanent",
        player: "controller",
        filter: {
          name: "Runechant",
        },
        comparison: {
          op: "eq",
          value: 6,
        },
      },
      playEffect: {
        role: "condition",
      },
    },
    createNasrethSoulHarrowerToken: {
      kind: "resolution",
      effect: {
        type: "create-token",
        token: "nasreth-the-soul-harrower",
        controller: "controller",
      },
    },
  }),
});

export const { blue: oblivionBlue } = oblivion.cards;
