# FAB fixture image loading

Fixtures use the same `FabPresentationRegistry`, pinned presentation catalog,
printing selection, image retry, and CDN board/full assets as production. A
fixture starts without the server-provided presentation envelope that a hosted
match normally receives, so it must request its definitions explicitly with
`useFabCardPresentation` inside `FleshAndBloodSimulatorProviders`, read
`useFabCardArt`, and pass that resolver to `presentRuntime`.

The hosted-controls and sidebar-preview routes omitted that request. Card backs
and icons worked because they have fixed URLs; face-up cards never received an
image URL. Both routes now use the normal loader. The local engine fixture shell,
history lab, clock lab, sideboard, and post-game lab already request presentation.

## Invented cards

`fixture-art-placeholders.ts` explicitly identifies invented objects such as
Reveal Lab Attack and test deck filler. They render their names, stats and rules
with **Test card placeholder · No printed artwork**, on both the board and the
preview. They do not borrow another card's art or offer a useless image retry.
Do not add real cards to this list to hide an asset failure.

Real-card stand-ins with ambiguous pitch names or spelling differences use exact
catalog references in `fixture-presentation.ts`. The audit found and repaired
Searing Shot (red), Herald of Triumph (red), Hyper Driver (token), Dorinthea
Ironsong, Melody, Sing-along, and Zyggy Starlight.

## Remaining source gaps (2026-09-09)

The audit covers all registered engine scenarios. These real card variants have
empty `boardImageUrl` and `imageUrl` values in the source printing catalog, and
consequently no board or full-card URLs in the production presentation catalog.
This is asset-content debt, independent of fixture loading.

| Card | Pitch | Canonical ID |
| --- | --- | --- |
| Demonbound Gloomblade | Yellow | QfFBhL9WNg9pdbTGqfPrh |
| Demonbound Gloomblade | Blue | Jr9TkGFQQQbFzNhQbPCCR |
| Hellbound Assault | Yellow | r7JgDQFn8LQRRBDDwMMTj |
| Hellbound Assault | Blue | zRNknjBBKWttC7kRgJG9g |
| Otherworldly Sins | Red | qk9CgqWCcCFdkddzNngPh |
| Otherworldly Sins | Yellow | HCjKd6dWLBBJbkwhbBtfC |
| Otherworldly Sins | Blue | nWPD8WCfJkKhb6JRhczTk |
| Blessing of Suraya | Yellow | jpGQNdgmndK8bBGmDRhp9 |
| Bravery of the Blade | Red | HNdCrFPzJPThCzLBqpMdt |
| Channel Stormgarden | Yellow | GDPhkGLTWbJFN6LDq9HW6 |
| Exorcism | Red | fCHHw7hpnDBBMk7QT6t69 |
| Mark of Neverest | Blue | WCDQmHjfcPBRfrpGh9dq8 |
| Mark of Pathstone | Blue | C8jPCtGhgHQnQLLnPzdRd |
| Mark of Ushering | Blue | LfctPwBM8nzQKQPmpLBRm |
| Restless Looter | Red | dBwz9ngzQjPkbrdqRkhFf |
| Restless Templar | Red | MQRmLGWG6rGCHtNChtbkm |
| Tome of Necrosis | Red | zQmwGLpLKkjtLTdpNdFK6 |
| Violent Gusto | Red | b6jbtNjPhLb8BwJPWNJ6g |

Repair requires verified printing-specific square/full assets in the sibling
assets repository, published CDN delivery, and regeneration of the FAB printing
and presentation catalogs. Do not substitute another pitch or printing. No
asset publication or deployment was performed as part of this investigation.

## Regression coverage

- `fixture-presentation-loading.test.tsx` mounts standalone routes and labs with
  an empty catalog, including hosted opening and required-equipment variants.
- `fixture-art-coverage.test.ts` boots every engine scenario through the production
  catalog loader and registry. It checks both art variants and permits only the
  exact documented source gaps; new gaps or repaired entries fail the
  audit until the list is updated. Passing this audit does not mean those
  cards have artwork.
- `fixture-art-placeholders.test.tsx` distinguishes deliberate placeholders from
  failed real-card images and verifies that invented cards cannot borrow art.
- Browser verification checks actual image decoding (`naturalWidth > 0`), not
  just URL presence. Board/full CDN availability still needs browser or delivery
  checks; jsdom cannot establish it.

Validation on 2026-09-07: 326 tests passed across seven focused files, and scoped
type-aware lint/type checks passed. Browser checks decoded six board images on
hosted-controls, twenty on sidebar-preview, and seven on the required-equipment
variant. The Palantir Aeronought full preview decoded at 1400 × 1956. The
reveal-and-shuffle fixture displayed two intentional placeholders and three
decoded real-card images, with no image-error fallbacks. These checks used the
existing Docker simulator on port 5182; port 5173 currently belongs to the
platform web service.

Run the focused checks from `apps/multi-game-simulator`:

```sh
pnpm test --maxWorkers 1 src/games/flesh-and-blood/fixture-art-coverage.test.ts src/games/flesh-and-blood/fixture-presentation-loading.test.tsx src/games/flesh-and-blood/fixture-art-placeholders.test.tsx src/games/flesh-and-blood/presentation-registry.test.ts
```
