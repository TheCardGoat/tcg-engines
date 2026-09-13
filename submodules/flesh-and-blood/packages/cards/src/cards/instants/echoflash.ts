import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { fabPitchFamilies } from "../../generated/card-identities/instants/echoflash.generated.ts";

export const echoflash = definePitchFamily(fabPitchFamilies["echoflash"], {
  abilities: () => ({
    deal1ArcaneDamageTargetHero: {
      kind: "resolution",
      effect: {
        type: "deal-damage",
        damageType: "arcane",
        amount: 1,
        target: {
          selector: "any-hero",
        },
      },
    },
    whenIsPutIntoGraveyardFromAnywhereHeroDeals: {
      kind: "static",
      staticKind: "triggered",
      trigger: {
        kind: "event",
        event: {
          name: "put-into-graveyard",
          actor: {
            kind: "any",
          },
          observes: {
            kind: "source",
            selector: "moved-object",
          },
        },
      },
      resolution: {
        kind: "effect",
        effect: {
          type: "deal-damage",
          damageType: "arcane",
          amount: 1,
          target: {
            selector: "any-hero",
          },
          source: {
            selector: "controller",
          },
        },
      },
    },
  }),
});

export const { yellow: echoflashYellow } = echoflash.cards;
