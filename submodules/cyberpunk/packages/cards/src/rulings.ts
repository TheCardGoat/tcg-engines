import type { RawCardRecord, RawCardRuling } from "@tcg/cyberpunk-types";

export const CYBERPUNK_RULING_LOCALES = ["en", "de", "es", "fr", "it", "pt-br"] as const;
export type CyberpunkRulingLocale = (typeof CYBERPUNK_RULING_LOCALES)[number];
type TranslationLocale = Exclude<CyberpunkRulingLocale, "en">;

export interface RulingText {
  question: string | null;
  answer: string;
}

export interface ReviewedRulingTranslations {
  /** A source change invalidates translations until they are reviewed again. */
  source: RulingText;
  translations: Record<TranslationLocale, RulingText>;
}

/**
 * Add reviewed, manually AI-assisted translations here, keyed by official ruling id.
 * Copy the exact English question and answer into `source`. Every supported
 * translation must be present before an entry typechecks.
 */
export const reviewedRulingTranslations = {
  "ed0b637f-567a-418c-a759-ab8deb631ce4": {
    source: {
      question: "If a friendly Unit steals two d6s simultaneously, can I increase two Gigs?",
      answer: "Yes, the effect triggers for each stolen d6.",
    },
    translations: {
      de: {
        question:
          "Wenn eine befreundete Einheit gleichzeitig zwei d6 stiehlt, kann ich zwei Gigs erhöhen?",
        answer: "Ja, der Effekt wird für jeden gestohlenen d6 ausgelöst.",
      },
      es: {
        question: "Si una Unidad aliada roba dos d6 al mismo tiempo, ¿puedo aumentar dos Gigs?",
        answer: "Sí, el efecto se activa por cada d6 robado.",
      },
      fr: {
        question: "Si une Unité alliée vole deux d6 simultanément, puis-je augmenter deux Gigs ?",
        answer: "Oui, l'effet se déclenche pour chaque d6 volé.",
      },
      it: {
        question: "Se un'Unità alleata ruba due d6 contemporaneamente, posso aumentare due Gig?",
        answer: "Sì, l'effetto si attiva per ogni d6 rubato.",
      },
      "pt-br": {
        question: "Se uma Unidade aliada roubar dois d6 ao mesmo tempo, posso aumentar dois Gigs?",
        answer: "Sim, o efeito é acionado para cada d6 roubado.",
      },
    },
  },
  "7cf45f7a-84df-4193-9f28-656d3054d183": {
    source: {
      question:
        "When La Llorona uses [BLOCKER], do I increase a Gig for her second effect before or after the ensuing fight?",
      answer: "Before.",
    },
    translations: {
      de: {
        question:
          "Wenn La Llorona [BLOCKER] einsetzt, erhöhe ich einen Gig durch ihren zweiten Effekt vor oder nach dem folgenden Kampf?",
        answer: "Davor.",
      },
      es: {
        question:
          "Cuando La Llorona usa [BLOCKER], ¿aumento un Gig por su segundo efecto antes o después del combate que sigue?",
        answer: "Antes.",
      },
      fr: {
        question:
          "Quand La Llorona utilise [BLOCKER], dois-je augmenter un Gig grâce à son deuxième effet avant ou après le combat qui suit ?",
        answer: "Avant.",
      },
      it: {
        question:
          "Quando La Llorona usa [BLOCKER], aumento un Gig per il suo secondo effetto prima o dopo il combattimento che segue?",
        answer: "Prima.",
      },
      "pt-br": {
        question:
          "Quando La Llorona usa [BLOCKER], aumento um Gig pelo segundo efeito dela antes ou depois do combate seguinte?",
        answer: "Antes.",
      },
    },
  },
  "10236d8a-b781-4d18-8857-57f7b3555983": {
    source: {
      question:
        "Can I use  a different Unit's [BLOCKER] effect after I block with La Llorna to redirect the attack again?",
      answer: "Yes. There is no limit of how many times you can use [BLOCKER] in one turn.",
    },
    translations: {
      de: {
        question:
          "Kann ich nach dem Blocken mit La Llorona den [BLOCKER]-Effekt einer anderen Einheit einsetzen, um den Angriff erneut umzulenken?",
        answer: "Ja. Du kannst [BLOCKER] in einem Zug beliebig oft einsetzen.",
      },
      es: {
        question:
          "¿Puedo usar el efecto [BLOCKER] de otra Unidad después de bloquear con La Llorona para redirigir el ataque de nuevo?",
        answer: "Sí. No hay límite de veces que puedes usar [BLOCKER] en un turno.",
      },
      fr: {
        question:
          "Puis-je utiliser l'effet [BLOCKER] d'une autre Unité après avoir bloqué avec La Llorona pour rediriger à nouveau l'attaque ?",
        answer:
          "Oui. Il n'y a pas de limite au nombre d'utilisations de [BLOCKER] pendant un tour.",
      },
      it: {
        question:
          "Posso usare l'effetto [BLOCKER] di un'altra Unità dopo aver bloccato con La Llorona per reindirizzare di nuovo l'attacco?",
        answer: "Sì. Non c'è limite al numero di volte in cui puoi usare [BLOCKER] in un turno.",
      },
      "pt-br": {
        question:
          "Posso usar o efeito [BLOCKER] de outra Unidade depois de bloquear com La Llorona para redirecionar o ataque novamente?",
        answer: "Sim. Não há limite de vezes que você pode usar [BLOCKER] em um turno.",
      },
    },
  },
  "287826c0-e5e6-4383-ab1a-a24314ebc44d": {
    source: {
      question: "Can La Llorona increase a Gig by 0, 1, 2, or 3, or must it increase by exactly 3?",
      answer: "Up to means 0, 1, 2, or 3.",
    },
    translations: {
      de: {
        question:
          "Kann La Llorona einen Gig um 0, 1, 2 oder 3 erhöhen, oder muss sie ihn genau um 3 erhöhen?",
        answer: "„Bis zu“ bedeutet 0, 1, 2 oder 3.",
      },
      es: {
        question:
          "¿Puede La Llorona aumentar un Gig en 0, 1, 2 o 3, o debe aumentarlo exactamente en 3?",
        answer: "«Hasta» significa 0, 1, 2 o 3.",
      },
      fr: {
        question:
          "La Llorona peut-elle augmenter un Gig de 0, 1, 2 ou 3, ou doit-elle l'augmenter exactement de 3 ?",
        answer: "« Jusqu'à » signifie 0, 1, 2 ou 3.",
      },
      it: {
        question:
          "La Llorona può aumentare un Gig di 0, 1, 2 o 3, oppure deve aumentarlo esattamente di 3?",
        answer: "«Fino a» significa 0, 1, 2 o 3.",
      },
      "pt-br": {
        question:
          "La Llorona pode aumentar um Gig em 0, 1, 2 ou 3, ou deve aumentá-lo em exatamente 3?",
        answer: "“Até” significa 0, 1, 2 ou 3.",
      },
    },
  },
} satisfies Record<string, ReviewedRulingTranslations>;

export interface LocalizedCardRuling extends RulingText {
  id: string;
  kind: RawCardRuling["kind"];
  languageCode: CyberpunkRulingLocale;
  cardPrintingId: string | null;
  source: string | null;
  rulingDate: string | null;
}

export function isCyberpunkRulingLocale(value: string): value is CyberpunkRulingLocale {
  return (CYBERPUNK_RULING_LOCALES as readonly string[]).includes(value);
}

export function collectCardRulings(
  cards: readonly RawCardRecord[],
  canonical: RawCardRecord,
): RawCardRuling[] {
  const rulings = new Map<string, RawCardRuling>();
  for (const ruling of canonical.rulings ?? []) {
    if (ruling.language_code === "en") rulings.set(ruling.id, ruling);
  }
  for (const card of cards) {
    if (card.slug !== canonical.slug || card === canonical) continue;
    for (const ruling of card.rulings ?? []) {
      if (ruling.language_code === "en" && ruling.card_printing_id) {
        if (!rulings.has(ruling.id)) rulings.set(ruling.id, ruling);
      }
    }
  }
  return [...rulings.values()];
}

export function localizeCardRuling(
  ruling: RawCardRuling,
  locale: CyberpunkRulingLocale,
  translations: Readonly<Record<string, ReviewedRulingTranslations>> = reviewedRulingTranslations,
): LocalizedCardRuling {
  const entry = translations[ruling.id];
  const sourceMatches =
    entry?.source.question === ruling.question && entry.source.answer === ruling.answer;
  const translated = locale !== "en" && sourceMatches ? entry.translations[locale] : undefined;

  return {
    id: ruling.id,
    kind: ruling.kind,
    question: translated ? translated.question : ruling.question,
    answer: translated?.answer ?? ruling.answer,
    languageCode: translated ? locale : "en",
    cardPrintingId: ruling.card_printing_id,
    source: ruling.source,
    rulingDate: ruling.ruling_date,
  };
}
