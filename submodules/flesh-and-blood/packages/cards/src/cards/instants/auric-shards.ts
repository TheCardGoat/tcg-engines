import { definePitchFamily, pitchMap } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/auric-shards.generated.ts";
import { ward } from "../shared/keywords.ts";

const fragmentAttack = {
  selector: "object",
  declared: "on-stack",
  zones: ["combat-chain"],
  filter: {
    typeBox: {
      subtypes: ["Attack"],
    },
    hasKeyword: "fragment",
  },
  count: { type: "up-to", amount: 1 },
} as const;

export const auricShards = definePitchFamily(fabPitchFamilies["auric-shards"], {
  parameters: pitchMap({ red: 4, yellow: 3, blue: 2 }),
  keywords: [ward(1)],
  abilities: (holoAmount) => ({
    empowerFragment: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "enter-arena",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "modify-numeric",
              property: "power",
              op: "add",
              amount: 1,
              target: fragmentAttack,
              duration: "this-turn",
              outputBinding: "it",
            },
            {
              type: "self-replacement",
              condition: {
                type: "has-counter",
                counter: {
                  kind: "named",
                  name: "holo",
                },
                target: {
                  selector: "self",
                },
              },
              modification: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: holoAmount,
                target: fragmentAttack,
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  }),
});

export const {
  red: auricShardsRed,
  yellow: auricShardsYellow,
  blue: auricShardsBlue,
} = auricShards.cards;
