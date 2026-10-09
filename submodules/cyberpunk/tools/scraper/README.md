# Cyberpunk card scraper

The scraper writes the official card catalog to `packages/cards/src/generated.ts`.
It joins card FAQs from the separately loaded `/faqs/cyberpunk?scope=card` feed
by the card's official external ID. Detail-record `rulings` remain the source
for any printing-specific rulings or errata.

## Review and localize rulings before a PR

1. Run `vp run scrape:faqs` from this directory to refresh the separate FAQ
   feed without changing card or printing data. `vp run scrape` refreshes both.
2. Review each new English question and answer against the official card page.
3. Use AI to draft translations for German, Spanish, French, Italian, and Brazilian Portuguese. Review game terms, numbers, timing, and printing scope by hand.
4. Use `translations/card-faq-drafts.json` as the review queue. These AI drafts
   are not loaded by the card page. Compare each translation with the official
   FAQ and, where available, official localized printings. In particular,
   translate card types consistently with the printed language.

5. Add each reviewed set to `packages/cards/src/rulings.ts`, keyed by official ruling ID. Copy the exact English source question and answer into the entry. The type requires all five translations.
6. Run the scraper and card, API, and web checks. Check the card page in each language and switch printings. A changed English source invalidates the saved translations; the page labels the English text until it is reviewed again.

## Development

- Install dependencies:

```bash
vp install
```

- Run the unit tests:

```bash
vp test
```

- Build the library:

```bash
vp pack
```
