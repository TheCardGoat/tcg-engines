import { definePitchFamily, modalAbility } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/tome-of-aetherwind.generated.ts";

export const tomeOfAetherwind = definePitchFamily(fabPitchFamilies["tome-of-aetherwind"], {
  abilities: () => ({
    chooseModes: modalAbility({
      kind: "modal",
      modal: {
        choose: 2,
        allowRepeat: true,
      },
      modes: {
        increaseNextArcaneDamage: {
          kind: "resolution",
          effect: {
            type: "replacement",
            replacementKind: "standard",
            replaces: {
              name: "damage",
              damageType: "arcane",
            },
            modification: {
              type: "modify-numeric",
              property: "count",
              op: "add",
              amount: 1,
              target: {
                selector: "self",
              },
              duration: "permanent",
            },
            duration: "this-turn",
            appliesTo: {
              next: {
                hasStatus: "arcane-damage-effect",
              },
            },
          },
        },
        drawCard: {
          kind: "resolution",
          effect: {
            type: "draw",
            count: 1,
            player: "controller",
          },
        },
      },
    }),
  }),
});

export const { red: tomeOfAetherwindRed } = tomeOfAetherwind.cards;
