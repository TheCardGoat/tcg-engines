import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/liar-s-charm.generated.ts";

export const liarSCharm = definePitchFamily(fabPitchFamilies["liar-s-charm"], {
  abilities: () => ({
    chooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "any-number",
        },
      },
      modes: {
        stealToughnessVigorToken: {
          kind: "resolution",
          effect: {
            type: "gain-control",
            target: {
              selector: "object",
              declared: "at-resolution",
              player: "opponent",
              zones: ["permanent"],
              filter: {
                typeBox: {
                  metatypes: ["Token"],
                },
                or: [
                  {
                    name: "Toughness",
                  },
                  {
                    name: "Vigor",
                  },
                ],
              },
              count: 1,
            },
            controller: "controller",
            duration: "this-turn",
          },
        },
        crowdBoos: {
          kind: "resolution",
          effect: {
            type: "crowd-boos",
            target: "controller",
          },
        },
        targetHeroLosesCanTGainAbilitiesActionPhase: {
          kind: "resolution",
          effect: {
            type: "unless",
            effect: {
              type: "sequence",
              steps: [
                {
                  type: "remove-property",
                  property: {
                    kind: "abilities",
                  },
                  target: {
                    selector: "any-hero",
                  },
                  duration: "this-turn",
                },
                {
                  type: "rule-modification",
                  mode: "restrict",
                  action: "gain-abilities",
                  duration: "this-turn",
                },
              ],
            },
            escape: {
              type: "discard",
              target: {
                selector: "object",
                declared: "at-resolution",
                player: "opponent",
                zones: ["hand"],
                count: 1,
              },
            },
          },
        },
      },
      label: {
        name: "steal",
      },
    }),
  }),
});

export const { yellow: liarSCharmYellow } = liarSCharm.cards;
