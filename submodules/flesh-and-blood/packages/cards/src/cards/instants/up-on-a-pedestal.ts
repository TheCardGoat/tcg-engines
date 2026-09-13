import { attackActionFilter } from "@tcg/flesh-and-blood-types";
import { suspense } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/up-on-a-pedestal.generated.ts";

export const upOnAPedestal = definePitchFamily(fabPitchFamilies["up-on-a-pedestal"], {
  keywords: [suspense],
  abilities: () => ({
    whenEntersLeavesArenaMayPutReveredGuardianAttack: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          kind: "any-of",
          patterns: [
            {
              name: "enter-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
            {
              name: "leave-arena",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "source",
                selector: "moved-object",
              },
            },
          ],
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "optional",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["graveyard"],
              filter: attackActionFilter({
                or: [
                  {
                    typeBox: {
                      supertypes: ["Revered"],
                    },
                  },
                  {
                    typeBox: {
                      supertypes: ["Guardian"],
                    },
                  },
                ],
              }),
              count: 1,
            },
            to: {
              zone: "deck",
              position: "top",
            },
          },
        },
      },
    },
  }),
});

export const { blue: upOnAPedestalBlue } = upOnAPedestal.cards;
