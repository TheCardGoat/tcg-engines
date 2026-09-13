import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities } from "../../authoring/card.ts";
import { defineSplitLayout } from "../../authoring/layouts.ts";
import { fabPitchFamilies } from "../../generated/card-identities/actions/pulsing-aether-life.generated.ts";

const pulsingAetherLifeIdentity = fabPitchFamilies["pulsing-aether-life"].variants.red;
const pulsingAetherAbilities = expandSemanticAbilities(pulsingAetherLifeIdentity.canonicalId, {
  dealArcaneDamage: {
    kind: "resolution",
    effect: {
      type: "deal-damage",
      damageType: "arcane",
      amount: 4,
      target: {
        selector: "object",
        declared: "on-stack",
        zones: ["hero", "permanent"],
        count: 1,
      },
    },
  },
});
const lifeAbilities = expandSemanticAbilities(pulsingAetherLifeIdentity.canonicalId, {
  gainLife: {
    kind: "resolution",
    effect: {
      type: "gain-life",
      amount: 1,
      target: { selector: "controller" },
    },
  },
});

export const pulsingAetherLife = definePitchFamily(fabPitchFamilies["pulsing-aether-life"], {
  layouts: {
    red: defineSplitLayout(pulsingAetherLifeIdentity, {
      left: {
        name: "Pulsing Aether",
        typeText: "Wizard Action",
        types: ["Wizard", "Action"],
        traits: [],
        text: "",
        keywords: [
          {
            name: "meld",
          },
        ],
        abilities: pulsingAetherAbilities,
      },
      right: {
        name: "Life",
        typeText: "Earth Instant",
        types: ["Earth", "Instant"],
        traits: [],
        text: "",
        keywords: [],
        abilities: lifeAbilities,
      },
    }),
  },
});

export const { red: pulsingAetherLifeRed } = pulsingAetherLife.cards;
