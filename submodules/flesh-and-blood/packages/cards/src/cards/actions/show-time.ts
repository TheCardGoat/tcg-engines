import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/show-time.generated.ts";

export const showTime = definePitchFamily(fabPitchFamilies["show-time"], {
  keywords: [
    {
      name: "specialization",
      hero: "Bravo",
    },
  ],
  abilities: () => ({
    whenShowTimeEntersArenaSearchDeckForGuardianAttackActionReveal: {
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
            kind: "none",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "search",
              zones: ["deck"],
              // Guardian is a class (typeBox.supertypes). Catalog prints often
              // stash it in types[] (class-as-type); matches-filter unions the
              // type box so this still finds those snapshots.
              filter: {
                typeBox: {
                  types: ["Action"],
                  subtypes: ["Attack"],
                  supertypes: ["Guardian"],
                },
              },
              mayFail: true,
              to: {
                zone: "hand",
              },
            },
            {
              type: "shuffle",
              zone: "deck",
            },
          ],
        },
      },
    },
    atBeginningActionPhaseDestroyShowTimeDraw: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "action-phase-start",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
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
                selector: "self",
              },
            },
            {
              type: "draw",
              count: 1,
              player: "controller",
            },
          ],
        },
      },
    },
  }),
});

export const { blue: showTimeBlue } = showTime.cards;
