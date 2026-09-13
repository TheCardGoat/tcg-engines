import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-yendurai.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { yendurai } from "../allies/yendurai.ts";

const invokeYenduraiIdentity = fabPitchFamilies["invoke-yendurai"].variants.red;
const yenduraiIdentity = fabCardIdentitiesByCanonicalId["gqTpfTkztdLpN8W6TpRtR"];
const invokeYenduraiAbilities = expandSemanticAbilities(invokeYenduraiIdentity.canonicalId, {
  transformAshIntoYendurai: {
    kind: "resolution",
    layerKeywords: [goAgain],
    effect: {
      type: "transform-into-resolving-card",
      target: {
        selector: "object",
        declared: "on-stack",
        player: "controller",
        zones: ["permanent"],
        filter: { name: "Ash" },
        count: 1,
      },
    },
    label: { name: "transform" },
  },
});

export const invokeYendurai = definePitchFamily(fabPitchFamilies["invoke-yendurai"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeYenduraiIdentity, {
        name: "Invoke Yendurai",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeYenduraiAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 1, defense: 3 },
      }),
      back: defineLayoutFace(yenduraiIdentity, {
        name: "Yendurai",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(yendurai.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: yendurai.base.abilities,
        numeric: { power: 3, life: 3 },
      }),
    }),
  },
});

export const { red: invokeYenduraiRed } = invokeYendurai.cards;
