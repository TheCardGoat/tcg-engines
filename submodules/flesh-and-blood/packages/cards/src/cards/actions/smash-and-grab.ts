import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/smash-and-grab.generated.ts";

export const smashAndGrab = definePitchFamily(fabPitchFamilies["smash-and-grab"], {
  abilities: () => ({
    veBoostedNumber2MoreTimesTurnGetsNumber2PowerWhenHitsHero: {
      kind: "static",
      staticKind: "continuous",
      condition: {
        type: "compare-amount",
        amount: { type: "count", what: "boosts-this-turn" },
        comparison: { op: "gte", value: 2 },
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-numeric",
            property: "power",
            op: "add",
            amount: 2,
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
          {
            type: "grant-property",
            property: {
              kind: "ability",
              ability: {
                kind: "static",
                staticKind: "triggered",
                id: "whenHitsHeroGainControlItemTheyControl",
                text: "",
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
                    type: "gain-control",
                    target: {
                      selector: "object",
                      declared: "at-resolution",
                      player: "opponent",
                      zones: ["permanent"],
                      filter: {
                        typeBox: {
                          subtypes: ["Item"],
                        },
                      },
                      count: 1,
                    },
                    controller: "controller",
                  },
                },
              },
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
    },
  }),
});

export const { red: smashAndGrabRed } = smashAndGrab.cards;
