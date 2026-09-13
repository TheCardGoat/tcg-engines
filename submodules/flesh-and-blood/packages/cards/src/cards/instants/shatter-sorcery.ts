import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/shatter-sorcery.generated.ts";

export const shatterSorcery = definePitchFamily(fabPitchFamilies["shatter-sorcery"], {
  abilities: () => ({
    chooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: {
          type: "up-to",
          amount: 2,
        },
      },
      modes: {
        destroyTargetAuraPermanentSigilName: {
          kind: "resolution",
          effect: {
            type: "destroy",
            target: {
              selector: "object",
              declared: "on-stack",
              zones: ["permanent"],
              filter: {
                nameContains: "Sigil",
                typeBox: {
                  subtypes: ["Aura"],
                },
              },
              count: 1,
            },
          },
        },
        preventNext1ArcaneDamageWouldBeDealtTarget: {
          kind: "resolution",
          effect: {
            type: "prevention",
            preventionKind: "fixed",
            amount: 1,
            damageType: "arcane",
            shielded: {
              selector: "any-hero",
            },
            duration: "this-turn",
          },
        },
      },
    }),
  }),
});

export const { blue: shatterSorceryBlue } = shatterSorcery.cards;
