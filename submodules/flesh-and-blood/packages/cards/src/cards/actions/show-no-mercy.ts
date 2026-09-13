import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/show-no-mercy.generated.ts";

export const showNoMercy = definePitchFamily(fabPitchFamilies["show-no-mercy"], {
  keywords: [
    {
      name: "specialization",
      hero: "Rhinar",
    },
  ],
  abilities: () => ({
    whenAttacksHeroIntimidateThem: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "attack",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "source",
            selector: "attack",
          },
          target: {
            kind: "hero",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "intimidate",
          target: "attack-target",
        },
      },
      label: {
        name: "intimidate",
      },
    },
    defendingHeroHasNoInHandGetsNumber3Power: {
      kind: "resolution",
      condition: {
        type: "zone-count",
        zone: "hand",
        player: "defending-hero",
        comparison: {
          op: "eq",
          value: 0,
        },
      },
      effect: {
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 3,
        target: {
          selector: "self",
        },
        duration: "this-turn",
      },
      label: {
        name: "intimidate",
      },
    },
  }),
});

export const { red: showNoMercyRed } = showNoMercy.cards;
