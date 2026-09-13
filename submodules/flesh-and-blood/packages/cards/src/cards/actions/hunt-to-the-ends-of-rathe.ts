import { goAgain } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/hunt-to-the-ends-of-rathe.generated.ts";

export const huntToTheEndsOfRathe = definePitchFamily(
  fabPitchFamilies["hunt-to-the-ends-of-rathe"],
  {
    keywords: [goAgain],
    abilities: () => ({
      attacksArakniMark: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            name: "attack",
            actor: {
              kind: "any",
            },
            observes: {
              kind: "event-object",
              selector: "attack",
              relationship: {
                kind: "any",
              },
              filter: {
                moniker: "Arakni",
              },
            },
            target: {
              kind: "hero",
            },
          },
        },
        resolution: {
          kind: "effect",
          effect: {
            type: "mark",
            target: {
              selector: "attack-target",
            },
          },
        },
        label: {
          name: "mark",
        },
      },
      attackingMarkedGets2Power: {
        kind: "static",
        staticKind: "continuous",
        condition: {
          type: "has-status",
          status: "attacking-a-marked-hero",
        },
        effect: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: 2,
          target: {
            selector: "self",
          },
          duration: "this-turn",
        },
        label: {
          name: "mark",
        },
      },
    }),
  },
);

export const { red: huntToTheEndsOfRatheRed } = huntToTheEndsOfRathe.cards;
