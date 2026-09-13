import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/singularity.generated.ts";
import { legendary } from "../shared/keywords.ts";

export const singularity = definePitchFamily(fabPitchFamilies["singularity"], {
  keywords: [
    legendary,
    {
      name: "specialization",
      hero: "Teklovossen",
    },
  ],
  abilities: () => ({
    transformHeroWeaponNumber4EvosHaveEquippedIntoTeklovossenMechropotentEntersArena: {
      kind: "resolution",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "sequence",
            steps: [
              {
                type: "transform",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["hero"],
                  count: 1,
                },
                into: "teklovossen-the-mechropotent",
              },
              {
                type: "transform",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["weapon"],
                  count: 1,
                },
                into: "teklovossen-the-mechropotent",
              },
              {
                type: "transform",
                target: {
                  selector: "object",
                  declared: "at-resolution",
                  player: "controller",
                  zones: ["permanent"],
                  filter: {
                    typeBox: {
                      subtypes: ["Evo"],
                    },
                  },
                  count: 4,
                },
                into: "teklovossen-the-mechropotent",
              },
            ],
          },
          {
            type: "modify-numeric",
            property: "life",
            op: "set-base",
            amount: {
              type: "hero-property",
              property: "life",
              player: "controller",
            },
            target: {
              selector: "self",
            },
            duration: "permanent",
          },
        ],
      },
      label: {
        name: "transform",
      },
    },
  }),
});

export const { red: singularityRed } = singularity.cards;
