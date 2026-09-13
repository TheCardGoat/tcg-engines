import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/the-weakest-link.generated.ts";

export const theWeakestLink = definePitchFamily(fabPitchFamilies["the-weakest-link"], {
  abilities: () => ({
    whenHitsHeroLookAtTheirHandChooseWithoutBaseDefenseDo: {
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
              type: "look",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hand"],
                count: {
                  type: "all",
                },
              },
            },
            {
              type: "choose-card",
              target: {
                selector: "binding",
                binding: "revealed-this-way",
                filter: {
                  lacksProperty: "defense",
                },
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "if-you-do",
              effect: {
                type: "discard",
                target: {
                  selector: "binding",
                  binding: "it",
                },
              },
              then: {
                type: "draw",
                count: 1,
                player: "controller",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: theWeakestLinkRed } = theWeakestLink.cards;
