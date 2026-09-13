import { definePitchFamily } from "../../authoring/pitch-family.ts";

import { fabPitchFamilies } from "../../generated/card-identities/actions/bare-fangs.generated.ts";

/** Model notes (hand-authored): +2{p} keys off the random-discard binding's power, not a synthetic discarded-this-way status. */
export const bareFangs = definePitchFamily(fabPitchFamilies["bare-fangs"], {
  abilities: () => ({
    staticTriggeredAttackAttackSequence: {
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
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
            {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "controller",
                zones: ["hand"],
                count: 1,
                random: true,
              },
              outputBinding: "it",
            },
            {
              // Printed "If a card with 6 or more {p} is discarded this way" —
              // bind the discard, then match its power (Ravenous Meataxe pattern).
              type: "conditional",
              condition: {
                type: "binding-matches",
                binding: "it",
                filter: {
                  power: {
                    op: "gte",
                    value: 6,
                  },
                },
              },
              then: {
                type: "modify-numeric",
                property: "power",
                op: "add",
                amount: 2,
                target: {
                  selector: "self",
                },
                duration: "this-turn",
              },
            },
          ],
        },
      },
    },
  }),
});

export const { red: bareFangsRed, yellow: bareFangsYellow, blue: bareFangsBlue } = bareFangs.cards;
