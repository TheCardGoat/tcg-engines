import assert from "node:assert/strict";
import test from "node:test";

import { buildCardIdentityModel, renderCardIdentityModule } from "./generate-card-identities.mjs";

const card = (canonicalId, slug, types, color, pitch) => ({
  canonicalId,
  slug,
  types,
  traits: [],
  ...(color ? { color } : {}),
  ...(pitch ? { pitch } : {}),
});

test("models playable colors as pitch variants and colored resources as singletons", () => {
  const catalog = {
    cards: [
      card("red", "sample-red", ["Action"], "Red", "1"),
      card("blue", "sample-blue", ["Action"], "Blue", "3"),
      card("chi", "inner-chi", ["Resource"], "Blue", "3"),
    ],
  };
  const manifest = [
    {
      canonicalId: "red",
      module: "cards/actions/sample.ts",
      primaryType: "Action",
      stableFamilyKey: "sample",
    },
    {
      canonicalId: "blue",
      module: "cards/actions/sample.ts",
      primaryType: "Action",
      stableFamilyKey: "sample",
    },
    {
      canonicalId: "chi",
      module: "cards/resources/inner-chi.ts",
      primaryType: "Resource",
      stableFamilyKey: "inner-chi",
    },
  ];
  const model = buildCardIdentityModel(catalog, manifest);
  assert.deepEqual(model.units["actions/sample"], {
    kind: "pitch",
    familyKey: "sample",
    variants: { red: "red", blue: "blue" },
  });
  assert.deepEqual(model.units["resources/inner-chi"], { kind: "singleton", identity: "chi" });
  assert.deepEqual(model.pitchFamilies.sample, {
    slug: "sample",
    shared: {
      typeBox: { metatypes: [], supertypes: [], types: ["Action"], subtypes: [] },
    },
    variants: {
      red: { canonicalId: "red", slug: "sample-red" },
      blue: { canonicalId: "blue", slug: "sample-blue" },
    },
  });
  const output = renderCardIdentityModule({
    identities: {},
    pitchFamilies: { sample: model.pitchFamilies.sample },
  });
  assert.match(output, /export const fabPitchFamilies/);
  assert.match(output, /PitchFamilyIdentity<"red" \| "blue">/);
  assert.doesNotMatch(output, /collectorNumber|printings|setCode/);
});

test("preserves shared hybrid supertype alternatives in pitch families", () => {
  const catalog = {
    cards: [
      {
        ...card("red", "hybrid-red", ["Guardian", "Warrior", "Action"], "Red", "1"),
        supertypeSets: [["Guardian"], ["Warrior"]],
      },
    ],
  };
  const manifest = [
    {
      canonicalId: "red",
      module: "cards/actions/hybrid.ts",
      primaryType: "Action",
      stableFamilyKey: "hybrid",
    },
  ];

  assert.deepEqual(buildCardIdentityModel(catalog, manifest).pitchFamilies.hybrid.shared, {
    typeBox: {
      metatypes: [],
      supertypeSets: [["Guardian"], ["Warrior"]],
      supertypes: ["Guardian", "Warrior"],
      types: ["Action"],
      subtypes: [],
    },
  });
});
