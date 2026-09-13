import { definePitchFamily } from "../../authoring/pitch-family.ts";
import { expandSemanticAbilities, typeBoxTokens } from "../../authoring/card.ts";
import { defineFlipLayout, defineLayoutFace } from "../../authoring/layouts.ts";
import {
  fabCardIdentitiesByCanonicalId,
  fabPitchFamilies,
} from "../../generated/card-identities/actions/invoke-kyloria.generated.ts";

import { goAgain } from "../shared/keywords.ts";
import { kyloria } from "../allies/kyloria.ts";

// Re-encoded as a flip-layout Invocation (UPR014/UPR017 golden; plan SS5):
// the prior plain transform parked the Invocation action inert in the arena
// without ever seating the ally - the flip layout is the shape the engine
// transforms end-to-end.
const invokeKyloriaIdentity = fabPitchFamilies["invoke-kyloria"].variants.red;
const kyloriaIdentity = fabCardIdentitiesByCanonicalId["PHgMJBpk9fJcWNrrnqztz"];
const invokeKyloriaAbilities = expandSemanticAbilities(invokeKyloriaIdentity.canonicalId, {
  transformAshIntoKyloria: {
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

export const invokeKyloria = definePitchFamily(fabPitchFamilies["invoke-kyloria"], {
  layouts: {
    red: defineFlipLayout({
      family: "invocation",
      front: defineLayoutFace(invokeKyloriaIdentity, {
        name: "Invoke Kyloria",
        typeText: "Draconic Illusionist Action - Invocation",
        types: ["Draconic", "Illusionist", "Action", "Invocation"],
        traits: [],
        text: "",
        keywords: [goAgain],
        abilities: invokeKyloriaAbilities,
        color: "red",
        numeric: { pitch: 1, cost: 1, defense: 3 },
      }),
      back: defineLayoutFace(kyloriaIdentity, {
        name: "Kyloria",
        typeText: "Draconic Illusionist - Dragon Ally",
        types: typeBoxTokens(kyloria.base.typeBox),
        traits: [],
        text: "",
        keywords: [],
        abilities: kyloria.base.abilities,
        numeric: { power: 4 },
      }),
    }),
  },
});

export const { red: invokeKyloriaRed } = invokeKyloria.cards;
