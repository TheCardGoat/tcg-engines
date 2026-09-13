import { HERO_SPECIAL_UI_CATALOG } from "./hero-special-ui";
import { HeroSpecialArea } from "./HeroSpecialArea";

function previewFor(id: string, tokens: readonly string[], mustShow: readonly string[]) {
  const ids = tokens.slice(0, 3).map((_, index) => `${id}-token-${index}`);
  return {
    ids,
    metadata: new Map(
      ids.map((tokenId, index) => [tokenId, { name: tokens[index] ?? "Token", type: "token" }]),
    ),
    projection: {
      chi: 2,
      soul: ["Soul 1", "Soul 2"],
      bloodDebt: ["Blood Debt 1", "Blood Debt 2"],
      playableFromBanished: ["Playable card"],
      counters: { Energy: 2 },
      statuses: mustShow.slice(0, 2),
    },
  };
}

/** Developer visual-acceptance gallery. Each entry is catalog-composed, not a bespoke HUD. */
export function HeroSpecialPreviewGallery() {
  return (
    <section className="fab-special-gallery" data-testid="fab-hero-special-gallery">
      <header>
        <h2>Hero-special UI previews</h2>
        <p>Each preview composes the shared permanent-lane modules for its catalog family.</p>
      </header>
      <div className="fab-special-gallery-grid">
        {HERO_SPECIAL_UI_CATALOG.map((hero) => {
          const preview = previewFor(hero.id, hero.signatureTokens, hero.mustShow);
          return (
            <a
              key={hero.id}
              className="fab-special-gallery-entry"
              data-hero-id={hero.id}
              data-testid={`fab-hero-special-preview-${hero.id}`}
              href={`/flesh-and-blood/simulator/tests/hero-special-${hero.id}`}
              aria-label={`Open ${hero.hero} special UI fixture`}
            >
              <HeroSpecialArea
                heroName={hero.hero}
                permanentIds={preview.ids}
                banishedIds={[`${hero.id}-banished-1`, `${hero.id}-banished-2`]}
                cardMetadata={preview.metadata}
                projection={preview.projection}
                side="bottom"
              />
            </a>
          );
        })}
      </div>
    </section>
  );
}
