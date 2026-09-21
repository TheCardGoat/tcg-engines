import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/united-we-stand.generated.ts";

export const unitedWeStand = definePitchFamily(fabPitchFamilies["united-we-stand"], {
  abilities: () => ({
    whenDefendsTogetherWithFromHandBoltynInPartyCreateCourageToken: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event-and-state",
        event: {
          name: "defend",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "defender",
          },
          cohort: {
            kind: "together-with",
            filter: {
              playedFromZones: ["hand"],
            },
          },
        },
        state: { type: "control-object", filter: { nameContains: "Boltyn" }, zones: ["hero"] },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "create-token",
              token: "courage",
              creator: "effect-controller",
              controller: "any",
            },
            {
              type: "sequence",
              steps: [
                {
                  type: "conditional",
                  condition: {
                    type: "control-object",
                    filter: { nameContains: "Bravo" },
                    zones: ["hero"],
                  },
                  then: {
                    type: "create-token",
                    token: "seismic-surge",
                    creator: "effect-controller",
                    controller: "any",
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "control-object",
                    filter: { nameContains: "Briar" },
                    zones: ["hero"],
                  },
                  then: {
                    type: "create-token",
                    token: "embodiment-of-earth",
                    creator: "effect-controller",
                    controller: "any",
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "control-object",
                    filter: { nameContains: "Dorinthea" },
                    zones: ["hero"],
                  },
                  then: {
                    type: "create-token",
                    token: "courage",
                    creator: "effect-controller",
                    controller: "any",
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "control-object",
                    filter: { nameContains: "Lexi" },
                    zones: ["hero"],
                  },
                  then: {
                    type: "create-token",
                    token: "embodiment-of-lightning",
                    creator: "effect-controller",
                    controller: "any",
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "control-object",
                    filter: { nameContains: "Oldhim" },
                    zones: ["hero"],
                  },
                  then: {
                    type: "create-token",
                    token: "spellbane-aegis",
                    creator: "effect-controller",
                    controller: "any",
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "control-object",
                    filter: { nameContains: "Prism" },
                    zones: ["hero"],
                  },
                  then: {
                    type: "create-token",
                    token: "spectral-shield",
                    creator: "effect-controller",
                    controller: "any",
                  },
                },
                {
                  type: "conditional",
                  condition: {
                    type: "control-object",
                    filter: { nameContains: "Shiyana" },
                    zones: ["hero"],
                  },
                  then: {
                    type: "create-token",
                    token: "eloquence",
                    creator: "effect-controller",
                    controller: "any",
                  },
                },
              ],
            },
          ],
        },
      },
      label: {
        name: "unity",
      },
    },
  }),
});

export const { yellow: unitedWeStandYellow } = unitedWeStand.cards;
