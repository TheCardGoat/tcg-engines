import { ward } from "../shared/keywords.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/restless-coalescence.generated.ts";

export const restlessCoalescence = definePitchFamily(fabPitchFamilies["restless-coalescence"], {
  keywords: [ward(2)],
  abilities: () => ({
    whenEntersArenaMoveAnyNumber1CountersFrom: {
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
          type: "move-counter",
          counter: {
            kind: "numeric",
            value: 1,
            property: "power",
          },
          from: {
            selector: "object",
            declared: "at-resolution",
            player: "controller",
            zones: ["permanent"],
            filter: {
              typeBox: {
                subtypes: ["Aura"],
              },
              hasStatus: "other-than-source",
            },
            count: { type: "all" },
          },
          to: {
            selector: "self",
          },
          count: { type: "any-number" },
        },
      },
    },
    oncePerTurnInstantRemove1CounterFromCreate: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "instant",
      cost: {
        class: "effect",
        type: "remove-counters",
        counter: {
          kind: "numeric",
          value: 1,
          property: "power",
        },
        count: 1,
      },
      effect: {
        type: "create-token",
        token: "spectral-shield",
        controller: "controller",
      },
    },
  }),
});

export const { yellow: restlessCoalescenceYellow } = restlessCoalescence.cards;
