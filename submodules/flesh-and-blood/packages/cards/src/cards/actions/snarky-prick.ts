import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/snarky-prick.generated.ts";

export const snarkyPrick = definePitchFamily(fabPitchFamilies["snarky-prick"], {
  abilities: () => ({
    whenAttacksHeroLookAtTopTheirDeckSRedDestroyDo: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
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
                player: "attack-target",
                zones: ["deck"],
                position: "top",
                count: 1,
              },
              outputBinding: "it",
            },
            {
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  color: ["red"],
                },
              },
              then: {
                type: "optional",
                effect: {
                  type: "destroy",
                  target: {
                    selector: "binding",
                    binding: "it",
                  },
                },
                then: {
                  type: "modify-numeric",
                  property: "power",
                  op: "add",
                  amount: 4,
                  target: {
                    selector: "self",
                  },
                  duration: "this-turn",
                },
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: snarkyPrickRed } = snarkyPrick.cards;
