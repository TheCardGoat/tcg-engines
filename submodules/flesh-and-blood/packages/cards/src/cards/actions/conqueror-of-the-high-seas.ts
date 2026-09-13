import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/conqueror-of-the-high-seas.generated.ts";

import { goAgain } from "../shared/keywords.ts";

/** Model notes (hand-authored): go again is High Tide-only, not an innate keyword. */
export const conquerorOfTheHighSeas = definePitchFamily(
  fabPitchFamilies["conqueror-of-the-high-seas"],
  {
    abilities: () => ({
      whenHitsHeroDestroyAllTheirArsenalCreateGold: {
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
            type: "sequence",
            steps: [
              {
                type: "destroy",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "opponent",
                  zones: ["arsenal"],
                  count: {
                    type: "all",
                  },
                },
              },
              {
                type: "create-token",
                token: "gold",
                controller: "controller",
                count: {
                  type: "count",
                  what: "destroyed-this-way",
                },
              },
            ],
          },
        },
      },
      ifThereAre2MoreBluePitchZoneGets: {
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
                keyword: goAgain,
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
  },
);
export const { red: conquerorOfTheHighSeasRed } = conquerorOfTheHighSeas.cards;
