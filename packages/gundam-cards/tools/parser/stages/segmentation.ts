/**
 * Splits card text into individual effect segments based on timing markers.
 */

// We use a regex to capture any bracketed header, then validate if it's a known timing/trigger.
// This handles 【When Paired･Lv.4】 by capturing the whole bracket.
const HEADER_REGEX = /【([^】]+)】/g;

const KNOWN_TRIGGERS = [
  "Deploy",
  "Attack",
  "Destroyed",
  "When Paired",
  "When Linked",
  "Burst",
  "Activate",
  "During Pair",
  "During Link",
  "Turn 1", // Sometimes used as restriction but looks like header
  "Main", // For Activate
  "Action", // For Activate
];

export interface EffectSegment {
  rawText: string;
  markers: string[];
}

export function splitIntoSegments(text: string): EffectSegment[] {
  const segments: EffectSegment[] = [];

  // Find all potential headers
  const matches = [...text.matchAll(HEADER_REGEX)];

  if (matches.length === 0) {
    return [{ rawText: text, markers: [] }];
  }

  const markerPositions: { marker: string; pos: number; end: number }[] = [];

  for (const match of matches) {
    const fullMarker = match[0]; // e.g. 【When Paired･Lv.4】
    const content = match[1]; // e.g. When Paired･Lv.4

    // Check if this header contains a known trigger keyword
    const isKnown = KNOWN_TRIGGERS.some((t) => content.includes(t));

    // If it's a known trigger, or looks like one, treat as segment starter.
    // Note: "Once per Turn" is also in brackets but is a restriction, usually INSIDE a segment.
    // But if it appears at the start of a segment (after a timing), we don't want to split on it?
    // Actually, usually structure is: 【Timing】【Restriction】Effect.
    // If we split on 【Timing】, the rest is the body.
    // If we split on 【Restriction】, we might break the body.

    // Strategy: Only split on "Primary" Timings.
    // "Once per Turn" is not a primary timing.
    // "Turn 1" is ambiguous.

    // Let's stick to strict list for SPLITTING, but use Regex to finding the position.

    if (isKnown) {
      markerPositions.push({
        marker: fullMarker,
        pos: match.index!,
        end: match.index! + fullMarker.length,
      });
    }
  }

  if (markerPositions.length === 0) {
    return [{ rawText: text, markers: [] }];
  }

  // Handle text before first marker (Constant effect)
  if (markerPositions[0].pos > 0) {
    segments.push({
      rawText: text.substring(0, markerPositions[0].pos).trim(),
      markers: [],
    });
  }

  for (let i = 0; i < markerPositions.length; i++) {
    const current = markerPositions[i];
    const next = markerPositions[i + 1];

    // Check if next marker is immediately adjacent (e.g. 【Activate】【Main】)
    // If so, merge them into one segment definition?
    // Or just treat them as multiple markers for the same segment?
    // My parser logic expects one "timing" mostly, but "Activate" and "Main" are split.
    // Current text-parser.ts handles `markers.join(" ")`.

    // We need to group adjacent markers.
    const currentMarkers = [current.marker];
    let contentStart = current.end;

    let j = i + 1;
    while (j < markerPositions.length) {
      const nextMarker = markerPositions[j];
      const between = text.substring(contentStart, nextMarker.pos).trim();

      // If next marker starts exactly where current ended (ignoring space)
      // OR if the separator is just a slash "/" (e.g. 【Main】/【Action】)
      if (between === "" || between === "/") {
        currentMarkers.push(nextMarker.marker);
        contentStart = nextMarker.end;
        j++;
      } else {
        break;
      }
    }

    // Skip the merged markers in outer loop
    i = j - 1;

    // Find end of content (start of next non-adjacent marker)
    const nextSegmentStart =
      i + 1 < markerPositions.length ? markerPositions[i + 1].pos : text.length;

    const content = text.substring(contentStart, nextSegmentStart).trim();

    segments.push({
      rawText: content,
      markers: currentMarkers,
    });
  }

  return segments;
}
