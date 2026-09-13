import { phantasm, ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/phantom-tidemaw.generated.ts";

export const phantomTidemaw = definePitchFamily(fabPitchFamilies["phantom-tidemaw"], {
  keywords: [phantasm, ward(1)],
  abilities: () => ({
    wheneverIllusionistControlIsDestroyedPut1Counter: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "destroy",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "event-object",
            selector: "moved-object",
            relationship: {
              kind: "any",
            },
            filter: {
              typeBox: {
                supertypes: ["Illusionist"],
              },
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "add-counter",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          count: 1,
          target: {
            selector: "self",
          },
        },
      },
    },
  }),
});

export const { blue: phantomTidemawBlue } = phantomTidemaw.cards;
