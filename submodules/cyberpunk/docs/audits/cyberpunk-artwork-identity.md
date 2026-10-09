# Cyberpunk artwork identity audit

The Atelier sells visual appearances, not product categories. `packages/cards/src/artwork-manifest.ts`
is the reviewed source for each printing's appearance identity, appearance
category, and the one simple appearance every player receives for each
canonical card. Equivalent beta, retail, starter, demo, and promo printings may
share an `artId`. A different illustration or visible treatment such as
full-art framing, a signature, or a stamp has a separate `artId` and requires
an Atelier unlock unless that art is the canonical card's only appearance.

The 2026-09-24 audit covered all 152 canonical cards, all 536 runtime printings,
and all matching local card image assets. The manifest has 290 appearances:
152 simple/free appearances and 138 alternate appearances. The reviewed image
groups were compared in side-by-side contact sheets under
`/tmp/cyberpunk-art-review` and `/tmp/cyberpunk-merge-review`. Two apparent
similarity splits were corrected after visual review: V: Corporate Exile's
beta/demo print and V: Streetkid's beta 005a print share the free retail art.
The Mantis Blades prerelease beta mark and other visible signatures/stamps stay
separate. Standard-only printings such as beta labels or changed collector
numbers do not become paid appearances by themselves.

Similarity metrics were used only to produce review candidates. Runtime code
does not compare pixels, infer from set membership, or classify unlisted
printings as free. Add each newly ingested printing to the manifest after
reviewing its image. Catalog integrity checks reject an unmapped printing or a
canonical card without a standard free appearance. The legacy map in the card
package maps every former per-printing art ID to its new appearance ID for a
one-time entitlement migration; keep printing IDs as provenance.
