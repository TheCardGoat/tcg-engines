import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  buildCanonicalManifest,
  renderCardsIndex,
  renderStaticRegistry,
} from "./generate-canonical-card-manifest.mjs";

function catalogCard(canonicalId, slug) {
  return {
    canonicalId,
    slug,
    types: ["Generic", "Action"],
    color: "Red",
    pitch: "1",
  };
}

test("discovers authored exports and excludes explicit implementation gaps", async () => {
  const sourceRoot = mkdtempSync(path.join(tmpdir(), "fab-canonical-manifest-"));
  try {
    const actions = path.join(sourceRoot, "cards", "actions");
    mkdirSync(actions, { recursive: true });
    writeFileSync(
      path.join(actions, "ready.ts"),
      'export const readyRed = { canonicalId: "ready-id", slug: "ready-red", layout: { kind: "single" }, base: { typeBox: {} } };\n',
    );
    writeFileSync(
      path.join(actions, "ready.i18n.ts"),
      'export const readyRedI18n = { canonicalId: "ready-id", locales: { en: {} } };\n',
    );
    writeFileSync(
      path.join(actions, "pending.ts"),
      "// IMPLEMENTATION GAP: pending behavior\nexport const pendingRed = {};\n",
    );

    const { manifest, implementationGaps } = await buildCanonicalManifest({
      catalog: {
        cards: [catalogCard("ready-id", "ready-red"), catalogCard("pending-id", "pending-red")],
      },
      sourceRoot,
    });

    assert.deepEqual(
      manifest.map((entry) => entry.canonicalId),
      ["ready-id"],
    );
    assert.equal(manifest[0].exportName, "readyRed");
    assert.equal(manifest[0].i18nExportName, "readyRedI18n");
    assert.deepEqual(implementationGaps, [
      { module: "cards/actions/pending.ts", canonicalIds: ["pending-id"] },
    ]);
    assert.match(renderCardsIndex(manifest), /export \* from "\.\/actions\/ready\.ts"/);
    const registry = renderStaticRegistry(manifest);
    assert.match(registry, /import \{ readyRed \}/);
    assert.match(registry, /import \{ readyRedI18n \}/);
    assert.match(registry, /localizeFleshAndBloodCard\(card, i18n\)/);
    assert.match(registry, /CARD_I18N_BY_CANONICAL_ID/);
  } finally {
    rmSync(sourceRoot, { recursive: true, force: true });
  }
});
