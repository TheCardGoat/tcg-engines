import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/thespian-charm.generated.ts";

export const thespianCharm = definePitchFamily(fabPitchFamilies["thespian-charm"], {
  abilities: () => ({
    chooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "any-number",
        },
      },
      modes: {
        destroyMightVigorToken: {
          kind: "resolution",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "at-resolution",
              zones: ["permanent"],
              filter: {
                and: [
                  {
                    or: [
                      {
                        name: "Might",
                      },
                      {
                        name: "Vigor",
                      },
                    ],
                  },
                  {
                    typeBox: {
                      metatypes: ["Token"],
                    },
                  },
                ],
              },
              count: 1,
            },
          },
        },
        crowdCheers: {
          kind: "resolution",
          effect: {
            type: "crowd-cheers",
            target: "controller",
          },
        },
        returnAuraPermanentControlOwnerSHand: {
          kind: "resolution",
          effect: {
            type: "move-card",
            target: {
              selector: "object",
              declared: "at-resolution",
              // "an aura permanent you control" scans the arena, not the
              // combat chain — the sibling PEN171/PEN230 grammar.
              player: "controller",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
            to: {
              zone: "hand",
            },
          },
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    }),
  }),
});

export const { yellow: thespianCharmYellow } = thespianCharm.cards;
