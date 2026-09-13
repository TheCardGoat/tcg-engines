import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-ouvia.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { ouvia } from "../allies/ouvia.ts";

// Re-encoded as a flip-layout Invocation (UPR017 golden; FIX-5, plan §5): the
// prior plain `transform into:"ouvia"` parked the Invocation action inert in
// the arena without ever seating the ally — the flip layout is the shape the
// engine transforms end-to-end.
const invokeOuviaIdentity = fabPitchFamilies["invoke-ouvia"].variants.red;
const ouviaIdentity = fabCardIdentitiesByCanonicalId["dR8hjTth9bHpdLfTBPLNM"];
const invokeOuviaAbilities = expandSemanticAbilities(invokeOuviaIdentity.canonicalId, {
  transformAshIntoOuvia: {
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

export const invokeOuvia = definePitchFamily(fabPitchFamilies["invoke-ouvia"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeOuviaIdentity, {
        name: "Invoke Ouvia",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeOuviaAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 2, defense: 3 },
      }),
      back: defineLayoutFace(ouviaIdentity, {
        name: "Ouvia",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(ouvia.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: ouvia.base.abilities,
        numeric: { power: 1, life: 6 },
      }),
    }),
  },
});

export const { red: invokeOuviaRed } = invokeOuvia.cards;
