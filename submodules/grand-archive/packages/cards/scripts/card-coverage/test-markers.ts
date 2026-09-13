export interface GrandArchiveTestMarkers {
  readonly cards: Set<string>;
  readonly abilities: Set<string>;
}

const DISABLED_TEST_DECLARATION =
  /\b(?:describe|it|test)(?:\.[A-Za-z][A-Za-z0-9_]*)*\.(?:only|runIf|skip|skipIf|todo)(?:\.[A-Za-z][A-Za-z0-9_]*)*\s*\(|\b(?:xdescribe|xit|xtest)\s*\(/u;
const RUNNABLE_TEST_DECLARATION =
  /\b(?:it|test)(?:\.[A-Za-z][A-Za-z0-9_]*)*\s*\(|\bprove[A-Z][A-Za-z0-9_]*\s*\(/u;

export function parseGrandArchiveTestMarkers(
  testPath: string,
  text: string,
): GrandArchiveTestMarkers {
  const markers = {
    cards: new Set(
      [...text.matchAll(/@covers-card\s+([A-Za-z0-9-]+)/gu)].map((match) => match[1]!),
    ),
    abilities: new Set(
      [...text.matchAll(/@covers\s+([A-Za-z0-9-]+-a\d+)/gu)].map((match) => match[1]!),
    ),
  };
  if (markers.cards.size === 0 && markers.abilities.size === 0) return markers;
  if (DISABLED_TEST_DECLARATION.test(text)) {
    throw new Error(`${testPath} claims coverage from a disabled or exclusive test declaration.`);
  }
  if (!RUNNABLE_TEST_DECLARATION.test(text)) {
    throw new Error(`${testPath} claims coverage without registering a runnable test.`);
  }
  return markers;
}
