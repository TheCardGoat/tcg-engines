import { phantasm } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/miraging-metamorph.generated.ts";

/** Model notes (hand-authored): Phantasm; on destroy, token-copy an aura you control. */
export const miragingMetamorph = definePitchFamily(fabPitchFamilies["miraging-metamorph"], {
  keywords: [phantasm],
  abilities: () => ({
    miragingMetamorphDestroyedCreateTokenThatsCopyAura: {
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
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "create-token",
          controller: "controller",
          copySource: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
            },
            count: 1,
          },
        },
      },
    },
  }),
});

export const { red: miragingMetamorphRed } = miragingMetamorph.cards;
