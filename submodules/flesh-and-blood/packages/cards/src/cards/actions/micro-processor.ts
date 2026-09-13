import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/micro-processor.generated.ts";

export const microProcessor = definePitchFamily(fabPitchFamilies["micro-processor"], {
  keywords: [
    {
      name: "specialization",
      hero: "Data Doll",
    },
  ],
  abilities: () => ({
    oncePerTurnAction0Opt1: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
      },
      effect: {
        type: "opt",
        count: 1,
      },
    },
    oncePerTurnAction0DrawThenPutHandTopDeck: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            count: 1,
            player: "controller",
          },
          {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "controller",
              zones: ["hand"],
              filter: {},
              count: 1,
            },
            to: {
              zone: "deck",
              position: "top",
            },
          },
        ],
      },
    },
    oncePerTurnAction0BanishTopDeck: {
      kind: "activated",
      limit: {
        count: 1,
        per: "turn",
      },
      abilityType: "action",
      cost: {
        class: "asset",
        type: "resources",
        amount: 0,
      },
      effect: {
        type: "banish",
        target: {
          selector: "object",
          declared: "at-resolution",
          player: "controller",
          zones: ["deck"],
          position: "top",
          count: 1,
        },
        outputBinding: "it",
      },
    },
    firstTimeActivateMicroProcessorTurnGain1ActionPoint: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "activate",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "event-object",
            selector: "activated-card",
            relationship: {
              kind: "any",
            },
            filter: {
              hasStatus: "self",
            },
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "gain-action-points",
          amount: 1,
        },
      },
      limit: {
        count: 1,
        per: "turn",
        ordinals: [1],
      },
    },
  }),
});

export const { blue: microProcessorBlue } = microProcessor.cards;
