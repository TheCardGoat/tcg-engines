import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/numbskull-charm.generated.ts";

export const numbskullCharm = definePitchFamily(fabPitchFamilies["numbskull-charm"], {
  abilities: () => ({
    chooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "any-number",
        },
      },
      modes: {
        destroyConfidenceMightToken: {
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
                        name: "Confidence",
                      },
                      {
                        name: "Might",
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
        pitchTopDeckIfHas6MoreCreateVigor: {
          kind: "resolution",
          effect: {
            type: "sequence",
            steps: [
              {
                type: "move-card",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["deck"],
                  position: "top",
                  count: 1,
                },
                to: {
                  zone: "pitch",
                },
                outputBinding: "it",
              },
              {
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
                  type: "create-token",
                  token: "vigor",
                  controller: "controller",
                },
              },
            ],
          },
        },
      },
      label: {
        name: "the-crowd-cheers",
      },
    }),
  }),
});

export const { yellow: numbskullCharmYellow } = numbskullCharm.cards;
