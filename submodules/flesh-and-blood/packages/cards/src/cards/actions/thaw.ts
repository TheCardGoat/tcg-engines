import { semanticTriggeredModalResolution } from "../../authoring/card.ts";
import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/thaw.generated.ts";

export const thaw = definePitchFamily(fabPitchFamilies["thaw"], {
  abilities: () => ({
    whileInGraveyardAtStartTurnBanishChooseNumber1DestroyFrostbiteDestroy: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        // "While this is in your graveyard" is the ability's functional zone,
        // not a state condition that invalidates its layer after self-banish.
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      },
      resolution: semanticTriggeredModalResolution({
        kind: "modal",
        choose: 1,
        modes: {
          destroyFrostbite: {
            kind: "resolution",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["permanent"],
                // "target Frostbite" — Frostbite is a named token
                // (ELE111), not a type line (UPR105 idiom).
                filter: {
                  name: "Frostbite",
                },
                count: 1,
              },
              outputBinding: "it",
            },
          },
          destroyIceAffliction: {
            kind: "resolution",
            effect: {
              type: "destroy",
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["permanent"],
                // "target Ice affliction" — Ice supertype AND Affliction
                // subtype (UPR105 resolved the same phrase this way;
                // Hypothermia is the canonical Ice affliction).
                filter: {
                  typeBox: {
                    supertypes: ["Ice"],
                    subtypes: ["Affliction"],
                  },
                },
                count: 1,
              },
            },
          },
          unfreezePermanentOrArsenal: {
            kind: "resolution",
            effect: {
              type: "unfreeze",
              target: {
                selector: "object",
                declared: "on-stack",
                zones: ["permanent", "arsenal"],
                filter: {
                  hasStatus: "frozen",
                },
                count: 1,
              },
            },
          },
        },
      }),
      functionalZones: ["graveyard"],
      additionalCost: {
        class: "effect",
        type: "banish-self",
        optional: true,
      },
    },
  }),
});

export const { red: thawRed } = thaw.cards;
