import type { AbilityDefinition } from "@tcg/lorcana-types";
import type { AbilitySignals, ExpectedTriggerClause, RecursiveValue } from "./types";
import { hasInChallengeRestriction } from "./signals";
import { isRecursiveObject, visitRecursive, normalizeCardTextContent } from "./utils";
import { isReplacementLikeText, startsWithTriggerSignal } from "./text-detection";

export function inferExpectedTriggerEvents(text: string): string[] {
  const normalizedText = normalizeCardTextContent(text);
  const expectedEvents = new Set<string>();
  const selfReference = "(?:this character|he|she|they)";

  if (
    new RegExp(
      `\\b(?:When|Whenever)\\s+${selfReference}\\s+is challenged and banished\\b`,
      "i",
    ).test(normalizedText)
  ) {
    expectedEvents.add("challenged-and-banished");
  }

  if (
    new RegExp(
      `\\b(?:When|Whenever)\\s+${selfReference}\\s+is banished in a challenge\\b`,
      "i",
    ).test(normalizedText)
  ) {
    expectedEvents.add("challenged-and-banished");
    expectedEvents.add("banish-in-challenge");
  }

  if (
    new RegExp(
      `\\b(?:When|Whenever)\\s+${selfReference}\\s+challenges and is banished\\b`,
      "i",
    ).test(normalizedText)
  ) {
    expectedEvents.add("banish");
    expectedEvents.add("banish-in-challenge");
  }

  if (
    /\b(?:When|Whenever)\s+(?:this character|one of your (?:other )?[\w-]+\s+characters|one of your characters|a character)\s+banishes another character in a challenge\b/i.test(
      normalizedText,
    )
  ) {
    expectedEvents.add("banish-in-challenge");
  }

  if (
    /\b(?:When|Whenever)\s+you play\b/i.test(normalizedText) ||
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+is played\\b`, "i").test(normalizedText)
  ) {
    expectedEvents.add("play");
  }

  if (
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+quests\\b`, "i").test(normalizedText)
  ) {
    expectedEvents.add("quest");
  }

  if (
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+sings\\b`, "i").test(normalizedText)
  ) {
    expectedEvents.add("sing");
  }

  if (
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+is banished\\b`, "i").test(
      normalizedText,
    )
  ) {
    expectedEvents.add("banish");
  }

  if (
    /\b(?:When|Whenever)\s+(?:one of your (?:other )?characters|an opposing character|an item)\s+is banished\b/i.test(
      normalizedText,
    )
  ) {
    expectedEvents.add("banish");
  }

  if (
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+is dealt damage\\b`, "i").test(
      normalizedText,
    )
  ) {
    expectedEvents.add("damage");
  }

  if (
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+challenges\\b`, "i").test(
      normalizedText,
    )
  ) {
    expectedEvents.add("challenge");
  }

  if (/\b(?:When|Whenever)\s+an opposing character becomes exerted\b/i.test(normalizedText)) {
    expectedEvents.add("exert");
  }

  if (
    /\b(?:When|Whenever)\s+(?:a card|you)\s+(?:is put|put)\s+(?:into|in)\s+your inkwell\b/i.test(
      normalizedText,
    )
  ) {
    expectedEvents.add("ink");
  }

  if (/\b(?:When|Whenever)\s+a character is banished here\b/i.test(normalizedText)) {
    expectedEvents.add("banish");
  }

  if (
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+is challenged\\b`, "i").test(
      normalizedText,
    )
  ) {
    expectedEvents.add("challenged");
  }

  if (
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+leaves play\\b`, "i").test(
      normalizedText,
    )
  ) {
    expectedEvents.add("leave-play");
  }

  if (
    /\b(?:When|Whenever)\s+you draw\b/i.test(normalizedText) ||
    /\b(?:When|Whenever)\s+[^,.;!?]*\bdraws? a card\b/i.test(normalizedText)
  ) {
    expectedEvents.add("draw");
  }

  if (
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+moves to\\b`, "i").test(normalizedText)
  ) {
    expectedEvents.add("move");
  }

  if (/\b(?:When|Whenever)\s+[^.]*\bis returned to\b/i.test(normalizedText)) {
    expectedEvents.add("return-to-hand");
  }

  if (/\b(?:When|Whenever)\s+you put a card under\b/i.test(normalizedText)) {
    expectedEvents.add("put-card-under");
  }

  if (
    /\b(?:When|Whenever)\s+you ready\b/i.test(normalizedText) ||
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+is readied\\b`, "i").test(
      normalizedText,
    )
  ) {
    expectedEvents.add("ready");
  }

  if (
    /\b(?:When|Whenever)\s+you deal damage\b/i.test(normalizedText) ||
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+deals damage\\b`, "i").test(
      normalizedText,
    )
  ) {
    expectedEvents.add("deal-damage");
  }

  if (
    /\b(?:When|Whenever)\s+(?:your opponent|an opponent|a player)\s+discards\b/i.test(
      normalizedText,
    )
  ) {
    expectedEvents.add("discard");
  }

  if (
    new RegExp(
      `\\b(?:When|Whenever)\\s+${selfReference}\\s+(?:is exerted|becomes exerted)\\b`,
      "i",
    ).test(normalizedText)
  ) {
    expectedEvents.add("exert");
  }

  if (/\b(?:When|Whenever)\s+you remove\b[^.]*\bdamage\b/i.test(normalizedText)) {
    expectedEvents.add("remove-damage");
  }

  if (
    new RegExp(`\\b(?:When|Whenever)\\s+${selfReference}\\s+is chosen\\b`, "i").test(normalizedText)
  ) {
    expectedEvents.add("be-chosen");
  }

  if (/\bAt the start of\b/i.test(normalizedText)) {
    expectedEvents.add("start-turn");
  }

  if (/\bAt the end of\b/i.test(normalizedText)) {
    expectedEvents.add("end-turn");
  }

  return [...expectedEvents].sort();
}

export function inferExpectedTriggerClauses(text: string): ExpectedTriggerClause[] {
  const normalizedText = normalizeCardTextContent(text);
  const clauses: ExpectedTriggerClause[] = [];
  const selfReference = "(?:this character|he|she|they)";
  const selfReferenceIs = "(?:this character is|he(?:'s| is)|she(?:'s| is)|they(?:'re| are))";
  const leadingClause =
    normalizedText.match(
      /^(?:(?:Once\s+)?during\b[^,]*,\s*|while\b[^,]*,\s*)*(?:When|Whenever|At)\b[^.]+/i,
    )?.[0] ?? normalizedText;
  const addClause = (event: string, timing: "when" | "whenever" | "at") => {
    clauses.push({ event, timing });
  };

  if (/\bWhen you play\b/i.test(leadingClause)) {
    addClause("play", "when");
  }

  if (
    /\bWhenever you play\b/i.test(leadingClause) ||
    new RegExp(`\\bWhenever\\s+${selfReference}\\s+is played\\b`, "i").test(leadingClause)
  ) {
    addClause("play", "whenever");
  }

  if (new RegExp(`\\bWhen\\s+${selfReference}\\s+leaves play\\b`, "i").test(leadingClause)) {
    addClause("leave-play", "when");
  }

  if (new RegExp(`\\bWhenever\\s+${selfReference}\\s+quests\\b`, "i").test(leadingClause)) {
    addClause("quest", "whenever");
  }

  if (new RegExp(`\\bWhenever\\s+${selfReferenceIs}\\s+challenged\\b`, "i").test(leadingClause)) {
    addClause("challenged", "whenever");
  }

  if (
    /\bWhenever\s+(?:another character|one of your (?:other )?characters|an opposing character|an item)\s+is banished in a challenge\b/i.test(
      leadingClause,
    )
  ) {
    addClause("banish-in-challenge", "whenever");
  }

  if (
    /\bWhenever\s+(?:another character|one of your (?:other )?characters|an opposing character|an item)\s+is banished\b/i.test(
      leadingClause,
    ) &&
    !/\bWhenever\s+(?:another character|one of your (?:other )?characters|an opposing character|an item)\s+is banished in a challenge\b/i.test(
      leadingClause,
    )
  ) {
    addClause("banish", "whenever");
  }

  if (
    new RegExp(
      `\\bWhenever\\s+(?:${selfReference}|one of your (?:other )?[\\w-]+\\s+characters|one of your characters|a character)\\s+banishes another character in a challenge(?: during your turn)?\\b`,
      "i",
    ).test(leadingClause)
  ) {
    addClause("banish-in-challenge", "whenever");
  }

  if (/\bWhenever you play a location\b/i.test(leadingClause)) {
    addClause("play", "whenever");
  }

  if (
    /\bWhenever\s+(?:a card|you)\s+(?:is put|put)\s+(?:into|in)\s+your inkwell\b/i.test(
      leadingClause,
    )
  ) {
    addClause("ink", "whenever");
  }

  if (/\bWhenever\s+a character is challenged and banished while here\b/i.test(leadingClause)) {
    addClause("challenged-and-banished", "whenever");
  }

  if (/\bWhenever you draw\b/i.test(leadingClause)) {
    addClause("draw", "whenever");
  }

  if (/^\s*At the start of\b/i.test(leadingClause)) {
    addClause("start-turn", "at");
  }

  if (/^\s*At the end of\b/i.test(leadingClause)) {
    addClause("end-turn", "at");
  }

  return clauses;
}

export function inferExpectedTriggerSubjects(text: string): string[] {
  const normalizedText = normalizeCardTextContent(text);
  const triggerClause =
    normalizedText.match(
      /^(?:(?:Once\s+)?during\b[^,]*,\s*)*(?:When|Whenever)\s+[^,.;!?]+/i,
    )?.[0] ?? normalizedText;
  const expectedSubjects = new Set<string>();

  if (/\b(?:When|Whenever)\s+you play another character\b/i.test(triggerClause)) {
    expectedSubjects.add("YOUR_OTHER_CHARACTERS");
  }

  const hasMixedSelfOrAnotherScope =
    /\b(?:When|Whenever)\s+you play this character\s+or\s+another\b/i.test(triggerClause);

  if (
    (!hasMixedSelfOrAnotherScope &&
      /\b(?:When|Whenever)\s+you play this character\b/i.test(triggerClause)) ||
    /\b(?:When|Whenever)\s+you put a card under this character\b/i.test(triggerClause) ||
    /\b(?:When|Whenever)\s+this character is challenged\b/i.test(triggerClause) ||
    /\b(?:When|Whenever)\s+this character is banished\b/i.test(triggerClause) ||
    /\b(?:When|Whenever)\s+this location is banished\b/i.test(triggerClause) ||
    /\b(?:When|Whenever)\s+this item is banished\b/i.test(triggerClause)
  ) {
    expectedSubjects.add("SELF");
  }

  if (/\b(?:When|Whenever)\s+[^,.;!?]*\bone of your locations\b/i.test(triggerClause)) {
    expectedSubjects.add("YOUR_LOCATIONS");
  }

  if (
    /\b(?:When|Whenever)\s+[^,.;!?]*\ba character here\b/i.test(triggerClause) ||
    /\b(?:When|Whenever)\s+a character\b[^,.;!?]*\bwhile here\b/i.test(triggerClause) ||
    /\b(?:When|Whenever)\s+[^,.;!?]*\bcharacters? is banished while here\b/i.test(triggerClause)
  ) {
    expectedSubjects.add("CHARACTERS_HERE");
  }

  if (/\b(?:When|Whenever)\s+[^,.;!?]*\bone of your other items\b/i.test(triggerClause)) {
    expectedSubjects.add("YOUR_OTHER_ITEMS");
  }

  if (
    /\b(?:When|Whenever)\s+[^,.;!?]*\bone of your items\b/i.test(triggerClause) &&
    !/\bone of your other items\b/i.test(triggerClause)
  ) {
    expectedSubjects.add("YOUR_ITEMS");
  }

  if (
    /\b(?:When|Whenever)\s+[^,.;!?]*\bone of your other characters or locations\b/i.test(
      triggerClause,
    )
  ) {
    expectedSubjects.add("YOUR_OTHER_CHARACTERS_OR_LOCATIONS");
  } else if (
    /\b(?:When|Whenever)\s+[^,.;!?]*\bone of your characters or locations\b/i.test(triggerClause)
  ) {
    expectedSubjects.add("YOUR_CHARACTERS_OR_LOCATIONS");
  }

  if (
    !expectedSubjects.has("YOUR_OTHER_CHARACTERS_OR_LOCATIONS") &&
    /\b(?:When|Whenever)\s+[^,.;!?]*\bone of your other characters\b/i.test(triggerClause)
  ) {
    expectedSubjects.add("YOUR_OTHER_CHARACTERS");
  }

  if (
    !expectedSubjects.has("YOUR_CHARACTERS_OR_LOCATIONS") &&
    /\b(?:When|Whenever)\s+[^,.;!?]*\bone of your characters\b/i.test(triggerClause) &&
    !/\bone of your other characters\b/i.test(triggerClause)
  ) {
    expectedSubjects.add("YOUR_CHARACTERS");
  }

  if (
    /\b(?:When|Whenever)\s+[^,.;!?]*\ban opposing character\b/i.test(triggerClause) &&
    !/\b(?:When|Whenever)\s+you play\b/i.test(triggerClause) &&
    !/\b(?:When|Whenever)\s+this character\b/i.test(triggerClause)
  ) {
    expectedSubjects.add("OPPONENT_CHARACTERS");
  }

  return [...expectedSubjects].sort();
}

export function triggerSubjectMatchesExpected(
  subject: RecursiveValue,
  expectedSubject: string,
): boolean {
  if (typeof subject === "string") {
    if (subject === expectedSubject || subject.startsWith(`${expectedSubject}_`)) {
      return true;
    }

    if (expectedSubject === "CHARACTERS_HERE") {
      return subject === "CHARACTER_HERE";
    }

    if (expectedSubject === "OPPONENT_CHARACTERS") {
      return subject === "OPPONENT_CHARACTERS" || subject === "OPPOSING_CHARACTERS";
    }

    return false;
  }

  if (!isRecursiveObject(subject)) {
    return false;
  }

  const cardType =
    typeof subject.cardType === "string"
      ? subject.cardType
      : Array.isArray(subject.cardType)
        ? subject.cardType
        : [];
  const hasCharacterCardType =
    cardType === "character" || (Array.isArray(cardType) && cardType.includes("character"));
  const hasLocationCardType = Array.isArray(cardType) && cardType.includes("location");
  const hasItemCardType =
    cardType === "item" || (Array.isArray(cardType) && cardType.includes("item"));
  const filters = Array.isArray(subject.filters) ? subject.filters : [];
  const isAtThisLocation = filters.some(
    (filter) =>
      isRecursiveObject(filter) && filter.type === "at-location" && filter.location === "this",
  );

  if (subject.controller === "you" && hasCharacterCardType) {
    if (expectedSubject === "YOUR_OTHER_CHARACTERS") {
      return subject.excludeSelf === true;
    }

    if (expectedSubject === "YOUR_CHARACTERS") {
      return subject.excludeSelf !== true;
    }
  }

  if (subject.controller === "you" && hasCharacterCardType && hasLocationCardType) {
    if (expectedSubject === "YOUR_CHARACTERS_OR_LOCATIONS") {
      return subject.excludeSelf !== true;
    }

    if (expectedSubject === "YOUR_OTHER_CHARACTERS_OR_LOCATIONS") {
      return subject.excludeSelf === true;
    }
  }

  if (subject.controller === "you" && hasItemCardType) {
    if (expectedSubject === "YOUR_OTHER_ITEMS") {
      return subject.excludeSelf === true;
    }

    if (expectedSubject === "YOUR_ITEMS") {
      return subject.excludeSelf !== true;
    }
  }

  if (expectedSubject === "OPPONENT_CHARACTERS") {
    return subject.controller === "opponent" && hasCharacterCardType;
  }

  if (expectedSubject === "CHARACTERS_HERE") {
    if (subject === "CHARACTERS_HERE" || subject === "CHARACTER_HERE") {
      return true;
    }

    return hasCharacterCardType && isAtThisLocation;
  }

  return false;
}

export function hasExpectedTriggerSubjectParity(
  text: string,
  abilities: AbilityDefinition[] | undefined,
): boolean {
  if (isReplacementLikeText(text)) {
    return true;
  }

  const expectedSubjects = inferExpectedTriggerSubjects(text);
  if (expectedSubjects.length === 0) {
    return true;
  }

  const observedSubjects: RecursiveValue[] = [];
  for (const ability of abilities ?? []) {
    visitRecursive(ability as unknown as RecursiveValue, (node) => {
      if (
        node.trigger &&
        isRecursiveObject(node.trigger) &&
        "on" in node.trigger &&
        node.trigger.on !== undefined
      ) {
        observedSubjects.push(node.trigger.on);
      }
    });
  }

  return expectedSubjects.every((expectedSubject) =>
    observedSubjects.some((observedSubject) =>
      triggerSubjectMatchesExpected(observedSubject, expectedSubject),
    ),
  );
}

export function requiresAllExpectedTriggerEvents(text: string): boolean {
  const normalizedText = normalizeCardTextContent(text);
  return /\b(?:when|whenever|at)\b[\s\S]*\band\s+(?:when|whenever|at)\b/i.test(normalizedText);
}

export function requiresChallengeScopedBanishSupport(text: string): boolean {
  const normalizedText = normalizeCardTextContent(text);

  return (
    /\b(?:When|Whenever)\s+[^.]*\bbanished in a challenge\b/i.test(normalizedText) ||
    /\b(?:When|Whenever)\s+[^.]*\bbanishes another character in a challenge\b/i.test(
      normalizedText,
    ) ||
    /\b(?:When|Whenever)\s+[^.]*\bchallenged and banished\b/i.test(normalizedText)
  );
}

export function hasGrantedChallengeScopedBanishSupport(
  text: string,
  signals: AbilitySignals,
): boolean {
  const normalizedText = normalizeCardTextContent(text);

  return (
    /\b(?:gain|gains|give|gives)\b[\s\S]*"[^"]*\bbanished in a challenge\b[^"]*"/i.test(
      normalizedText,
    ) && signals.nestedTypes.includes("grant-ability")
  );
}

export function hasExpectedTriggerClauseParity(
  text: string,
  abilities: AbilityDefinition[] | undefined,
): boolean {
  const expectedClauses = inferExpectedTriggerClauses(text);
  if (expectedClauses.length === 0) {
    return true;
  }

  const observedClauses = new Set<string>();

  for (const ability of abilities ?? []) {
    if (ability.type !== "triggered") {
      continue;
    }

    if (typeof ability.trigger.event === "string") {
      observedClauses.add(`${ability.trigger.event}:${ability.trigger.timing}`);

      if (ability.trigger.event === "banish" && hasInChallengeRestriction(ability.trigger)) {
        observedClauses.add(`banish-in-challenge:${ability.trigger.timing}`);
      }
    }

    if (Array.isArray(ability.trigger.events)) {
      for (const event of ability.trigger.events) {
        if (typeof event === "string") {
          observedClauses.add(`${event}:${ability.trigger.timing}`);

          if (event === "banish" && hasInChallengeRestriction(ability.trigger)) {
            observedClauses.add(`banish-in-challenge:${ability.trigger.timing}`);
          }
        }
      }
    }
  }

  return expectedClauses.every((clause) => observedClauses.has(`${clause.event}:${clause.timing}`));
}

export function hasTemporalTriggerGate(
  text: string,
  abilities: AbilityDefinition[] | undefined,
): boolean {
  const normalizedText = normalizeCardTextContent(text);
  const supportsOnceDuringYourTurn = /\bOnce during your turn,\s+whenever\b/i.test(normalizedText);
  const requiresYourTurnGate = /\bDuring your turn,\s+whenever\b/i.test(normalizedText);
  const requiresOpponentTurnGate =
    /\bDuring (?:an opponent's turn|each opponent's turn|opponents' turns),\s+whenever\b/i.test(
      normalizedText,
    );

  if (!requiresYourTurnGate && !requiresOpponentTurnGate) {
    return true;
  }

  for (const ability of abilities ?? []) {
    let hasMatchingGate = false;

    visitRecursive(ability as unknown as RecursiveValue, (node) => {
      if (node.type === "during-turn") {
        const whose = node.whose;
        if (requiresYourTurnGate && whose === "your") {
          hasMatchingGate = true;
        }

        if (requiresOpponentTurnGate && whose === "opponent") {
          hasMatchingGate = true;
        }
      }

      if (requiresYourTurnGate && node.type === "your-turn") {
        hasMatchingGate = true;
      }

      if (requiresOpponentTurnGate && node.type === "opponent-turn") {
        hasMatchingGate = true;
      }

      if (supportsOnceDuringYourTurn && node.type === "once-per-turn") {
        hasMatchingGate = true;
      }
    });

    if (hasMatchingGate) {
      return true;
    }
  }

  return false;
}

export function supportsTriggerLikeText(
  text: string,
  signals: AbilitySignals,
  abilities: AbilityDefinition[] | undefined,
): boolean {
  if (
    isReplacementLikeText(text) &&
    (signals.hasTopLevelReplacement || signals.nestedTypes.includes("create-replacement-effect"))
  ) {
    return true;
  }

  if (!signals.hasTopLevelTriggered && !signals.hasFloatingTriggeredAction) {
    return false;
  }

  if (!hasTemporalTriggerGate(text, abilities)) {
    return false;
  }

  if (!hasExpectedTriggerSubjectParity(text, abilities)) {
    return false;
  }

  if (hasGrantedChallengeScopedBanishSupport(text, signals)) {
    return true;
  }

  const expectedEvents = inferExpectedTriggerEvents(text);
  if (expectedEvents.length === 0) {
    return true;
  }

  const observedEvents = new Set([
    ...signals.topLevelTriggerEvents,
    ...signals.nestedTriggerEvents,
  ]);
  const hasChallengeScopedBanishSupport =
    observedEvents.has("banish-in-challenge") || observedEvents.has("challenged-and-banished");

  if (requiresChallengeScopedBanishSupport(text) && !hasChallengeScopedBanishSupport) {
    return false;
  }

  if (requiresAllExpectedTriggerEvents(text)) {
    return (
      expectedEvents.every((event) => observedEvents.has(event)) &&
      hasExpectedTriggerClauseParity(text, abilities)
    );
  }
  return expectedEvents.some((event) => observedEvents.has(event));
}

export function supportsCostReductionText(signals: AbilitySignals): boolean {
  return signals.hasCostReductionSupport;
}

export function supportsKeywordGrantText(signals: AbilitySignals, keyword: string): boolean {
  if (signals.grantedKeywords.includes(keyword)) {
    return true;
  }

  if (!signals.hasKeywordGrantSupport) {
    return false;
  }

  if (signals.grantedKeywords.length === 0) {
    return true;
  }

  return signals.grantedKeywords.includes(keyword);
}
