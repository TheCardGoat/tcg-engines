import type { Action, TargetFilter, Zone } from "@tcg/op-types";
import {
  parseTarget,
  parseTargetWithoutPlayer,
  extractTargetFilters,
  traitAlternativesFilter,
} from "../target-parser.ts";
import { parseComparison, parseZoneList } from "../helpers.ts";

// ── Type aliases ──

type ReturnToHandAction = Extract<Action, { action: "returnToHand" }>;
type DelayedAction = Extract<Action, { action: "delayed" }>;
type ReturnToDeckAction = Extract<Action, { action: "returnToDeck" }>;

// ── ReturnToHand action parsing ──

export function parseAddThisCardToHandAction(
  text: string,
): Extract<Action, { action: "addThisCardToHand" }> | null {
  return /^add\s+this\s+card\s+to\s+your\s+hand\.?$/i.test(text.trim())
    ? { action: "addThisCardToHand" }
    : null;
}

/**
 * Parse a "return <target> to the owner's hand" action clause.
 */
export function parseReturnToHandAction(text: string): ReturnToHandAction | DelayedAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "return <target> to the owner's hand [at the end of this turn]" or "return <target> to your hand"
  const match =
    /^return\s+(.+?)\s+to\s+(?:the\s+owner[''\u2019]s|your)\s+hand(\s+at\s+the\s+end\s+of\s+this\s+turn)?$/i.exec(
      trimmed,
    );
  if (match) {
    const target = parseTarget(match[1]!) ?? parseTargetWithoutPlayer(match[1]!);
    if (target) {
      const returnAction: ReturnToHandAction = { action: "returnToHand", target };
      return match[2]
        ? { action: "delayed", timing: "endOfThisTurn", actions: [returnAction] }
        : returnAction;
    }
  }

  // "Your opponent returns N of their Characters to the owner's hand"
  const oppMatch =
    /^your\s+opponent\s+returns?\s+(.+?)\s+to\s+the\s+owner[''\u2019]s\s+hand$/i.exec(trimmed);
  if (oppMatch) {
    const target =
      parseTarget(oppMatch[1]!.replace(/\btheir\b/gi, "your opponent's")) ??
      parseTargetWithoutPlayer(oppMatch[1]!);
    if (target) {
      target.player = "opponent";
      target.chosenBy = "opponent";
      return { action: "returnToHand", target };
    }
  }

  return null;
}

// ── Add from trash to hand parser ──

/**
 * Parse "Add up to N [Name] from your trash to your hand" action clauses.
 */
export function parseAddFromTrashToHandAction(text: string): ReturnToHandAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  const m = /^add\s+(up to )?(\d+)\s+(.+?)\s+from\s+your\s+trash\s+to\s+your\s+hand$/i.exec(
    trimmed,
  );
  if (!m) return null;

  const upTo = !!m[1];
  const amount = parseInt(m[2]!, 10);
  const filterText = m[3]!;

  // Parse card name filter: [Name] or "Name"
  const nameMatch = /^\[([^\]]+)\]$|^[""\u201c]([^""\u201d]+)[""\u201d]$/i.exec(filterText);

  const filters: TargetFilter[] = [];
  if (nameMatch) {
    filters.push({ filter: "name", value: (nameMatch[1] ?? nameMatch[2])! });
  } else {
    // Strip and collect modifiers before parsing category
    let remaining = filterText;

    // Color prefix: "red Character card"
    const colorPre = /^(red|green|blue|purple|black|yellow)\s+/i.exec(remaining);
    if (colorPre) {
      filters.push({
        filter: "color",
        value: colorPre[1]!.toLowerCase() as
          | "red"
          | "green"
          | "blue"
          | "purple"
          | "black"
          | "yellow",
      });
      remaining = remaining.slice(colorPre[0].length);
    }

    // After color strip, check if remaining is just a name: "[Name]"
    const nameAfterColor = /^\[([^\]]+)\]$|^[""\u201c]([^""\u201d]+)[""\u201d]$/i.exec(remaining);
    if (nameAfterColor) {
      filters.push({ filter: "name", value: (nameAfterColor[1] ?? nameAfterColor[2])! });
    } else {
      // "{Trait1} or {Trait2} type Character card(s) (other than [Name]) (with ...)" — multi-trait
      const multiTraitCatMatch =
        /^(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+or\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+(Character|Event|Stage)\s*(?:cards?)?(?:\s+(.+))?$/i.exec(
          remaining,
        );
      if (multiTraitCatMatch) {
        const traitFilter = traitAlternativesFilter(
          [multiTraitCatMatch[1]!, multiTraitCatMatch[2]!],
          "includes",
        );
        if (traitFilter) filters.push(traitFilter);
        filters.push({
          filter: "cardCategory",
          value: multiTraitCatMatch[3]!.toLowerCase() as "character" | "event" | "stage",
        });
        if (multiTraitCatMatch[4]) {
          let restText = multiTraitCatMatch[4];
          const otherThan = /(?:^|\s+)other than \[([^\]]+)\]/i.exec(restText);
          if (otherThan) {
            filters.push({ filter: "excludeName", value: otherThan[1]! });
            restText =
              `${restText.slice(0, otherThan.index)}${restText.slice(otherThan.index + otherThan[0].length)}`.trim();
          }
          if (restText.trim()) {
            const { filters: subFilters } = extractTargetFilters(" " + restText);
            filters.push(...subFilters);
          }
        }
      } else // "{Trait} type Character/Event/Stage card(s) (other than [Name]) (with ...)" — trait + category
      {
        const traitCatMatch =
          /^(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+(Character|Event|Stage)\s+cards?(?:\s+(.+))?$/i.exec(
            remaining,
          );
        if (traitCatMatch) {
          filters.push({
            filter: "trait",
            value: traitCatMatch[1]!,
            match: "includes",
          });
          filters.push({
            filter: "cardCategory",
            value: traitCatMatch[2]!.toLowerCase() as "character" | "event" | "stage",
          });
          if (traitCatMatch[3]) {
            let restText = traitCatMatch[3];
            const otherThan = /(?:^|\s+)other than \[([^\]]+)\]/i.exec(restText);
            if (otherThan) {
              filters.push({ filter: "excludeName", value: otherThan[1]! });
              restText =
                `${restText.slice(0, otherThan.index)}${restText.slice(otherThan.index + otherThan[0].length)}`.trim();
            }
            if (restText.trim()) {
              const { filters: subFilters } = extractTargetFilters(" " + restText);
              filters.push(...subFilters);
            }
          }
        } else {
          const traitOnlyMatch =
            /^(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+card(?:s)?(?:\s+(.+))?$/i.exec(
              remaining,
            );
          if (traitOnlyMatch) {
            filters.push({
              filter: "trait",
              value: traitOnlyMatch[1]!,
              match: "includes",
            });
            if (traitOnlyMatch[2]) {
              let restText = traitOnlyMatch[2];
              const otherThan = /(?:^|\s+)other than \[([^\]]+)\]/i.exec(restText);
              if (otherThan) filters.push({ filter: "excludeName", value: otherThan[1]! });
              if (otherThan) {
                restText =
                  `${restText.slice(0, otherThan.index)}${restText.slice(otherThan.index + otherThan[0].length)}`.trim();
              }
              if (restText.trim()) {
                const { filters: subFilters } = extractTargetFilters(` ${restText}`);
                filters.push(...subFilters);
              }
            }
          } else {
            // "Character card(s) (other than [Name]) (with a cost of N or less)" — category only
            // Also handles "Event" / "Stage" without "card(s)" suffix
            const catMatch = /^(Character|Event|Stage)(?:\s+cards?)?(?:\s+(.+))?$/i.exec(remaining);
            if (catMatch) {
              const category = catMatch[1]!.toLowerCase() as "character" | "event" | "stage";
              filters.push({ filter: "cardCategory", value: category });
              if (catMatch[2]) {
                let restText = catMatch[2];
                // "other than [Name]"
                const otherThan = /(?:^|\s+)other than \[([^\]]+)\]/i.exec(restText);
                if (otherThan) {
                  filters.push({ filter: "excludeName", value: otherThan[1]! });
                  restText =
                    `${restText.slice(0, otherThan.index)}${restText.slice(otherThan.index + otherThan[0].length)}`.trim();
                }
                if (restText.trim()) {
                  const { filters: subFilters } = extractTargetFilters(" " + restText);
                  filters.push(...subFilters);
                }
              }
            } else {
              return null;
            }
          }
        }
      }
    }
  }

  return {
    action: "returnToHand",
    target: {
      player: "self",
      zones: ["trash"],
      count: { amount, ...(upTo && { upTo: true }) },
      ...(filters.length > 0 && { filters }),
    },
  };
}

// ── Compound return (hand/deck) pre-parser ──

/**
 * Parse compound "Return up to N ... and up to M ... to the owner's hand" patterns.
 * These share the destination and must be parsed before clause splitting.
 */
export function parseCompoundReturnToHand(text: string): Action[] | null {
  const match =
    /^return\s+(.+?)\s+and\s+(up to \d+\s+.+?)\s+to\s+the\s+owner[''\u2019]s\s+hand$/i.exec(
      text.trim().replace(/\.+$/, ""),
    );
  if (!match) return null;

  const target1 = parseTarget(match[1]!) ?? parseTargetWithoutPlayer(match[1]!);
  const target2 = parseTarget(match[2]!) ?? parseTargetWithoutPlayer(match[2]!);
  if (!target1 || !target2) return null;

  return [
    { action: "returnToHand", target: target1 },
    { action: "returnToHand", target: target2 },
  ];
}

// ── ReturnToDeck action parsing ──

/**
 * Parse a "place <target> at the (bottom|top) of the owner's deck" action clause.
 */
export function parseReturnToDeckAction(text: string): ReturnToDeckAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const inAnyOrder = /\s+in\s+any\s+order$/i.test(trimmed);

  const opponentPlacesTypedTrashMatch =
    /^your\s+opponent\s+places?\s+(\d+)\s+(Characters?|Events?|Stages?)\s+from\s+their\s+trash\s+at\s+the\s+(bottom|top)\s+of\s+their\s+deck(?:\s+in\s+any\s+order)?$/i.exec(
      trimmed,
    );
  if (opponentPlacesTypedTrashMatch) {
    const category = opponentPlacesTypedTrashMatch[2]!.replace(/s$/i, "").toLowerCase() as
      | "character"
      | "event"
      | "stage";
    return {
      action: "returnToDeck",
      target: {
        player: "opponent",
        zones: ["trash"],
        count: { amount: parseInt(opponentPlacesTypedTrashMatch[1]!, 10) },
        filters: [{ filter: "cardCategory", value: category }],
        chosenBy: "opponent",
      },
      position: opponentPlacesTypedTrashMatch[3]!.toLowerCase() as "bottom" | "top",
      ...(inAnyOrder && { order: "any" }),
    };
  }

  // "place <target> at the (bottom|top) of the owner's/your/their deck" or
  // "return <target> to the (bottom|top) of the owner's/your/their deck"
  const match =
    /^(?:place|return)\s+(.+?)\s+(?:at|to)\s+the\s+(bottom|top)\s+of\s+(?:the\s+owner[''\u2019]s|your|their|your\s+opponent[''\u2019]s)\s+deck(?:\s+in\s+any\s+order)?$/i.exec(
      trimmed,
    );
  if (!match) return null;

  let targetText = match[1]!;
  const pos = match[2]!.toLowerCase() as "top" | "bottom";

  // "[up to] N cards from your/opponent's trash" — returnToDeck from trash.
  const trashCardsMatch =
    /^(up\s+to\s+)?(\d+)\s+cards?\s+from\s+(your\s+opponent['’]s|your)\s+trash$/i.exec(targetText);
  if (trashCardsMatch) {
    const player = /^your\s+opponent/i.test(trashCardsMatch[3]!) ? "opponent" : "self";
    return {
      action: "returnToDeck",
      target: {
        player,
        zones: ["trash"],
        count: {
          amount: parseInt(trashCardsMatch[2]!, 10),
          ...(trashCardsMatch[1] && { upTo: true }),
        },
        ...(player === "opponent" && { chosenBy: "self" as const }),
      },
      position: pos,
    };
  }
  const opponentTypedTrashMatch =
    /^(\d+)\s+(Characters?|Events?|Stages?)\s+from\s+their\s+trash$/i.exec(targetText);
  if (opponentTypedTrashMatch) {
    const category = opponentTypedTrashMatch[2]!.replace(/s$/i, "").toLowerCase() as
      | "character"
      | "event"
      | "stage";
    return {
      action: "returnToDeck",
      target: {
        player: "opponent",
        zones: ["trash"],
        count: { amount: parseInt(opponentTypedTrashMatch[1]!, 10) },
        filters: [{ filter: "cardCategory", value: category }],
        chosenBy: "opponent",
      },
      position: pos,
      ...(inAnyOrder && { order: "any" }),
    };
  }
  // Handle "all of your Characters except this Character"
  const exceptSelfMatch =
    /^all\s+(?:of\s+)?your\s+(Characters?)\s+except\s+this\s+Character$/i.exec(targetText);
  if (exceptSelfMatch) {
    return {
      action: "returnToDeck",
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: "all" },
        filters: [{ filter: "excludeSelf" }],
      },
      position: pos,
      ...(inAnyOrder && { order: "any" }),
    };
  }

  // Handle "all Characters with a cost of N or less"
  const allMatch = /^all\s+(?:of\s+)?(your(?:\s+opponent's)?)\s+(.+)$/i.exec(targetText);
  if (allMatch) {
    const player = allMatch[1]!.toLowerCase().includes("opponent") ? "opponent" : "self";
    const rest = allMatch[2]!;
    const { zonesText, filters } = extractTargetFilters(rest);
    const zones = parseZoneList(zonesText);
    if (zones) {
      return {
        action: "returnToDeck",
        target: { player, zones, count: { amount: "all" }, ...(filters.length > 0 && { filters }) },
        position: pos,
      };
    }
  }

  // "all Characters with a cost of N or less" (no player prefix — affects both sides)
  const allNoPlayerMatch = /^all\s+(.+)$/i.exec(targetText);
  if (allNoPlayerMatch) {
    const desc = allNoPlayerMatch[1]!;
    const { zonesText, filters } = extractTargetFilters(desc);
    const zones = parseZoneList(zonesText);
    if (zones) {
      return {
        action: "returnToDeck",
        target: {
          player: "both",
          zones,
          count: { amount: "all" },
          ...(filters.length > 0 && { filters }),
        },
        position: pos,
      };
    }
  }

  // "the opponent's Character you battled with"
  const battledWith = /^the\s+opponent[''\u2019]s\s+Character\s+you\s+battled\s+with$/i.exec(
    targetText,
  );
  if (battledWith) {
    return {
      action: "returnToDeck",
      target: { player: "opponent", zones: ["character" as Zone], count: { amount: 1 } },
      position: pos,
      triggerEventTarget: true,
    };
  }

  const target = parseTarget(targetText) ?? parseTargetWithoutPlayer(targetText);
  if (!target) return null;

  return {
    action: "returnToDeck",
    target,
    position: pos,
  };
}

/**
 * Parse compound "Place up to N ... and up to M ... at the (top|bottom) of ..." patterns.
 */
export function parseCompoundReturnToDeck(text: string): Action[] | null {
  const match =
    /^place\s+(.+?)\s+and\s+(up to \d+\s+.+?)\s+at\s+the\s+(bottom|top)\s+of\s+(?:the\s+owner[''\u2019]s\s+deck|your\s+(?:opponent[''\u2019]s\s+)?(?:deck|Life\s+cards?))(?:\s+in\s+any\s+order)?$/i.exec(
      text.trim().replace(/\.+$/, ""),
    );
  if (!match) return null;

  const target1 = parseTarget(match[1]!) ?? parseTargetWithoutPlayer(match[1]!);
  const target2 = parseTarget(match[2]!) ?? parseTargetWithoutPlayer(match[2]!);
  if (!target1 || !target2) return null;

  const position = match[3]!.toLowerCase() as "top" | "bottom";
  return [
    { action: "returnToDeck", target: target1, position },
    { action: "returnToDeck", target: target2, position },
  ];
}

// ── PlaceFromHandToDeck action parsing ──

/**
 * Parse "place N cards from your hand at the bottom/top of your deck (in any order)" action clause.
 */
export function parsePlaceFromHandToDeckAction(text: string): ReturnToDeckAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // Self: "place N cards from your hand at the (top|bottom) of your deck"
  const selfMatch =
    /^place\s+(\d+)\s+cards?\s+from\s+your\s+hand\s+at\s+the\s+(bottom|top|top or bottom)\s+of\s+your\s+deck(?:\s+in\s+any\s+order)?$/i.exec(
      trimmed,
    );
  if (selfMatch) {
    const posText = selfMatch[2]!.toLowerCase();
    let position: "top" | "bottom" | "any";
    if (posText === "top or bottom") position = "any";
    else position = posText as "top" | "bottom";

    return {
      action: "returnToDeck",
      target: {
        player: "self",
        zones: ["hand"],
        count: { amount: parseInt(selfMatch[1]!, 10) },
      },
      position,
      ...(/in\s+any\s+order$/i.test(trimmed) && { order: "any" as const }),
    };
  }

  // Opponent: "your opponent (must )place(s) N card(s) from their hand at the (top|bottom) of their deck"
  const oppMatch =
    /^your\s+opponent\s+(?:must\s+)?places?\s+(\d+)\s+cards?\s+from\s+their\s+hand\s+at\s+the\s+(bottom|top|top or bottom)\s+of\s+their\s+deck(?:\s+in\s+any\s+order)?$/i.exec(
      trimmed,
    );
  if (oppMatch) {
    const posText = oppMatch[2]!.toLowerCase();
    let position: "top" | "bottom" | "any";
    if (posText === "top or bottom") position = "any";
    else position = posText as "top" | "bottom";

    return {
      action: "returnToDeck",
      target: {
        player: "opponent",
        zones: ["hand"],
        count: { amount: parseInt(oppMatch[1]!, 10) },
        chosenBy: "opponent",
      },
      position,
      ...(/in\s+any\s+order$/i.test(trimmed) && { order: "any" as const }),
    };
  }

  const opponentMovesYourHandMatch =
    /^your\s+opponent\s+places?\s+(\d+)\s+cards?\s+from\s+your\s+hand\s+at\s+the\s+(bottom|top)\s+of\s+their\s+deck$/i.exec(
      trimmed,
    );
  if (opponentMovesYourHandMatch) {
    return {
      action: "returnToDeck",
      target: {
        player: "self",
        zones: ["hand"],
        count: { amount: parseInt(opponentMovesYourHandMatch[1]!, 10) },
        chosenBy: "opponent",
      },
      position: opponentMovesYourHandMatch[2]!.toLowerCase() as "top" | "bottom",
      destinationPlayer: "opponent",
    };
  }

  return null;
}

// ── Choice actions involving return/movement ──

/**
 * Parse "Your opponent chooses N of their Character... and return to the owner's hand"
 */
export function parseOpponentChooseReturn(text: string): Action | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const m =
    /^your\s+opponent\s+chooses?\s+(\d+)\s+of\s+their\s+Characters?\s+(?:with\s+(.+?)\s+)?and\s+returns?\s+(?:it\s+|them\s+)?to\s+the\s+owner[''\u2019]s\s+hand$/i.exec(
      trimmed,
    );
  if (!m) return null;
  const amount = parseInt(m[1]!, 10);
  const filters: TargetFilter[] = [];
  if (m[2]) {
    const costMatch = /a\s+cost\s+of\s+(\d+)\s+or\s+(less|more)/i.exec(m[2]);
    if (costMatch) {
      filters.push({
        filter: "cost",
        comparison: parseComparison(costMatch[2]),
        value: parseInt(costMatch[1]!, 10),
      });
    }
  }
  return {
    action: "returnToHand",
    target: {
      player: "opponent",
      zones: ["character"],
      count: { amount },
      chosenBy: "opponent",
      ...(filters.length > 0 && { filters }),
    },
  };
}

/**
 * Parse "K.O. <target>, or return it to the owner's hand" as a choice action.
 */
export function parseKoOrReturnChoice(text: string): Action | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const m = /^K\.O\.\s+(.+?),?\s+or\s+return\s+it\s+to\s+the\s+owner[''\u2019]s\s+hand$/i.exec(
    trimmed,
  );
  if (!m) return null;
  const target = parseTarget(m[1]!) ?? parseTargetWithoutPlayer(m[1]!);
  if (!target) return null;
  return {
    action: "choice",
    options: [[{ action: "ko", target }], [{ action: "returnToHand", target }]],
  };
}

/**
 * Parse "Return <target> to the owner's hand or the bottom of their deck" as a choice action.
 */
export function parseReturnHandOrDeckChoice(text: string): Action | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const m =
    /^return\s+(.+?)\s+to\s+the\s+owner[''\u2019]s\s+hand\s+or\s+(?:place\s+it\s+at\s+)?the\s+(top|bottom)\s+of\s+their\s+deck$/i.exec(
      trimmed,
    );
  if (!m) return null;
  const target = parseTarget(m[1]!) ?? parseTargetWithoutPlayer(m[1]!);
  if (!target) return null;
  return {
    action: "choice",
    options: [
      [{ action: "returnToHand", target }],
      [{ action: "returnToDeck", target, position: m[2]!.toLowerCase() as "top" | "bottom" }],
    ],
  };
}
