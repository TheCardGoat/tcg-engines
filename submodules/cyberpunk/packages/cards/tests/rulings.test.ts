import { expect, test } from "vite-plus/test";
import type { RawCardRuling } from "@tcg/cyberpunk-types";
import { rawCards } from "../src/generated.ts";
import { getCardRulingsBySlug } from "../src/index.ts";
import { collectCardRulings, localizeCardRuling } from "../src/rulings.ts";

const generalFaq: RawCardRuling = {
  id: "faq-general",
  kind: "faq",
  question: "Can I choose zero?",
  answer: "Yes. You may choose 0.",
  language_code: "en",
  card_printing_id: null,
  source: null,
  ruling_date: null,
};

const printErratum: RawCardRuling = {
  ...generalFaq,
  id: "errata-print",
  kind: "errata",
  question: null,
  answer: "Use the updated text.",
  card_printing_id: "beta-print",
};

test("collects canonical FAQs and print-specific rulings without older general FAQs", () => {
  const base = rawCards.find((card) => card.slug === "6th-street-recruits");
  if (!base) throw new Error("Card fixture is missing");
  const canonical = {
    ...base,
    slug: "example-card",
    rulings: [generalFaq],
  };
  const older = {
    ...base,
    slug: "example-card",
    rulings: [{ ...generalFaq, id: "obsolete-alpha-faq" }, printErratum],
  };
  const unrelated = {
    ...base,
    slug: "another-card",
    rulings: [printErratum],
  };

  expect(
    collectCardRulings([older, unrelated, canonical], canonical).map((ruling) => ruling.id),
  ).toEqual(["faq-general", "errata-print"]);
});

test("uses reviewed translation only while its English source still matches", () => {
  const translations = {
    "faq-general": {
      source: { question: generalFaq.question, answer: generalFaq.answer },
      translations: {
        de: { question: "Darf ich null wählen?", answer: "Ja. Du darfst 0 wählen." },
        es: { question: "¿Puedo elegir cero?", answer: "Sí. Puedes elegir 0." },
        fr: { question: "Puis-je choisir zéro ?", answer: "Oui. Vous pouvez choisir 0." },
        it: { question: "Posso scegliere zero?", answer: "Sì. Puoi scegliere 0." },
        "pt-br": { question: "Posso escolher zero?", answer: "Sim. Você pode escolher 0." },
      },
    },
  };

  expect(localizeCardRuling(generalFaq, "de", translations)).toMatchObject({
    question: "Darf ich null wählen?",
    answer: "Ja. Du darfst 0 wählen.",
    languageCode: "de",
  });
  expect(localizeCardRuling({ ...generalFaq, answer: "No." }, "de", translations)).toMatchObject({
    question: generalFaq.question,
    answer: "No.",
    languageCode: "en",
  });
});

test("loads scraped FAQs and reviewed text for the requested cards", () => {
  expect(getCardRulingsBySlug("6th-street-recruits", "fr")).toMatchObject([
    {
      id: "ed0b637f-567a-418c-a759-ab8deb631ce4",
      languageCode: "fr",
      answer: "Oui, l'effet se déclenche pour chaque d6 volé.",
    },
  ]);
  expect(getCardRulingsBySlug("la-llorona-ghost-of-the-past", "de")).toHaveLength(3);
});
