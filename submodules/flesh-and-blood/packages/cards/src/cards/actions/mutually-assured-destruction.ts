import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/mutually-assured-destruction.generated.ts";

export const mutuallyAssuredDestruction = definePitchFamily(
  fabPitchFamilies["mutually-assured-destruction"],
  {
    abilities: () => ({
      contract: {
        kind: "resolution",
        effect: {
          type: "contract-task",
          task: "banish infected opponents' cards",
          completeOn: "banish",
          filter: { controllerControls: { typeBox: { subtypes: ["Disease"] } } },
        },
        label: { name: "contract" },
      },
      reward: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: { name: "complete-contract", actor: { kind: "any" }, observes: { kind: "none" } },
        },
        resolution: {
          kind: "effect",
          effect: { type: "create-token", token: "silver", controller: "controller" },
        },
        label: { name: "contract" },
      },
      reactions: {
        kind: "static",
        staticKind: "triggered",
        trigger: {
          kind: "event",
          event: {
            kind: "any-of",
            patterns: [
              {
                name: "play",
                actor: { kind: "any" },
                observes: {
                  kind: "event-object",
                  selector: "played-card",
                  relationship: { kind: "any" },
                  filter: { typeBox: { subtypes: ["Reaction"] } },
                },
              },
              {
                name: "activate",
                abilityType: "attack-reaction",
                actor: { kind: "any" },
                observes: {
                  kind: "event-object",
                  selector: "activated-card",
                  relationship: { kind: "any" },
                },
              },
              {
                name: "activate",
                abilityType: "defense-reaction",
                actor: { kind: "any" },
                observes: {
                  kind: "event-object",
                  selector: "activated-card",
                  relationship: { kind: "any" },
                },
              },
            ],
          },
        },
        limit: { count: 1, per: "chain-link", ordinals: [1], scope: "actor" },
        resolution: {
          kind: "effect",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "for-each",
                target: { selector: "each-hero" },
                effect: {
                  type: "create-token",
                  token: "bloodrot-pox",
                  controller: "iteration-subject",
                },
              },
              {
                type: "for-each",
                target: { selector: "each-hero" },
                effect: {
                  type: "banish",
                  target: {
                    selector: "object",
                    declared: "at-resolution",
                    player: "iteration-subject",
                    zones: ["deck"],
                    position: "top",
                    count: 1,
                  },
                },
              },
            ],
          },
        },
      },
    }),
  },
);

export const { red: mutuallyAssuredDestructionRed } = mutuallyAssuredDestruction.cards;
