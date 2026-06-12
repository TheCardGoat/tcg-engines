import { Link, useParams } from "react-router-dom";
import { deckJsonLd, getDeckSeoProfile, getPublicDeckSeoProfiles } from "../seo/deckSeo";
import { absoluteUrl } from "../seo/site";
import { useDocumentSeo } from "../seo/useDocumentSeo";
import classes from "./Decks.module.css";

export function DecksPage() {
  const decks = getPublicDeckSeoProfiles();
  useDocumentSeo({
    title: "Cyberpunk TCG Decks | The Card Goat",
    description:
      "Browse public Cyberpunk TCG decklists with Legends, card counts, archetype tags, and practice-ready deck builder links.",
    canonicalUrl: absoluteUrl("/decks/"),
  });

  return (
    <main className={classes.page}>
      <div className={classes.shell}>
        <header className={classes.header}>
          <p className={classes.eyebrow}>Cyberpunk · decks</p>
          <h1 className={classes.title}>Public deck lists</h1>
          <p className={classes.lead}>
            Indexable Cyberpunk TCG decks built from valid simulator lists, ready to inspect or load
            into a local AI practice match.
          </p>
        </header>

        <section className={classes.deckGrid} aria-label="Public decks">
          {decks.map((deck) => (
            <Link key={deck.id} className={classes.deckCard} to={`/decks/${deck.id}/`}>
              <span className={classes.deckLabel}>{deck.label}</span>
              <span className={classes.deckDescription}>{deck.description}</span>
              <span className={classes.deckMeta}>
                {deck.mainDeckSize} cards · {deck.legends.map((legend) => legend.name).join(" / ")}
              </span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

export function DeckDetailPage() {
  const { deckId } = useParams();
  const profile = deckId ? getDeckSeoProfile(deckId) : undefined;

  useDocumentSeo({
    title: profile?.title ?? "Deck Not Found | The Card Goat",
    description:
      profile?.metaDescription ??
      "This Cyberpunk TCG decklist could not be found in the public deck index.",
    canonicalUrl: profile?.canonicalUrl ?? absoluteUrl("/decks/"),
    type: "article",
    jsonLd: profile ? deckJsonLd(profile) : undefined,
  });

  if (!profile) {
    return (
      <main className={classes.page}>
        <div className={classes.shell}>
          <header className={classes.header}>
            <p className={classes.eyebrow}>Cyberpunk · decks</p>
            <h1 className={classes.title}>Deck not found</h1>
            <p className={classes.lead}>The requested deck is not in the public deck index.</p>
          </header>
          <Link className={classes.backLink} to="/decks/">
            Back to public decks
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={classes.page}>
      <div className={classes.shell}>
        <header className={classes.header}>
          <p className={classes.eyebrow}>Cyberpunk · deck list</p>
          <h1 className={classes.title}>{profile.label}</h1>
          <p className={classes.lead}>{profile.description}</p>
          <div className={classes.tags} aria-label="Deck tags">
            {profile.tags.map((tag) => (
              <span key={tag} className={classes.tag}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        <section className={classes.summary} aria-label="Deck summary">
          <div>
            <span className={classes.statValue}>{profile.mainDeckSize}</span>
            <span className={classes.statLabel}>Main deck cards</span>
          </div>
          <div>
            <span className={classes.statValue}>{profile.uniqueMainDeckCards}</span>
            <span className={classes.statLabel}>Unique cards</span>
          </div>
          <div>
            <span className={classes.statValue}>{profile.updatedAt}</span>
            <span className={classes.statLabel}>Updated</span>
          </div>
        </section>

        <section className={classes.columns}>
          <div className={classes.panel}>
            <h2 className={classes.sectionTitle}>Legends</h2>
            <ul className={classes.cardList}>
              {profile.legends.map((card) => (
                <li key={card.id} className={classes.cardRow}>
                  <span>{card.name}</span>
                  <span>{card.type}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={classes.panel}>
            <h2 className={classes.sectionTitle}>Main deck</h2>
            <ul className={classes.cardList}>
              {profile.mainDeck.map((card) => (
                <li key={card.id} className={classes.cardRow}>
                  <span>{card.name}</span>
                  <span>
                    {card.count}x · {card.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className={classes.actions}>
          <Link className={classes.button} to="/practice">
            Practice this archetype
          </Link>
          <Link className={classes.backLink} to="/decks/">
            Back to public decks
          </Link>
        </div>
      </div>
    </main>
  );
}
