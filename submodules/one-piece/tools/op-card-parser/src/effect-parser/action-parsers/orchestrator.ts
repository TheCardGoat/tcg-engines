import type { Action, Comparison, TargetFilter, Zone } from "@tcg/op-types";
import type { ParseActionsResult } from "../types.ts";
import { parseTarget, parseModifyPowerTarget, extractTargetFilters } from "../target-parser.ts";
import { parseComparison } from "../helpers.ts";
import { parseConditionText } from "../condition-parser/index.ts";

import {
  parseDrawAction,
  parseBothPlayersTrashUntilHandSize,
  parseTrashFromHandAction,
  parseOpponentChosenTrashAction,
  parseChooseRevealAction,
  parseRevealEntireHandAction,
  parseDrawToAction,
  parseDrawWithConditionAction,
  parseRedrawHandAction,
} from "./draw-hand.ts";
import {
  parseKoAction,
  parseCompoundKoAction,
  parseRestAction,
  parseCompoundRestActions,
  parseCompoundSetActiveActions,
  parseSetActiveAction,
  parseFreezeAction,
  parseTrashFromFieldAction,
  parseTrashThisCardAction,
  parsePlayAction,
  parseCompoundPlayAction,
  parsePlayDescription,
} from "./field.ts";
import {
  parseReturnToHandAction,
  parseAddThisCardToHandAction,
  parseAddFromTrashToHandAction,
  parseCompoundReturnToHand,
  parseReturnToDeckAction,
  parseCompoundReturnToDeck,
  parsePlaceFromHandToDeckAction,
  parseOpponentChooseReturn,
  parseKoOrReturnChoice,
  parseReturnHandOrDeckChoice,
} from "./movement.ts";
import {
  parseAddDonAction,
  parseGiveDonAction,
  parseOpponentReturnDonAction,
  parseRedistributeDonAction,
} from "./don.ts";
import {
  parseAddToLifeAction,
  parseTurnLifeFaceUpAction,
  parseRemoveFromLifeAction,
  parsePlaceCharacterToLifeAction,
  parseLifeCardLookAction,
} from "./life.ts";
import {
  parseEachModifyPowerActions,
  parseModifyPowerAction,
  parseGroupedPowerAndCostActions,
  parseSetPowerAction,
  parseModifyCostAction,
  parseCostReductionAction,
  parseGrantKeywordChoiceAction,
  parseGrantKeywordAction,
  parseCompoundNamedTraitPower,
  parseCompoundKeywordPower,
  parseCompoundKeywordCost,
  parseCompoundPowerCost,
} from "./stat-keyword.ts";
import {
  parseSearchAction,
  parseRearrangeDeckAction,
  parseShuffleDeckAction,
  parseRevealFromDeckAction,
  parseRevealFromDeckToHandAction,
  parseTrashFromDeckAction,
} from "./search-deck.ts";
import {
  parseCannotAttackAction,
  parseCannotDrawAction,
  parseCannotSetDonActiveAction,
  parseCannotAttackTargetsAction,
  parseCannotBeKodAction,
  parseCannotBePlayedByEffectsAction,
  parseCannotBeRemovedAction,
  parseCannotBeRestedAction,
  parseCannotActivateAction,
  parseCanAttackActiveAction,
  parsePlayRestrictionAction,
  parseAttackRestrictionAction,
  parseNegateEffectsAction,
} from "./restrictions.ts";
import {
  parseSelectAction,
  parseActivateEffectAction,
  parseActivateEffectInZoneAction,
  parseOpponentAction,
  parseDealDamageAction,
  parseExtraTurnAction,
} from "./complex.ts";
import { parseFullDuration } from "./helpers.ts";

export function parseActions(rawActionText: string): ParseActionsResult {
  // Strip trailing effect/keyword brackets that don't belong to this action clause.
  // - ". [Trigger] ..." belongs to a separate segment
  // - ". [Blocker]" etc. are keyword remnants after parenthetical stripping
  // - "(This card can attack ...)" etc. are keyword reminder parentheticals
  let text = rawActionText
    .trim()
    .replace(/\.\s*\[Trigger\].*$/i, "")
    .replace(/\.\s*\[(?:Blocker|Rush|Rush:\s*Character|Double Attack|Banish|Unblockable)\]$/i, "")
    .replace(
      /\.?\s*\((?:This card can(?:not)?|This card deals|When this card deals|After your opponent declares|When dealing damage)\b[^)]*\)\.?$/i,
      "",
    )
    .trim();
  if (!text) return { parsed: [], unparsed: "" };

  const delayedSuffix = /^(?:(.+?)\.\s*Then,\s*)?at the end of this turn,\s*(.+)$/is.exec(text);
  if (delayedSuffix) {
    const first = delayedSuffix[1] ? parseActions(delayedSuffix[1]) : { parsed: [], unparsed: "" };
    const following = parseActions(delayedSuffix[2]!);
    if (!first.unparsed && !following.unparsed && following.parsed.length)
      return {
        parsed: [
          ...first.parsed,
          { action: "delayed", timing: "endOfThisTurn", actions: following.parsed },
        ],
        unparsed: "",
      };
  }
  const selectedRestedKo =
    /^Select up to (\d+) of your opponent's rested Characters?\. If the chosen Character has a cost equal to the number of DON!! cards given to it, K\.O\. it\.?$/i.exec(
      text,
    );
  if (selectedRestedKo)
    return {
      parsed: [
        {
          action: "ko",
          target: {
            player: "opponent",
            zones: ["character"],
            count: { amount: Number(selectedRestedKo[1]), upTo: true },
            filters: [{ filter: "state", value: "rested" }],
          },
          selectedTargetFilters: [
            { filter: "dynamicCost", comparison: "eq", source: "candidateAttachedDon" },
          ],
        },
      ],
      unparsed: "",
    };

  const optionalHandTrash =
    /^(?:(.+?)\.\s*Then,\s*)?you may trash (\d+) cards? from your hand\.\s*If you do,\s*(.+)$/is.exec(
      text,
    );
  if (optionalHandTrash) {
    const leading = optionalHandTrash[1]
      ? parseActions(optionalHandTrash[1])
      : { parsed: [], unparsed: "" };
    const following = parseActions(optionalHandTrash[3]!);
    if (!leading.unparsed && !following.unparsed && following.parsed.length)
      return {
        parsed: [
          ...leading.parsed,
          {
            action: "optional",
            actions: [
              {
                action: "trashFromHand",
                player: "self",
                amount: Number(optionalHandTrash[2]),
                thenRequiresFullAmount: true,
                thenActions: following.parsed,
              },
            ],
          },
        ],
        unparsed: "",
      };
  }

  const opponentActiveDonChoice =
    /^Your opponent may return (\d+) of their active DON!! cards? to their DON!! deck\.\s*If they do not,\s*(.+)$/is.exec(
      text,
    );
  if (opponentActiveDonChoice) {
    const following = parseActions(opponentActiveDonChoice[2]!);
    const amount = Number(opponentActiveDonChoice[1]);
    if (!following.unparsed && following.parsed.length)
      return {
        parsed: [
          {
            action: "conditional",
            predicate: {
              condition: "activeDonCount",
              player: "opponent",
              comparison: "gte",
              value: amount,
            },
            whenTrue: [
              {
                action: "choice",
                player: "opponent",
                options: [
                  [{ action: "returnDon", player: "opponent", amount, donState: "active" }],
                  following.parsed,
                ],
              },
            ],
            whenFalse: following.parsed,
          },
        ],
        unparsed: "",
      };
  }

  const optionalDonRest =
    /^(.+?)\.\s*Then,\s*you may rest (\d+) of your DON!! cards?\.\s*If you do,\s*(.+)$/is.exec(
      text,
    );
  if (optionalDonRest) {
    const leading = parseActions(optionalDonRest[1]!);
    const following = parseActions(optionalDonRest[3]!);
    if (
      !leading.unparsed &&
      !following.unparsed &&
      leading.parsed.length &&
      following.parsed.length
    ) {
      const amount = Number(optionalDonRest[2]);
      return {
        parsed: [
          ...leading.parsed,
          {
            action: "optional",
            condition: { condition: "activeDonCount", comparison: "gte", value: amount },
            actions: [
              {
                action: "rest",
                target: {
                  player: "self",
                  zones: ["costArea"],
                  count: { amount },
                  filters: [{ filter: "state", value: "active" }],
                },
              },
              ...following.parsed,
            ],
          },
        ],
        unparsed: "",
      };
    }
  }

  if (
    /^Your\s+face-up\s+Life\s+cards\s+are\s+placed\s+at\s+the\s+bottom\s+of\s+your\s+deck\s+instead\s+of\s+being\s+added\s+to\s+your\s+hand,\s+according\s+to\s+the\s+rules\.?$/i.test(
      text,
    )
  ) {
    return {
      parsed: [
        {
          action: "lifeToHandReplacement",
          player: "self",
          faceUp: true,
          destination: "deck",
          position: "bottom",
        },
      ],
      unparsed: "",
    };
  }
  if (/^Trash\s+all\s+your\s+face-up\s+Life\s+cards\.?$/i.test(text)) {
    return {
      parsed: [
        {
          action: "trashFromField",
          target: {
            player: "self",
            zones: ["life"],
            count: { amount: "all" },
            filters: [{ filter: "faceUp", value: true }],
          },
        },
      ],
      unparsed: "",
    };
  }
  const namedEach =
    /^Play\s+up\s+to\s+1\s+each\s+of\s+(\[[^\]]+\](?:(?:,\s*(?:and\s+)?|\s+and\s+)\[[^\]]+\])+)\s+with\s+a\s+cost\s+of\s+(\d+)\s+from\s+your\s+hand\.?$/i.exec(
      text,
    );
  if (namedEach) {
    const names = [...namedEach[1]!.matchAll(/\[([^\]]+)\]/g)].map((m) => m[1]!);
    return {
      parsed: [
        {
          action: "playGrouped",
          source: { player: "self", zone: "hand" },
          groups: names.map((value) => ({
            count: { amount: 1, upTo: true },
            filters: [
              { filter: "name", value },
              { filter: "cost", comparison: "eq", value: Number(namedEach[2]) },
            ],
          })),
          playStates: {
            single: "active",
            multiple: ["active", ...names.slice(1).map(() => "active" as const)],
            byGroup: true,
          },
        },
      ],
      unparsed: "",
    };
  }

  // Preserve the decision owner and each complete option before clause splitting.
  const opponentChoice = /^your\s+opponent\s+chooses\s+one:\s*[-•]\s*([\s\S]+)$/i.exec(text);
  if (opponentChoice) {
    const options = opponentChoice[1]!
      .split(/(?:\s+|(?<=\.))[-•]\s+/)
      .map((item) => parseActions(item));
    if (options.length > 1 && options.every((option) => !option.unparsed && option.parsed.length)) {
      return {
        parsed: [
          { action: "choice", player: "opponent", options: options.map((option) => option.parsed) },
        ],
        unparsed: "",
      };
    }
  }
  const opponentHandTrash = parseOpponentChosenTrashAction(text);
  if (opponentHandTrash) return { parsed: [opponentHandTrash], unparsed: "" };

  // The Life look's internal "and place" belongs to the same private action.
  const lifeLookThen = /^(look\s+at\s+.+?Life\s+cards?)\.\s*Then,\s*(.+)$/is.exec(text);
  if (lifeLookThen) {
    const look = parseLifeCardLookAction(lifeLookThen[1]!);
    const following = parseActions(lifeLookThen[2]!);
    if (look && !following.unparsed && following.parsed.length) {
      return { parsed: [look, ...following.parsed], unparsed: "" };
    }
  }
  const handBottomRedraw =
    /^(?:you may )?place all cards in your hand at the bottom of your deck in any order\. If you do, draw cards equal to the number you placed at the bottom of your deck\.?$/i.test(
      text,
    );
  if (handBottomRedraw)
    return {
      parsed: [
        {
          action: "returnToDeck",
          target: { player: "self", zones: ["hand"], count: { amount: "all" } },
          position: "bottom",
          order: "any",
        },
        { action: "draw", player: "self", amount: 0, amountFromPreviousActionTargets: true },
      ],
      unparsed: "",
    };
  const plainTrashForPower =
    /^(?:you may )?trash any number of cards from your hand\. (.+?) gains? \+(\d+) power (during this (?:turn|battle)) for every card trashed\.?$/i.exec(
      text,
    );
  if (plainTrashForPower) {
    const target = parseModifyPowerTarget(plainTrashForPower[1]!);
    if (target)
      return {
        parsed: [
          { action: "trashFromHand", player: "self", amount: "all", upTo: true },
          {
            action: "modifyPower",
            target,
            value: 0,
            valuePerPreviousActionTarget: Number(plainTrashForPower[2]),
            duration: parseFullDuration(plainTrashForPower[3]!),
          },
        ],
        unparsed: "",
      };
  }
  const returnForPower =
    /^(?:you may )?return any number of Characters on your field to the owner['’]s hand\. (.+?) gains? \+(\d+) power (during this (?:turn|battle)) for every returned Character\.?$/i.exec(
      text,
    );
  if (returnForPower) {
    const target = parseModifyPowerTarget(returnForPower[1]!);
    if (target)
      return {
        parsed: [
          {
            action: "returnToHand",
            target: { player: "self", zones: ["character"], count: { amount: "all", upTo: true } },
          },
          {
            action: "modifyPower",
            target,
            value: 0,
            valuePerPreviousActionTarget: Number(returnForPower[2]),
            duration: parseFullDuration(returnForPower[3]!),
          },
        ],
        unparsed: "",
      };
  }
  if (/^(?:you may )?add this Character card to your hand\.?$/i.test(text))
    return {
      parsed: [
        {
          action: "returnToHand",
          target: { player: "self", zones: ["trash"], count: { amount: 1 }, self: true },
        },
      ],
      unparsed: "",
    };
  const selfAndLeaderPower =
    /^This Character and up to (\d+) of your Leader gain \+(\d+) power (during this (?:turn|battle))\.?$/i.exec(
      text,
    );
  if (selfAndLeaderPower)
    return {
      parsed: [
        {
          action: "modifyPower",
          target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
          value: Number(selfAndLeaderPower[2]),
          duration: parseFullDuration(selfAndLeaderPower[3]!),
        },
        {
          action: "modifyPower",
          target: {
            player: "self",
            zones: ["leader"],
            count: { amount: Number(selfAndLeaderPower[1]), upTo: true },
          },
          value: Number(selfAndLeaderPower[2]),
          duration: parseFullDuration(selfAndLeaderPower[3]!),
        },
      ],
      unparsed: "",
    };
  const drawThenLookOrProtection = /^(draw\s+\d+\s+cards?)(?:,\s*|\s+and\s+)(.+)$/is.exec(text);
  if (drawThenLookOrProtection) {
    const draw = parseDrawAction(drawThenLookOrProtection[1]!);
    const following =
      parseLifeCardLookAction(drawThenLookOrProtection[2]!) ??
      parseCannotBeKodAction(drawThenLookOrProtection[2]!) ??
      parseSetPowerAction(drawThenLookOrProtection[2]!);
    if (draw && following) return { parsed: [draw, following], unparsed: "" };
  }

  // A postfix draw condition also gates its connected Then clause (OP05-047).
  // Evaluate once before drawing, since the draw can change the hand count.
  const conditionedDrawThen = /^(draw\s+\d+\s+cards?\s+if\s+.+?)\.\s*Then,\s*(.+)$/is.exec(text);
  if (conditionedDrawThen) {
    const draw = parseDrawWithConditionAction(conditionedDrawThen[1]!);
    const following = parseActions(conditionedDrawThen[2]!);
    if (draw?.condition && !following.unparsed && following.parsed.length > 0) {
      const { condition, ...unconditionalDraw } = draw;
      return {
        parsed: [
          {
            action: "conditional",
            predicate: condition,
            whenTrue: [unconditionalDraw, ...following.parsed],
          },
        ],
        unparsed: "",
      };
    }
  }

  const groupedActionThen = /^(.*?\band\s+up\s+to\s+\d+.*?)\.\s*Then,\s*(.+)$/is.exec(text);
  if (groupedActionThen && /^(?:K\.O\.|place|return|play)\s/i.test(text)) {
    const leading = parseActions(groupedActionThen[1]!);
    const first = leading.parsed[0];
    if (
      !leading.unparsed &&
      leading.parsed.length === 1 &&
      first &&
      ("targetGroups" in first || first.action === "playGrouped")
    ) {
      const trailing = parseActions(groupedActionThen[2]!);
      if (!trailing.unparsed && trailing.parsed.length > 0) {
        return { parsed: [...leading.parsed, ...trailing.parsed], unparsed: "" };
      }
    }
  }

  const lookAtLifeThenAddThisMatch =
    /^(look\s+at\s+up\s+to\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+or\s+your\s+opponent['’]s\s+Life\s+cards,?\s+and\s+place\s+it\s+at\s+the\s+top\s+or\s+bottom\s+of\s+the\s+Life\s+cards)\.\s*Then,\s+add\s+this\s+card\s+to\s+your\s+hand\.?$/i.exec(
      text,
    );
  if (lookAtLifeThenAddThisMatch) {
    const lookAtLife = parseLifeCardLookAction(lookAtLifeThenAddThisMatch[1]!);
    if (lookAtLife) {
      return {
        parsed: [lookAtLife, { action: "addThisCardToHand" }],
        unparsed: "",
      };
    }
  }

  const opponentNextMainMatch =
    /^(.+?)\s+at\s+the\s+start\s+of\s+their\s+next\s+Main\s+Phase\.?$/is.exec(text);
  if (opponentNextMainMatch) {
    const nested = parseActions(opponentNextMainMatch[1]!);
    if (nested.unparsed === "" && nested.parsed.length > 0) {
      return {
        parsed: [
          {
            action: "delayed",
            timing: "startOfOpponentNextMainPhase",
            actions: nested.parsed,
          },
        ],
        unparsed: "",
      };
    }
  }

  const playedCharacterDelayedDeckMatch =
    /^(.+?)\.\s*Then,\s*place\s+the\s+1\s+Character\s+played\s+by\s+this\s+effect\s+at\s+the\s+(bottom|top)\s+of\s+the\s+owner[''\u2019]s\s+deck\s+at\s+the\s+end\s+of\s+this\s+turn\.?$/is.exec(
      text,
    );
  if (playedCharacterDelayedDeckMatch) {
    const leading = parseActions(playedCharacterDelayedDeckMatch[1]!);
    if (leading.unparsed === "" && leading.parsed.length > 0) {
      return {
        parsed: [
          ...leading.parsed,
          {
            action: "delayed",
            timing: "endOfThisTurn",
            actions: [
              {
                action: "returnToDeck",
                target: {
                  player: "self",
                  zones: ["character"],
                  count: { amount: 1 },
                },
                position: playedCharacterDelayedDeckMatch[2]!.toLowerCase() as "bottom" | "top",
                previousActionTargets: true,
              },
            ],
          },
        ],
        unparsed: "",
      };
    }
  }

  // Preserve a Life choice when the may clause is nested after another action.
  const optionalLifeRemoval = /^you may\s+/i.test(text)
    ? parseRemoveFromLifeAction(text.replace(/^you may\s+/i, ""))
    : null;
  if (
    optionalLifeRemoval?.action === "removeFromLife" &&
    !("untilRemaining" in optionalLifeRemoval.count)
  ) {
    return {
      parsed: [{ ...optionalLifeRemoval, count: { ...optionalLifeRemoval.count, upTo: true } }],
      unparsed: "",
    };
  }

  // A paid ability can independently permit, rather than require, replaying
  // its own card. Preserve that decision after the activation cost is paid.
  if (
    /^you may play this (?:Character )?card from your (?:hand|trash|deck)(?: rested)?\.?$/i.test(
      text,
    )
  ) {
    const optionalPlay = parsePlayAction(text.replace(/^you may\s+/i, ""));
    if (optionalPlay?.action === "play") {
      return {
        parsed: [{ ...optionalPlay, count: { ...optionalPlay.count, upTo: true } }],
        unparsed: "",
      };
    }
  }

  const optionalPrefix = /^you\s+may\s+/i.test(text);

  // Strip "you may" prefix (for replacement effects and optional actions)
  text = text
    .replace(/^you may\s+/i, "")
    .replace(/\s+instead(?:\s+of\s+that\s+Character\s+being\s+K\.O\.\u2019?'?d)?\.?$/i, "")
    .trim();

  // Strip "N :" DON!! cost prefix that leaked through from segment parsing
  text = text.replace(/^\d+\s*:\s*/i, "").trim();

  // Strip leaked cost text before colon: "turn N card(s) from Life face-down: action" or "rest this Character and turn...: action"
  const leakedCostMatch =
    /^(?:(?:rest\s+this\s+(?:Character|Leader|Stage)\s+and\s+)?turn\s+\d+\s+cards?\s+from\s+the\s+top\s+of\s+your\s+Life\s+cards?\s+face-(?:up|down)|place\s+\d+\s+cards?\s+from\s+your\s+trash\s+at\s+the\s+bottom\s+of\s+your\s+deck(?:\s+in\s+any\s+order)?):\s*/i.exec(
      text,
    );
  if (leakedCostMatch) {
    text = text.slice(leakedCostMatch[0].length).trim();
  }

  // Strip leading comma/space from malformed card data
  text = text.replace(/^[,\s]+/, "").trim();

  // Fix stray "and" before power: "gains and +10000" → "gains +10000"
  text = text.replace(/\bgains?\s+and\s+([+-]?\d+)/i, "gains $1");

  // Fix common card data typos
  text = text.replace(/\b(\d+)o\b/g, "$1"); // "1o" → "1"
  text = text.replace(/\bSAtage\b/g, "Stage"); // "SAtage" → "Stage"
  text = text.replace(/\bK\.O\s+(?=up\s+to)/gi, "K.O. "); // "K.O up to" → "K.O. up to"
  text = text.replace(/\bas the (top|bottom)/gi, "at the $1"); // "as the top" → "at the top"

  // Fix unclosed brackets: "[Name" without "]"
  text = text.replace(/\[([^\]]+?)(?=\s+from\s)/g, "[$1]");

  const guessTopDeckCostMatch =
    /^choose\s+a\s+cost\s+and\s+reveal\s+\d+\s+cards?\s+from\s+the\s+top\s+of\s+your\s+opponent[''\u2019]s\s+deck\.\s*If\s+the\s+revealed\s+card\s+has\s+the\s+chosen\s+cost,\s*(.+)$/i.exec(
      text,
    );
  if (guessTopDeckCostMatch) {
    const onMatch = parseActions(guessTopDeckCostMatch[1]!);
    return {
      parsed: [
        {
          action: "guessTopDeckCost",
          player: "opponent",
          onMatch: onMatch.parsed,
        },
      ],
      unparsed: onMatch.unparsed,
    };
  }

  text = text
    .trim()
    .replace(/[.,]+$/, "")
    .trim();

  if (
    /^this\s+Character\s+cannot\s+be\s+K\.O\.[’']?d\s+or\s+rested\s+by\s+your\s+opponent['’]s\s+effects$/i.test(
      text,
    )
  ) {
    return {
      parsed: [
        {
          action: "cannotBeKod",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
            self: true,
          },
          duration: "permanent",
          restriction: "byEffect",
          byPlayer: "opponent",
        },
        {
          action: "cannotBeRested",
          target: {
            player: "self",
            zones: ["character"],
            count: { amount: 1 },
            self: true,
          },
          duration: "permanent",
          byPlayer: "opponent",
        },
      ],
      unparsed: "",
    };
  }

  const drawThenTrashMatch =
    /^draw\s+(\d+)\s+cards?\s+and\s+trash\s+(\d+)\s+cards?\s+from\s+your\s+hand$/i.exec(text);
  if (drawThenTrashMatch) {
    return {
      parsed: [
        { action: "draw", player: "self", amount: parseInt(drawThenTrashMatch[1]!, 10) },
        {
          action: "trashFromHand",
          player: "self",
          amount: parseInt(drawThenTrashMatch[2]!, 10),
        },
      ],
      unparsed: "",
    };
  }

  const revealThenGroupedPlayMatch =
    /^reveal\s+up\s+to\s+(\d+)\s+(.+?)\s+from\s+your\s+hand\.\s*Play\s+1\s+of\s+the\s+revealed\s+cards\s+and\s+play\s+the\s+other\s+card\s+rested\s+if\s+it\s+has\s+a\s+cost\s+of\s+(\d+)\s+or\s+less$/i.exec(
      text,
    );
  if (revealThenGroupedPlayMatch) {
    const description = revealThenGroupedPlayMatch[2]!;
    const filters: TargetFilter[] = [];
    const traitMatch = /(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type/i.exec(description);
    const categoryMatch = /\b(Character|Event|Stage)\s+cards?\b/i.exec(description);
    const costMatch = /with\s+a\s+cost\s+of\s+(\d+)\s+or\s+(less|more)/i.exec(description);
    const excludeNameMatch = /other\s+than\s+\[([^\]]+)\]/i.exec(description);
    if (excludeNameMatch) filters.push({ filter: "excludeName", value: excludeNameMatch[1]! });
    if (traitMatch) {
      filters.push({ filter: "trait", value: traitMatch[1]!, match: "exact" });
    }
    if (categoryMatch) {
      filters.push({
        filter: "cardCategory",
        value: categoryMatch[1]!.toLowerCase() as "character" | "event" | "stage",
      });
    }
    if (costMatch) {
      filters.push({
        filter: "cost",
        comparison: costMatch[2]!.toLowerCase() === "less" ? "lte" : "gte",
        value: parseInt(costMatch[1]!, 10),
      });
    }

    return {
      parsed: [
        {
          action: "revealFromHand",
          player: "self",
          amount: parseInt(revealThenGroupedPlayMatch[1]!, 10),
          upTo: true,
          filters,
          thenActions: [
            {
              action: "playGrouped",
              source: { player: "self", zone: "hand" },
              groups: [
                { count: { amount: 1, upTo: true } },
                {
                  count: { amount: 1, upTo: true },
                  filters: [
                    {
                      filter: "cost",
                      comparison: "lte",
                      value: parseInt(revealThenGroupedPlayMatch[3]!, 10),
                    },
                  ],
                },
              ],
              playStates: { single: "active", multiple: ["active", "rested"] },
              previousActionTargets: true,
            },
          ],
        },
      ],
      unparsed: "",
    };
  }

  const revealThenAddSameCardToLifeMatch =
    /^reveal\s+up\s+to\s+(\d+)\s+(.+?)\s+from\s+your\s+hand\s+and\s+add\s+(?:it|them)\s+to\s+the\s+(top|bottom)\s+of\s+your\s+Life\s+cards?\s+face-(up|down)(?:\.\s*Then,\s*(.+))?\.?$/i.exec(
      text,
    );
  if (revealThenAddSameCardToLifeMatch) {
    const amount = parseInt(revealThenAddSameCardToLifeMatch[1]!, 10);
    const description = revealThenAddSameCardToLifeMatch[2]!;
    const { filters } = extractTargetFilters(description);
    const traitMatch =
      /(?:[[{"\u201c])([^\]}"\u201d]+)(?:[\]}"\u201d])\s+type(?:\s+(?:Character|Event|Stage))?/i.exec(
        description,
      );
    if (traitMatch && !filters.some((filter) => filter.filter === "trait")) {
      filters.unshift({ filter: "trait", value: traitMatch[1]!, match: "exact" });
    }
    if (/\bCharacter\s+card\b/i.test(description)) {
      filters.push({ filter: "cardCategory", value: "character" });
    } else if (/\bEvent\s+card\b/i.test(description)) {
      filters.push({ filter: "cardCategory", value: "event" });
    } else if (/\bStage\s+card\b/i.test(description)) {
      filters.push({ filter: "cardCategory", value: "stage" });
    }
    const trailing = revealThenAddSameCardToLifeMatch[5]
      ? parseActions(revealThenAddSameCardToLifeMatch[5])
      : { parsed: [], unparsed: "" };
    if (
      trailing.unparsed === "" &&
      (!revealThenAddSameCardToLifeMatch[5] || trailing.parsed.length > 0)
    ) {
      const target = {
        player: "self" as const,
        zones: ["hand" as const],
        count: { amount, upTo: true },
        ...(filters.length > 0 && { filters }),
      };
      return {
        parsed: [
          {
            action: "revealFromHand",
            player: "self",
            amount,
            upTo: true,
            ...(filters.length > 0 && { filters }),
            thenActions: [
              {
                action: "addToLife",
                target,
                position: revealThenAddSameCardToLifeMatch[3]!.toLowerCase() as "top" | "bottom",
                ...(revealThenAddSameCardToLifeMatch[4]!.toLowerCase() === "up" && {
                  faceUp: true,
                }),
                previousActionTargets: true,
              },
            ],
          },
          ...trailing.parsed,
        ],
        unparsed: "",
      };
    }
  }

  const thenMatch = /^(.+?)\.\s*Then,\s*(.+)$/is.exec(text);
  if (
    thenMatch &&
    /^negate\s+the\s+effects?/i.test(thenMatch[1]!) &&
    /that\s+Character\s+cannot\s+attack/i.test(thenMatch[2]!)
  ) {
    const leading = parseActions(thenMatch[1]!);
    const followUp = parseActions(thenMatch[2]!);
    if (
      leading.unparsed === "" &&
      leading.parsed.length > 0 &&
      followUp.unparsed === "" &&
      followUp.parsed.length > 0
    ) {
      return { parsed: [...leading.parsed, ...followUp.parsed], unparsed: "" };
    }
  }

  const playIfDoMatch = /^(.+?)\.\s*If\s+you\s+do,\s*(.+)$/is.exec(text);
  if (playIfDoMatch) {
    const leading = parseActions(playIfDoMatch[1]!);
    const followUp = parseActions(playIfDoMatch[2]!);
    if (
      leading.unparsed === "" &&
      leading.parsed.length === 1 &&
      leading.parsed[0]?.action === "play" &&
      followUp.unparsed === "" &&
      followUp.parsed.length > 0
    ) {
      return {
        parsed: [{ ...leading.parsed[0], thenActions: followUp.parsed }],
        unparsed: "",
      };
    }
  }

  const negateThenCannotAttackMatch =
    /^(negate\s+the\s+effects?\s+of\s+up\s+to\s+\d+\s+of\s+your\s+opponent[''\u2019]s\s+Characters?)(?:\s+and\s+that\s+Character\s+cannot\s+attack\s+(until\s+.+))$/i.exec(
      text,
    );
  if (negateThenCannotAttackMatch) {
    const negate = parseNegateEffectsAction(negateThenCannotAttackMatch[1]!);
    if (negate && !Array.isArray(negate)) {
      return {
        parsed: [
          { ...negate, duration: parseFullDuration(negateThenCannotAttackMatch[2]!) },
          {
            action: "cannotAttack",
            target: negate.target,
            duration: parseFullDuration(negateThenCannotAttackMatch[2]!),
            previousActionTargets: true,
          },
        ],
        unparsed: "",
      };
    }
  }

  // Strip "Add up to N DON!! card from your DON!! deck and rest/set it, " prefix — addDon followed by comma/semicolon-separated action
  const addDonPrefixMatch =
    /^ad{1,2}\s+(?:up\s+to\s+)?(\d+)\s+DON!!\s+cards?\s+from\s+your\s+DON!!\s+deck\s+and\s+(?:rest\s+(?:it|them)|set\s+(?:it|them)\s+as\s+active)[,;]\s*/i.exec(
      text,
    );
  const addDonPreAction: Action[] = [];
  if (addDonPrefixMatch) {
    const upTo = /up\s+to/i.test(addDonPrefixMatch[0]);
    const amount = parseInt(addDonPrefixMatch[1]!, 10);
    const state: "active" | "rested" = /rest/i.test(addDonPrefixMatch[0]) ? "rested" : "active";
    addDonPreAction.push({
      action: "addDon",
      count: { amount, ...(upTo && { upTo: true }) },
      state,
    });
    text = text
      .slice(addDonPrefixMatch[0].length)
      .trim()
      .replace(/^and\s+/i, "");
  }

  // Try search action on the full text BEFORE any splitting.
  // Search actions span across ". Then, " and "and" connectors that would
  // otherwise be split apart (e.g., "add it to your hand. Then, place the rest...").
  const preParsed: Action[] = [...addDonPreAction];
  let textAfterSearch = text;

  const handAndMatchingDeckTrash =
    /^(.+?)\.\s*Then,\s*(trash\s+up\s+to\s+\d+\s+cards?\s+from\s+your\s+hand)\.\s*Trash\s+the\s+same\s+number\s+of\s+cards?\s+from\s+the\s+top\s+of\s+your\s+deck\s+as\s+you\s+did\s+from\s+your\s+hand$/i.exec(
      textAfterSearch,
    );
  if (handAndMatchingDeckTrash) {
    const leadingActions = parseActions(handAndMatchingDeckTrash[1]!);
    const handTrash = parseTrashFromHandAction(handAndMatchingDeckTrash[2]!);
    if (leadingActions.unparsed === "" && leadingActions.parsed.length > 0 && handTrash) {
      preParsed.push(...leadingActions.parsed, handTrash, {
        action: "trashFromDeck",
        player: "self",
        amount: 0,
        amountFromPreviousActionTargets: true,
      });
      textAfterSearch = "";
    }
  }

  const distributedPowerMatch =
    /^Select\s+up\s+to\s+(\d+)\s+of\s+your\s+opponent[''\u2019]s\s+Characters,\s+and\s+give\s+1\s+Character\s+([+\-\u2212]?\d+)\s+power\s+and\s+the\s+other\s+([+\-\u2212]?\d+)\s+power\s+(until\s+.+?)\.\s*Then,\s*(.+)$/i.exec(
      textAfterSearch,
    );
  if (distributedPowerMatch) {
    const trailing = parseActions(distributedPowerMatch[5]!);
    if (trailing.unparsed === "" && trailing.parsed.length > 0) {
      const values = [distributedPowerMatch[2]!, distributedPowerMatch[3]!].map((value) =>
        Number(value.replace("\u2212", "-")),
      );
      preParsed.push(
        {
          action: "modifyPower",
          target: {
            player: "opponent",
            zones: ["character"],
            count: { amount: parseInt(distributedPowerMatch[1]!, 10), upTo: true },
          },
          value: values[0]!,
          distributedValues: values,
          duration: parseFullDuration(distributedPowerMatch[4]!),
        },
        ...trailing.parsed,
      );
      textAfterSearch = "";
    }
  }

  // A trailing duration shared by K.O. protection and a power gain applies to
  // both actions. Preserve a mandatory ". Then," continuation as well.
  const sharedKoProtectionPowerDurationMatch =
    /^((?:This|this)\s+(?:Character|Leader)\s+cannot\s+be\s+K\.O\.\u2019?'?d\s+(?:in\s+battle|by\s+(?:(?:your\s+opponent[''\u2019]s\s+)?effects?)))\s+and\s+gains?\s+([+-]?\d+)\s+power\s+((?:during\s+this\s+(?:turn|battle)|until\s+.+?))(?:\.\s*Then,\s*(.+))?$/i.exec(
      textAfterSearch,
    );
  if (sharedKoProtectionPowerDurationMatch) {
    const durationText = sharedKoProtectionPowerDurationMatch[3]!;
    const protection = parseCannotBeKodAction(
      `${sharedKoProtectionPowerDurationMatch[1]!} ${durationText}`,
    );
    const subject = /^this\s+Leader/i.test(sharedKoProtectionPowerDurationMatch[1]!)
      ? "this Leader"
      : "this Character";
    const power = parseModifyPowerAction(
      `${subject} gains ${sharedKoProtectionPowerDurationMatch[2]!} power ${durationText}`,
    );
    const trailing = sharedKoProtectionPowerDurationMatch[4]
      ? parseActions(sharedKoProtectionPowerDurationMatch[4]!)
      : { parsed: [], unparsed: "" };
    if (protection && power && trailing.unparsed === "") {
      preParsed.push(protection, power, ...trailing.parsed);
      textAfterSearch = "";
    }
  }

  // "Then, you may K.O. any number ..." is an optional target count inside an
  // otherwise mandatory sequence. Preserve the successful K.O. count for the
  // following per-Character power increase.
  const koAnyNumberForPowerMatch =
    /^(.+?)\.\s*Then,\s*you\s+may\s+K\.O\.\s+any\s+number\s+of\s+(.+?)\.\s*(.+?)\s+gains?\s+(?:an\s+)?additional\s+\+(\d+)\s+power\s+(during\s+this\s+(?:turn|battle))\s+for\s+every\s+Character\s+K\.O\.\u2019?'?d$/i.exec(
      textAfterSearch,
    );
  if (koAnyNumberForPowerMatch) {
    const leadingActions = parseActions(koAnyNumberForPowerMatch[1]!);
    const koTarget = parseTarget(`all of ${koAnyNumberForPowerMatch[2]!}`);
    const powerTarget = parseModifyPowerTarget(koAnyNumberForPowerMatch[3]!);
    if (
      leadingActions.unparsed === "" &&
      leadingActions.parsed.length > 0 &&
      koTarget &&
      powerTarget
    ) {
      preParsed.push(
        ...leadingActions.parsed,
        {
          action: "ko",
          target: {
            ...koTarget,
            count: { ...koTarget.count, upTo: true },
          },
        },
        {
          action: "modifyPower",
          target: powerTarget,
          value: 0,
          valuePerPreviousActionTarget: parseInt(koAnyNumberForPowerMatch[4]!, 10),
          duration: parseFullDuration(koAnyNumberForPowerMatch[5]!),
        },
      );
      textAfterSearch = "";
    }
  }

  const returnTrashForGroupedPowerMatch =
    /^(.+?)\.\s*Then,\s*(place\s+any\s+number\s+of\s+Character\s+cards?\s+with\s+a\s+cost\s+of\s+(\d+)\s+or\s+more\s+from\s+your\s+trash\s+at\s+the\s+(bottom|top)\s+of\s+your\s+deck(?:\s+in\s+any\s+order)?)\.\s*This\s+Character\s+gains?\s+\+(\d+)\s+power\s+(during\s+this\s+(?:turn|battle))\s+for\s+every\s+(\d+)\s+cards?\s+placed\s+at\s+the\s+(?:bottom|top)\s+of\s+your\s+deck$/i.exec(
      textAfterSearch,
    );
  if (returnTrashForGroupedPowerMatch) {
    const leading = parseActions(returnTrashForGroupedPowerMatch[1]!);
    const returned: Action = {
      action: "returnToDeck",
      target: {
        player: "self",
        zones: ["trash"],
        count: { amount: "all", upTo: true },
        filters: [
          { filter: "cardCategory", value: "character" },
          {
            filter: "cost",
            comparison: "gte",
            value: parseInt(returnTrashForGroupedPowerMatch[3]!, 10),
          },
        ],
      },
      position: returnTrashForGroupedPowerMatch[4]!.toLowerCase() as "bottom" | "top",
      order: "any",
    };
    if (leading.unparsed === "" && leading.parsed.length > 0) {
      preParsed.push(...leading.parsed, returned, {
        action: "modifyPower",
        target: { player: "self", zones: ["character"], count: { amount: 1 }, self: true },
        value: 0,
        valuePerPreviousActionTarget: parseInt(returnTrashForGroupedPowerMatch[5]!, 10),
        previousActionTargetGroupSize: parseInt(returnTrashForGroupedPowerMatch[7]!, 10),
        duration: parseFullDuration(returnTrashForGroupedPowerMatch[6]!),
      });
      textAfterSearch = "";
    }
  }

  const redrawHand = parseRedrawHandAction(textAfterSearch);
  if (redrawHand) {
    preParsed.push(redrawHand);
    textAfterSearch = "";
  }

  const directBothPlayersTrashUntil = parseBothPlayersTrashUntilHandSize(textAfterSearch);
  if (directBothPlayersTrashUntil) {
    preParsed.push(...directBothPlayersTrashUntil);
    textAfterSearch = "";
  }

  const bothPlayersTrashUntilMatch =
    /^(.*?)\.\s*Then,\s*(you\s+and\s+your\s+opponent\s+trash\s+cards?\s+from\s+your\s+hands?\s+until\s+you\s+each\s+have\s+\d+\s+cards?\s+in\s+your\s+hands?)$/i.exec(
      textAfterSearch,
    );
  if (bothPlayersTrashUntilMatch) {
    const leadingActions = parseActions(bothPlayersTrashUntilMatch[1]!);
    const trashActions = parseBothPlayersTrashUntilHandSize(bothPlayersTrashUntilMatch[2]!);
    if (leadingActions.unparsed === "" && trashActions) {
      preParsed.push(...leadingActions.parsed, ...trashActions);
      textAfterSearch = "";
    }
  }

  const endOfBattleDelayedMatch =
    /^(.+?)\.\s*Then,\s*at\s+the\s+end\s+of\s+this\s+battle,\s*(.+)$/i.exec(textAfterSearch);
  if (endOfBattleDelayedMatch) {
    const leadingActions = parseActions(endOfBattleDelayedMatch[1]!);
    const delayedActions = parseActions(endOfBattleDelayedMatch[2]!);
    if (
      leadingActions.unparsed === "" &&
      leadingActions.parsed.length > 0 &&
      delayedActions.unparsed === "" &&
      delayedActions.parsed.length > 0
    ) {
      preParsed.push(...leadingActions.parsed, {
        action: "delayed",
        timing: "endOfThisBattle",
        actions: delayedActions.parsed,
      });
      textAfterSearch = "";
    }
  }

  const revealFromDeckThenShuffleMatch = /^(.+?)\.\s*Then,\s*(shuffle\s+your\s+deck)$/i.exec(
    textAfterSearch,
  );
  if (revealFromDeckThenShuffleMatch) {
    const revealFromDeck = parseRevealFromDeckToHandAction(revealFromDeckThenShuffleMatch[1]!);
    const shuffleDeck = parseShuffleDeckAction(revealFromDeckThenShuffleMatch[2]!);
    if (revealFromDeck && shuffleDeck) {
      preParsed.push(revealFromDeck, shuffleDeck);
      textAfterSearch = "";
    }
  }

  const filteredRevealPlayAndReplaceMatch =
    /^(.+?)\.\s*Then,\s*reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+deck(?:,\s*|\s+and\s+)play\s+up\s+to\s+1\s+(.+?)\.\s*Then,\s*place\s+the\s+rest\s+at\s+the\s+(top\s+or\s+bottom|top|bottom)\s+of\s+your\s+deck$/i.exec(
      textAfterSearch,
    );
  if (filteredRevealPlayAndReplaceMatch) {
    const leadingActions = parseActions(filteredRevealPlayAndReplaceMatch[1]!);
    const filters = parsePlayDescription(filteredRevealPlayAndReplaceMatch[2]!);
    if (leadingActions.unparsed === "" && leadingActions.parsed.length > 0 && filters) {
      const printedPosition = filteredRevealPlayAndReplaceMatch[3]!.toLowerCase();
      preParsed.push(...leadingActions.parsed, {
        action: "revealTopDeckCard",
        player: "self",
        conditional: {
          filters,
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "deck" },
              count: { amount: 1, upTo: true },
              filters,
              topOnly: true,
            },
          ],
        },
        finalPosition:
          printedPosition === "top or bottom"
            ? ("choice" as const)
            : (printedPosition as "top" | "bottom"),
      });
      textAfterSearch = "";
    }
  }

  const revealPlayAndReplaceMatch =
    /^(.+?)\.\s*Then,\s*reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+deck,\s*play\s+up\s+to\s+1\s+Character\s+card\s+with\s+a\s+cost\s+of\s+(\d+),\s*and\s+place\s+the\s+rest\s+at\s+the\s+(top\s+or\s+bottom|top|bottom)\s+of\s+your\s+deck$/i.exec(
      textAfterSearch,
    );
  if (revealPlayAndReplaceMatch) {
    const leadingActions = parseActions(revealPlayAndReplaceMatch[1]!);
    if (leadingActions.unparsed === "" && leadingActions.parsed.length > 0) {
      const cost = parseInt(revealPlayAndReplaceMatch[2]!, 10);
      const printedPosition = revealPlayAndReplaceMatch[3]!.toLowerCase();
      const finalPosition =
        printedPosition === "top or bottom"
          ? ("choice" as const)
          : (printedPosition as "top" | "bottom");
      preParsed.push(...leadingActions.parsed, {
        action: "revealTopDeckCard",
        player: "self",
        conditional: {
          filters: [
            { filter: "cardCategory", value: "character" },
            { filter: "cost", comparison: "eq", value: cost },
          ],
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "deck" },
              count: { amount: 1, upTo: true },
              filters: [
                { filter: "cardCategory", value: "character" },
                { filter: "cost", comparison: "eq", value: cost },
              ],
              topOnly: true,
            },
          ],
        },
        finalPosition,
      });
      textAfterSearch = "";
    }
  }

  const conditionalSelfReturnMatch =
    /^(.+?)\.\s*Then,\s*if\s+you\s+do\s+not\s+have\s+(\d+)\s+Characters?\s+with\s+a\s+cost\s+of\s+(\d+)\s+or\s+(less|more),\s*(place\s+this\s+Character\s+at\s+the\s+(?:bottom|top)\s+of\s+the\s+owner[''\u2019]s\s+deck)$/i.exec(
      textAfterSearch,
    );
  if (conditionalSelfReturnMatch) {
    const leadingActions = parseActions(conditionalSelfReturnMatch[1]!);
    const selfReturn = parseReturnToDeckAction(conditionalSelfReturnMatch[5]!);
    if (leadingActions.unparsed === "" && leadingActions.parsed.length > 0 && selfReturn) {
      preParsed.push(...leadingActions.parsed, {
        ...selfReturn,
        condition: {
          condition: "zoneCount",
          player: "self",
          zone: "character",
          comparison: "lt",
          value: parseInt(conditionalSelfReturnMatch[2]!, 10),
          filters: [
            {
              filter: "cost",
              comparison: conditionalSelfReturnMatch[4]!.toLowerCase() === "less" ? "lte" : "gte",
              value: parseInt(conditionalSelfReturnMatch[3]!, 10),
            },
          ],
        },
      });
      textAfterSearch = "";
    }
  }

  const independentConditionalThenMatch = /^(.+?)\.\s*Then,\s*if\s+(.+?),\s*(.+)$/i.exec(
    textAfterSearch,
  );
  if (independentConditionalThenMatch) {
    const leadingActions = parseActions(independentConditionalThenMatch[1]!);
    const condition = parseConditionText(independentConditionalThenMatch[2]!);
    const conditionalActions = parseActions(independentConditionalThenMatch[3]!);
    if (
      leadingActions.unparsed === "" &&
      leadingActions.parsed.length > 0 &&
      condition &&
      conditionalActions.unparsed === "" &&
      conditionalActions.parsed.length > 0
    ) {
      preParsed.push(
        ...leadingActions.parsed,
        ...conditionalActions.parsed.map(
          (action): Action => ({
            ...action,
            ...("condition" in action && action.condition
              ? {
                  condition: {
                    condition: "compound",
                    operator: "and",
                    conditions: [condition, action.condition],
                  },
                }
              : { condition }),
          }),
        ),
      );
      textAfterSearch = "";
    }
  }

  const selectedCharacterProtectionMatch =
    /^(.+?)\.\s*If\s+that\s+card\s+is\s+a\s+Character,\s*that\s+Character\s+cannot\s+be\s+K\.O\.[’']?d\s+(during\s+this\s+(?:turn|battle)|until\s+.+)$/i.exec(
      textAfterSearch,
    );
  if (selectedCharacterProtectionMatch) {
    const leading = parseActions(selectedCharacterProtectionMatch[1]!);
    if (!leading.unparsed && leading.parsed.at(-1)?.action === "modifyPower") {
      preParsed.push(...leading.parsed, {
        action: "cannotBeKod",
        target: { player: "self", zones: ["character"], count: { amount: 1, upTo: true } },
        previousActionTargets: true,
        condition: {
          condition: "previousActionTarget",
          filters: [{ filter: "cardCategory", value: "character" }],
        },
        duration: parseFullDuration(selectedCharacterProtectionMatch[2]!),
      });
      textAfterSearch = "";
    }
  }

  const additionalSameTargetPower =
    /^(.+?)\.\s*Then,\s*that\s+card\s+gains?\s+an\s+additional\s+([+-]?\d+)\s+power\s+(during\s+this\s+(?:turn|battle)|until\s+.+)$/i.exec(
      textAfterSearch,
    );
  if (additionalSameTargetPower) {
    const leading = parseActions(additionalSameTargetPower[1]!);
    const previous = leading.parsed.at(-1);
    if (!leading.unparsed && previous?.action === "modifyPower") {
      preParsed.push(...leading.parsed, {
        action: "modifyPower",
        target: previous.target,
        value: parseInt(additionalSameTargetPower[2]!, 10),
        duration: parseFullDuration(additionalSameTargetPower[3]!),
        previousActionTargets: true,
      });
      textAfterSearch = "";
    }
  }

  const dependentConditionalSameTargetMatch =
    /^(.+?)\.\s*Then,\s*if\s+(.+?),\s*that\s+card\s+gains?\s+(?:an\s+additional\s+)?([+-]?\d+)\s+power(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      textAfterSearch,
    );
  if (dependentConditionalSameTargetMatch) {
    const leadingActions = parseActions(dependentConditionalSameTargetMatch[1]!);
    const condition = parseConditionText(dependentConditionalSameTargetMatch[2]!);
    const previousAction = leadingActions.parsed.at(-1);
    if (leadingActions.unparsed === "" && previousAction?.action === "modifyPower" && condition) {
      preParsed.push(...leadingActions.parsed, {
        action: "modifyPower",
        target: previousAction.target,
        value: parseInt(dependentConditionalSameTargetMatch[3]!, 10),
        duration: dependentConditionalSameTargetMatch[4]
          ? parseFullDuration(dependentConditionalSameTargetMatch[4])
          : previousAction.duration,
        previousActionTargets: true,
        condition,
      });
      textAfterSearch = "";
    }
  }

  const dependentConditionalSameTargetKeywordMatch =
    /^(.+?)\.\s*Then,\s*if\s+(.+?),\s*that\s+card\s+gains?\s+(\[[^\]]+\](?:\s+(?:during\s+this\s+(?:turn|battle)|until\s+.+))?)$/i.exec(
      textAfterSearch,
    );
  if (dependentConditionalSameTargetKeywordMatch) {
    const leadingActions = parseActions(dependentConditionalSameTargetKeywordMatch[1]!);
    const condition = parseConditionText(dependentConditionalSameTargetKeywordMatch[2]!);
    const previousAction = leadingActions.parsed.at(-1);
    const keywordAction = parseGrantKeywordAction(
      `your Leader gains ${dependentConditionalSameTargetKeywordMatch[3]!}`,
    );
    if (
      leadingActions.unparsed === "" &&
      previousAction?.action === "modifyPower" &&
      condition &&
      keywordAction
    ) {
      preParsed.push(...leadingActions.parsed, {
        ...keywordAction,
        target: previousAction.target,
        previousActionTargets: true,
        condition,
      });
      textAfterSearch = "";
    }
  }

  const dependentConditionalSameTargetKoMatch =
    /^(.+?)\.\s*Then,\s*if\s+that\s+Character\s+has\s+(\d+)\s+power\s+or\s+(less|more),\s*K\.O\.\s+it$/i.exec(
      textAfterSearch,
    );
  if (dependentConditionalSameTargetKoMatch) {
    const leadingActions = parseActions(dependentConditionalSameTargetKoMatch[1]!);
    const previousAction = leadingActions.parsed.at(-1);
    if (
      leadingActions.unparsed === "" &&
      previousAction &&
      "target" in previousAction &&
      previousAction.target
    ) {
      preParsed.push(...leadingActions.parsed, {
        action: "ko",
        target: {
          ...previousAction.target,
          filters: [
            ...(previousAction.target.filters ?? []),
            {
              filter: "power",
              comparison:
                dependentConditionalSameTargetKoMatch[3]!.toLowerCase() === "less" ? "lte" : "gte",
              value: parseInt(dependentConditionalSameTargetKoMatch[2]!, 10),
            },
          ],
        },
        previousActionTargets: true,
      });
      textAfterSearch = "";
    }
  }

  const koProtectionAndPowerMatch =
    /^(.*?\bcannot\s+be\s+K\.O\.\u2019?'?d\b.+?)\s+and\s+gains?\s+([+-]?\d+\s+power(?:\s+(?:during\s+this\s+(?:turn|battle)|until\s+.+))?)$/i.exec(
      textAfterSearch,
    );
  if (koProtectionAndPowerMatch) {
    const protection = parseCannotBeKodAction(koProtectionAndPowerMatch[1]!);
    const power = parseModifyPowerAction(`This Character gains ${koProtectionAndPowerMatch[2]!}`);
    if (protection && power) {
      preParsed.push(protection, power);
      textAfterSearch = "";
    }
  }

  // "Do X. If you do, Y" where X returns a Character to hand. Attach Y to
  // the return so declining an "up to" target does not resolve the follow-up.
  const returnToHandThenMatch = /^(.+?)\.\s*If\s+you\s+do,\s*(.+)$/i.exec(textAfterSearch);
  if (returnToHandThenMatch) {
    const leadingActions = parseActions(returnToHandThenMatch[1]!).parsed;
    const thenActions = parseActions(returnToHandThenMatch[2]!).parsed;
    const lastAction = leadingActions.at(-1);
    if (lastAction?.action === "returnToHand" && thenActions.length > 0) {
      preParsed.push(...leadingActions.slice(0, -1), { ...lastAction, thenActions });
      textAfterSearch = "";
    }
  }

  // "You may return DON!!. If you do, Y" keeps Y dependent on the
  // successful DON!! movement instead of parsing it as an independent action.
  const returnDonThenMatch = /^(.+?)\.\s*If\s+you\s+do,\s*(.+)$/i.exec(textAfterSearch);
  if (returnDonThenMatch) {
    const returnDon = parseOpponentReturnDonAction(
      returnDonThenMatch[1]!.replace(/^you\s+may\s+/i, ""),
    );
    const thenActions = parseActions(returnDonThenMatch[2]!).parsed;
    if (returnDon && thenActions.length > 0) {
      preParsed.push({ ...returnDon, thenActions });
      textAfterSearch = "";
    }
  }

  // "Do X. If you do, Y" where X moves Life. Keep Y attached to X so the
  // engine can distinguish successful resolution from merely accepting an
  // optional effect.
  const lifeThenMatch = /^(.+?)\.\s*If\s+you\s+do,\s*(.+)$/i.exec(textAfterSearch);
  if (lifeThenMatch) {
    const lifeAction = parseRemoveFromLifeAction(lifeThenMatch[1]!.replace(/^you\s+may\s+/i, ""));
    const thenActions = parseActions(lifeThenMatch[2]!).parsed;
    if (lifeAction?.action === "removeFromLife" && thenActions.length > 0) {
      const optional = optionalPrefix || /^you\s+may\s+/i.test(lifeThenMatch[1]!);
      preParsed.push({
        ...lifeAction,
        ...(optional &&
          "amount" in lifeAction.count && { count: { ...lifeAction.count, upTo: true } }),
        thenActions,
      });
      textAfterSearch = "";
    }
  }

  // "You may trash N cards from the top of your deck. If you do, trash this
  // Character." is one optional effect with an exact self-mill followed by
  // self-trash, not an additional up-to count.
  const trashDeckThenSelfMatch =
    /^(?:you\s+may\s+)?(trash\s+\d+\s+cards?\s+from\s+the\s+top\s+of\s+(?:your|your\s+opponent's)\s+deck)\.\s*If\s+you\s+do,\s*(trash\s+this\s+(?:Character|Leader|Stage))\.?$/i.exec(
      textAfterSearch,
    );
  if (trashDeckThenSelfMatch) {
    const trashDeck = parseTrashFromDeckAction(trashDeckThenSelfMatch[1]!);
    const trashSelf = parseTrashThisCardAction(trashDeckThenSelfMatch[2]!);
    if (trashDeck && trashSelf) {
      preParsed.push({ ...trashDeck, thenRequiresFullAmount: true, thenActions: [trashSelf] });
      textAfterSearch = "";
    }
  }

  const revealTopAndAdd =
    /^Reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+deck\s+and\s+add\s+up\s+to\s+1\s+(.+?)\s+to\s+your\s+hand\.\s*Then,\s*place\s+the\s+rest\s+at\s+the\s+bottom\s+of\s+your\s+deck\.?$/i.exec(
      textAfterSearch,
    );
  if (revealTopAndAdd) {
    const filters = parsePlayDescription(revealTopAndAdd[1]!);
    if (filters?.length) {
      preParsed.push({
        action: "revealTopDeckCard",
        player: "self",
        conditional: {
          filters,
          actions: [
            {
              action: "search",
              lookCount: 1,
              source: { player: "self", zone: "deck" },
              revealCount: { amount: 1, upTo: true },
              revealFilters: filters,
              revealDestination: "hand",
              remainderPosition: "bottom",
            },
          ],
        },
        finalPosition: "bottom",
      });
      textAfterSearch = "";
    }
  }

  // Revealing the top card is mandatory even when its optional play is declined.
  const revealTopAndPlayMatch =
    /^Reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+deck(?:,\s*|\s+and\s+)play\s+up\s+to\s+1\s+(.+?)\.\s*Then,\s*place\s+the\s+rest\s+at\s+the\s+(top\s+or\s+bottom|top|bottom)\s+of\s+your\s+deck\.?$/i.exec(
      textAfterSearch,
    );
  if (revealTopAndPlayMatch) {
    const description = revealTopAndPlayMatch[1]!;
    const rested = /\s+rested$/i.test(description);
    const filters = parsePlayDescription(description.replace(/\s+rested$/i, ""));
    if (filters) {
      const position = revealTopAndPlayMatch[2]!.toLowerCase();
      preParsed.push({
        action: "revealTopDeckCard",
        player: "self",
        conditional: {
          filters,
          actions: [
            {
              action: "play",
              source: { player: "self", zone: "deck" },
              count: { amount: 1, upTo: true },
              filters,
              topOnly: true,
              ...(rested && { playState: "rested" as const }),
            },
          ],
        },
        finalPosition: position === "top or bottom" ? "choice" : (position as "top" | "bottom"),
      });
      textAfterSearch = "";
    }
  }

  const search = parseSearchAction(text);
  if (search && textAfterSearch) {
    preParsed.push(search.action);
    textAfterSearch = search.remaining;
  }

  // Preserve a leading action before a complete deck-search continuation.
  if (!search && preParsed.length === 0) {
    const leadingThenSearchMatch = /^(.+?)\.\s*Then,\s*(look\s+at\s+.+)$/i.exec(textAfterSearch);
    if (leadingThenSearchMatch) {
      const leading = parseActions(leadingThenSearchMatch[1]!);
      const trailingLife = parseLifeCardLookAction(leadingThenSearchMatch[2]!);
      const trailingSearch = parseSearchAction(leadingThenSearchMatch[2]!);
      if (leading.parsed.length > 0 && !leading.unparsed && trailingLife) {
        preParsed.push(...leading.parsed, trailingLife);
        textAfterSearch = "";
      } else if (
        leading.parsed.length > 0 &&
        !leading.unparsed &&
        trailingSearch &&
        !trailingSearch.remaining
      ) {
        preParsed.push(...leading.parsed, trailingSearch.action);
        textAfterSearch = "";
      }
    }
  }

  // Try life card look on the full text BEFORE splitting — it spans "Look at ... and place ..."
  if (!search) {
    const lifeLook = parseLifeCardLookAction(textAfterSearch);
    if (lifeLook) {
      textAfterSearch = "";
      preParsed.push(lifeLook);
    }
  }

  // Try "Reveal [Name] from your deck and add it to your hand" BEFORE splitting
  if (!search && preParsed.length === 0) {
    const revealFromDeck = parseRevealFromDeckToHandAction(textAfterSearch);
    if (revealFromDeck) {
      textAfterSearch = "";
      preParsed.push(revealFromDeck);
    }
  }

  // Try "Select up to N ... The selected Character cannot attack/be K.O.'d"
  if (preParsed.length === 0) {
    const selectAction = parseSelectAction(textAfterSearch);
    if (selectAction) {
      textAfterSearch = "";
      preParsed.push(...selectAction);
    }
  }

  // Try "Place ... at the top or bottom of ... Life cards"
  if (preParsed.length === 0) {
    const placeToLife = parsePlaceCharacterToLifeAction(textAfterSearch);
    if (placeToLife) {
      textAfterSearch = "";
      preParsed.push(placeToLife);
    }
  }

  // Try "K.O. <target1> or <target2>" compound K.O. pre-parse
  if (preParsed.length === 0) {
    const compoundKo = parseCompoundKoAction(textAfterSearch);
    if (compoundKo) {
      textAfterSearch = "";
      preParsed.push(compoundKo);
    }
  }

  // Try "Your opponent chooses N ... and return to the owner's hand" pre-parse (spans "and")
  if (preParsed.length === 0) {
    const oppChoose = parseOpponentChooseReturn(textAfterSearch);
    if (oppChoose) {
      textAfterSearch = "";
      preParsed.push(oppChoose);
    }
  }

  // Try "K.O. or rest up to 1 of ..." pre-parse
  if (preParsed.length === 0) {
    const koOrRestMatch = /^K\.O\.\s+or\s+rest\s+(up\s+to\s+\d+\s+.+?)$/i.exec(
      textAfterSearch.trim().replace(/\.+$/, ""),
    );
    if (koOrRestMatch) {
      const target = parseTarget(koOrRestMatch[1]!);
      if (target) {
        preParsed.push({
          action: "choice",
          options: [[{ action: "ko", target }], [{ action: "rest", target: { ...target } }]],
        });
        textAfterSearch = "";
      }
    }
  }

  // One printed `rest up to N` spanning DON!! and Characters is one mixed
  // target selection, not a choice between two independently optional actions.
  if (preParsed.length === 0) {
    const compoundRestMatch =
      /^rest\s+(?:up\s+to\s+)?(\d+)\s+of\s+your\s+opponent[''\u2019]s\s+DON!!\s+cards?\s+or\s+(.+)$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (compoundRestMatch) {
      const mixedRest = parseRestAction(textAfterSearch);
      if (mixedRest) {
        preParsed.push(mixedRest);
        textAfterSearch = "";
      }
    }
  }

  // Try "K.O. ... or return it to the owner's hand" choice pre-parse
  if (preParsed.length === 0) {
    const koOrReturn = parseKoOrReturnChoice(textAfterSearch);
    if (koOrReturn) {
      textAfterSearch = "";
      preParsed.push(koOrReturn);
    }
  }

  // Try "Return ... to the owner's hand or the bottom of their deck" choice pre-parse
  if (preParsed.length === 0) {
    const returnChoice = parseReturnHandOrDeckChoice(textAfterSearch);
    if (returnChoice) {
      textAfterSearch = "";
      preParsed.push(returnChoice);
    }
  }

  // Try "Draw a card for each of your {Trait} type Characters. Then, trash the same number of cards from your hand"
  if (preParsed.length === 0) {
    const drawForEachMatch =
      /^draw\s+a\s+card\s+for\s+each\s+of\s+your\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+Characters?(?:\.\s*Then,?\s+trash\s+the\s+same\s+number\s+of\s+cards?\s+from\s+your\s+hand)?$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (drawForEachMatch) {
      const amountFromTarget = {
        player: "self" as const,
        zones: ["character" as const],
        count: { amount: "all" as const },
        filters: [
          {
            filter: "trait" as const,
            value: drawForEachMatch[1]!,
            match: "exact" as const,
          },
        ],
      };
      preParsed.push({ action: "draw", player: "self" as const, amount: 0, amountFromTarget });
      if (/trash\s+the\s+same/i.test(textAfterSearch)) {
        preParsed.push({
          action: "trashFromHand",
          player: "self" as const,
          amount: 0,
          amountFromPreviousActionTargets: true,
        });
      }
      textAfterSearch = "";
    }
  }

  // Try "Reveal 1 card from the top of your Life cards. If that card is a [X] with a cost of N, you may play that card. If you do, ..."
  if (preParsed.length === 0) {
    const revealLifeMatch =
      /^Reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+Life\s+cards?\.\s*If\s+that\s+card\s+is\s+(?:a\s+)?\[([^\]]+)\]\s+with\s+a\s+cost\s+of\s+(\d+),\s+you\s+may\s+play\s+that\s+card\.\s*If\s+you\s+do,\s+(.+)$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (revealLifeMatch) {
      const nameFilter: TargetFilter = { filter: "name", value: revealLifeMatch[1]! };
      const costFilter: TargetFilter = {
        filter: "cost",
        comparison: "eq" as Comparison,
        value: parseInt(revealLifeMatch[2]!, 10),
      };
      const thenText = revealLifeMatch[3]!;
      const thenActions = parseActions(thenText).parsed;
      preParsed.push({
        action: "revealFromLife",
        player: "self" as const,
        conditionalPlay: {
          filters: [nameFilter, costFilter],
          thenActions: thenActions.length > 0 ? thenActions : undefined,
        },
      } as unknown as Action);
      textAfterSearch = "";
    }
  }

  // "Reveal 1 card from the top of your Life cards. If that card is a "Trait" type Character card with a cost of N or less, you may play that card."
  if (preParsed.length === 0) {
    const revealLifeTraitMatch =
      /^Reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+Life\s+cards?\.\s*If\s+that\s+card\s+is\s+an?\s+(?:[[{"\u201c])([^\]}"\u201d]+)(?:[\]}"\u201d])\s+type\s+(Character|Event|Stage)\s+cards?\s+with\s+a\s+cost\s+of\s+(\d+)(?:\s+or\s+(less|more))?,\s+you\s+may\s+play\s+that\s+card\.?$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (revealLifeTraitMatch) {
      const comparison =
        revealLifeTraitMatch[4]?.toLowerCase() === "less"
          ? ("lte" as const)
          : revealLifeTraitMatch[4]?.toLowerCase() === "more"
            ? ("gte" as const)
            : ("eq" as const);
      preParsed.push({
        action: "revealFromLife",
        player: "self",
        conditionalPlay: {
          filters: [
            {
              filter: "trait",
              value: revealLifeTraitMatch[1]!,
              match: "exact",
            },
            {
              filter: "cardCategory",
              value: revealLifeTraitMatch[2]!.toLowerCase() as "character" | "event" | "stage",
            },
            {
              filter: "cost",
              comparison,
              value: parseInt(revealLifeTraitMatch[3]!, 10),
            },
          ],
        },
      } as unknown as Action);
      textAfterSearch = "";
    }
  }

  // Try "Choose up to 1 X and up to 1 Y from <source>. Play 1 card and play the other card rested."
  if (preParsed.length === 0) {
    const chooseAndPlayMatch =
      /^Choose\s+up\s+to\s+1\s+(.+?)\s+and\s+up\s+to\s+1\s+(.+?)\s+from\s+your\s+(hand|trash|deck)\.\s*Play\s+1\s+card\s+and\s+play\s+the\s+other\s+card\s+rested$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (chooseAndPlayMatch) {
      const source = chooseAndPlayMatch[3]!.toLowerCase() as Zone;
      const { filters: filters1 } = extractTargetFilters(chooseAndPlayMatch[1]!);
      const { filters: filters2 } = extractTargetFilters(chooseAndPlayMatch[2]!);
      // Add card category filters if text mentions "Character card"
      if (/Character\s+card/i.test(chooseAndPlayMatch[1]!)) {
        filters1.push({ filter: "cardCategory", value: "character" });
      }
      if (/Character\s+card/i.test(chooseAndPlayMatch[2]!)) {
        filters2.push({ filter: "cardCategory", value: "character" });
      }
      preParsed.push({
        action: "playGrouped",
        source: { player: "self" as const, zone: source },
        groups: [
          {
            count: { amount: 1, upTo: true },
            filters: filters1.length > 0 ? filters1 : undefined,
          },
          {
            count: { amount: 1, upTo: true },
            filters: filters2.length > 0 ? filters2 : undefined,
          },
        ],
        playStates: { single: "active", multiple: ["active", "rested"] },
      });
      textAfterSearch = "";
    }
  }

  // Try compound play patterns: "play up to 1 X and up to 1 Y" pre-parse
  if (preParsed.length === 0) {
    const compoundPlay = parseCompoundPlayAction(textAfterSearch);
    if (compoundPlay) {
      textAfterSearch = "";
      preParsed.push(...compoundPlay);
    }
  }

  // Try "... instead. If there is a [X] Character, this effect is negated" — replacement with negation condition
  if (preParsed.length === 0) {
    const replacementNegateMatch =
      /^(.+?)\s+instead\.\s*If\s+there\s+is\s+(?:a\s+)?\[([^\]]+)\]\s+Character,\s+this\s+effect\s+is\s+negated$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (replacementNegateMatch) {
      const mainActions = parseActions(replacementNegateMatch[1]!).parsed;
      if (mainActions.length > 0) {
        preParsed.push(...mainActions);
        textAfterSearch = "";
      }
    }
  }

  // Try "You may trash any number of [X] type cards from your hand. ... gains +N power ... for every card trashed"
  if (preParsed.length === 0) {
    const trashForPowerMatch =
      /^(?:You\s+may\s+)?trash\s+any\s+number\s+of\s+(?:[[{"\u201c])([^\]}\u201d"]+)(?:[\]}\u201d"])\s+type\s+cards?\s+from\s+your\s+hand\.\s+(.+?)\s+gains?\s+\+(\d+)\s+power\s+(during\s+this\s+(?:turn|battle))\s+for\s+every\s+card\s+trashed$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (trashForPowerMatch) {
      preParsed.push({
        action: "trashFromHand",
        player: "self" as const,
        amount: "all",
        upTo: true,
        filters: [{ filter: "trait", value: trashForPowerMatch[1]!, match: "exact" }],
      } as Action);
      const targetText = trashForPowerMatch[2]!;
      const target = /^Your\s+Leader\s+or\s+1\s+of\s+your\s+Characters$/i.test(targetText)
        ? ({
            player: "self",
            zones: ["leader", "character"],
            count: { amount: 1 },
          } as const)
        : (parseTarget(targetText) ?? parseModifyPowerTarget(targetText));
      if (target) {
        preParsed.push({
          action: "modifyPower",
          target,
          value: 0,
          valuePerPreviousActionTarget: parseInt(trashForPowerMatch[3]!, 10),
          duration: parseFullDuration(trashForPowerMatch[4]!),
        } as Action);
      }
      textAfterSearch = "";
    }
  }

  // "you may trash any number of Event or Stage cards from your hand. This Leader gains +N power ... for every card trashed"
  if (preParsed.length === 0) {
    const trashCategoryForPowerMatch =
      /^(?:you\s+may\s+)?trash\s+any\s+number\s+of\s+(Event|Stage)(?:\s+or\s+(Event|Stage))?\s+cards?\s+from\s+your\s+hand\.\s*(This\s+(?:Leader|Character))\s+gains?\s+\+(\d+)\s+power\s+(during\s+this\s+(?:turn|battle))\s+for\s+every\s+card\s+trashed$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (trashCategoryForPowerMatch) {
      const categories = [trashCategoryForPowerMatch[1]!, trashCategoryForPowerMatch[2]]
        .filter((value): value is string => Boolean(value))
        .map((value) => value.toLowerCase() as "event" | "stage");
      preParsed.push({
        action: "trashFromHand",
        player: "self",
        amount: "all",
        upTo: true,
        filters: [
          {
            filter: "anyOf",
            groups: categories.map((value) => [{ filter: "cardCategory" as const, value }]),
          },
        ],
      } as Action);
      const selfZone = /Leader/i.test(trashCategoryForPowerMatch[3]!) ? "leader" : "character";
      preParsed.push({
        action: "modifyPower",
        target: {
          player: "self",
          zones: [selfZone],
          count: { amount: 1 },
          self: true,
        },
        value: 0,
        valuePerPreviousActionTarget: parseInt(trashCategoryForPowerMatch[4]!, 10),
        duration: parseFullDuration(trashCategoryForPowerMatch[5]!),
      } as Action);
      textAfterSearch = "";
    }
  }

  // "rest any number of your DON!! cards. For every DON!! card rested this way, <target> gains +N power ..."
  if (preParsed.length === 0) {
    const restDonForPowerMatch =
      /^(?:you\s+may\s+)?rest\s+any\s+number\s+of\s+your\s+DON!!\s+cards?\.\s*For\s+every\s+DON!!\s+card\s+rested\s+this\s+way,\s*(.+?)\s+gains?\s+\+(\d+)\s+power\s+(during\s+this\s+(?:turn|battle))\.?$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (restDonForPowerMatch) {
      const targetText = restDonForPowerMatch[1]!.trim();
      let target = parseModifyPowerTarget(targetText);
      // "this Leader or up to 1 of your "Trait" type Characters"
      const leaderOrTraitChar =
        /^this\s+Leader\s+or\s+up\s+to\s+(\d+)\s+of\s+your\s+(?:[[{"\u201c])([^\]}"\u201d]+)(?:[\]}"\u201d])\s+type\s+Characters?$/i.exec(
          targetText,
        );
      if (leaderOrTraitChar) {
        target = {
          player: "self",
          zones: ["leader", "character"],
          count: { amount: parseInt(leaderOrTraitChar[1]!, 10), upTo: true },
          filters: [
            {
              filter: "anyOf",
              groups: [
                [{ filter: "cardCategory", value: "leader" }],
                [
                  { filter: "cardCategory", value: "character" },
                  {
                    filter: "trait",
                    value: leaderOrTraitChar[2]!,
                    match: "exact",
                  },
                ],
              ],
            },
          ],
        };
      }
      if (target) {
        preParsed.push({
          action: "restDonForPower",
          target,
          valuePerDon: parseInt(restDonForPowerMatch[2]!, 10),
          duration: parseFullDuration(restDonForPowerMatch[3]!),
        } as Action);
        textAfterSearch = "";
      }
    }
  }

  // Try "X and, if Y, Z" — compound action with embedded condition
  if (preParsed.length === 0) {
    const andIfMatch =
      /^(.+?)\s+and,\s+if\s+(.+?),\s+(play\s+.+|draw\s+.+|rest\s+.+|add\s+.+|give\s+.+|return\s+.+|K\.O\.\s+.+)$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (andIfMatch) {
      const firstActions = parseActions(andIfMatch[1]!).parsed;
      const condition = parseConditionText(andIfMatch[2]!);
      const secondActions = parseActions(andIfMatch[3]!).parsed;
      if (firstActions.length > 0 && secondActions.length > 0) {
        preParsed.push(...firstActions);
        if (condition) {
          for (const a of secondActions) {
            (a as any).condition = condition;
          }
        }
        preParsed.push(...secondActions);
        textAfterSearch = "";
      }
    }
  }

  // Try "Your opponent may trash N card(s) from ... If they do not, <action>"
  if (preParsed.length === 0) {
    const oppMayTrashMatch =
      /^Your\s+opponent\s+may\s+trash\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+their\s+Life\s+cards?\.\s*If\s+they\s+do\s+not,\s+(.+)$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (oppMayTrashMatch) {
      const trashAction: Action = {
        action: "removeFromLife",
        player: "opponent",
        count: { amount: parseInt(oppMayTrashMatch[1]!, 10) },
        destination: "trash",
      } as Action;
      const elseActions = parseActions(oppMayTrashMatch[2]!).parsed;
      if (elseActions.length > 0) {
        preParsed.push({
          action: "conditional",
          predicate: {
            condition: "lifeCount",
            player: "opponent",
            comparison: "gte",
            value: parseInt(oppMayTrashMatch[1]!, 10),
          },
          whenTrue: [
            { action: "choice", player: "opponent", options: [[trashAction], elseActions] },
          ],
          whenFalse: elseActions,
        });
        textAfterSearch = "";
      }
    }
  }

  // "Reveal 1 ... If that card's type includes X, ..." keeps the condition
  // attached to the revealed card instead of flattening the follow-up actions.
  if (preParsed.length === 0) {
    const conditionalPlacedRevealMatch =
      /^Reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+deck\s+and\s+place\s+it\s+at\s+the\s+(top\s+or\s+bottom|top|bottom)\s+of\s+your\s+deck\.\s*If\s+(?:that|the\s+revealed)\s+card(?:[''\u2019]s)?\s+type\s+includes\s+["\u201c]([^"\u201d]+)["\u201d],\s*(.+)$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (conditionalPlacedRevealMatch) {
      const followUp = parseActions(conditionalPlacedRevealMatch[3]!).parsed;
      if (followUp.length > 0) {
        preParsed.push({
          action: "revealTopDeckCard",
          player: "self",
          conditional: {
            filters: [
              { filter: "trait", value: conditionalPlacedRevealMatch[2]!, match: "includes" },
            ],
            actions: followUp,
          },
          finalPosition:
            conditionalPlacedRevealMatch[1]!.toLowerCase() === "top or bottom"
              ? "choice"
              : (conditionalPlacedRevealMatch[1]!.toLowerCase() as "top" | "bottom"),
        });
        textAfterSearch = "";
      }
    }
  }

  if (preParsed.length === 0) {
    const conditionalTopDeckPlayMatch =
      /^Reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+deck\.\s*If\s+(?:that|the\s+revealed)\s+card\s+is\s+(?:a\s+)?(.+?),\s*you\s+may\s+play\s+that\s+card(\s+rested)?\.\s*Then,\s*place\s+the\s+rest\s+at\s+the\s+(bottom|top)\s+of\s+your\s+deck$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (conditionalTopDeckPlayMatch) {
      const filters = parsePlayDescription(conditionalTopDeckPlayMatch[1]!);
      if (filters) {
        preParsed.push({
          action: "revealTopDeckCard",
          player: "self",
          conditional: {
            filters,
            actions: [
              {
                action: "play",
                source: { player: "self", zone: "deck" },
                count: { amount: 1, upTo: true },
                filters,
                topOnly: true,
                ...(conditionalTopDeckPlayMatch[2] && { playState: "rested" as const }),
              },
            ],
            finalPosition: conditionalTopDeckPlayMatch[3]!.toLowerCase() as "bottom" | "top",
          },
          finalPosition: "top",
        });
        textAfterSearch = "";
      }
    }
  }

  if (preParsed.length === 0) {
    const conditionalCostRevealMatch =
      /^Reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+deck\.\s*If\s+the\s+revealed\s+card\s+has\s+a\s+cost\s+of\s+(\d+)\s+or\s+(less|more),\s*(.+?)\.\s*Then,\s*place\s+the\s+revealed\s+card\s+at\s+the\s+(bottom|top)\s+of\s+your\s+deck$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (conditionalCostRevealMatch) {
      const followUp = parseActions(conditionalCostRevealMatch[3]!);
      if (followUp.parsed.length > 0 && !followUp.unparsed) {
        preParsed.push({
          action: "revealTopDeckCard",
          player: "self",
          conditional: {
            filters: [
              {
                filter: "cost",
                comparison: parseComparison(conditionalCostRevealMatch[2]),
                value: parseInt(conditionalCostRevealMatch[1]!, 10),
              },
            ],
            actions: followUp.parsed,
            finalPosition: conditionalCostRevealMatch[4]!.toLowerCase() as "bottom" | "top",
          },
          // FAQ Q640: a failed cost condition leaves the revealed card on top.
          finalPosition: "top",
        });
        textAfterSearch = "";
      }
    }
  }

  if (preParsed.length === 0) {
    const revealTrait =
      /^Reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+deck\.\s*If\s+that\s+card\s+is\s+a\s+\{([^}]+)\}\s+type\s+card,\s*(.+)$/i.exec(
        textAfterSearch,
      );
    if (revealTrait) {
      const following = parseActions(revealTrait[2]!);
      if (following.parsed.length && !following.unparsed) {
        preParsed.push({
          action: "revealTopDeckCard",
          player: "self",
          finalPosition: "top",
          conditional: {
            filters: [{ filter: "trait", value: revealTrait[1]!, match: "exact" }],
            actions: following.parsed,
          },
        });
        textAfterSearch = "";
      }
    }
  }

  if (preParsed.length === 0) {
    const conditionalCharacterRevealMatch =
      /^Reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+deck\.\s*If\s+the\s+revealed\s+card\s+is\s+a\s+Character\s+card\s+with\s+(\d+)\s+power\s+or\s+more,\s*(.+?)\.\s*Then,\s*place\s+the\s+revealed\s+card\s+at\s+the\s+bottom\s+of\s+your\s+deck$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (conditionalCharacterRevealMatch) {
      const followUp = parseActions(conditionalCharacterRevealMatch[2]!).parsed;
      if (followUp.length > 0) {
        preParsed.push({
          action: "revealTopDeckCard",
          player: "self",
          conditional: {
            filters: [
              { filter: "cardCategory", value: "character" },
              {
                filter: "basePower",
                comparison: "gte",
                value: parseInt(conditionalCharacterRevealMatch[1]!, 10),
              },
            ],
            actions: followUp,
            finalPosition: "bottom",
          },
          finalPosition: "top",
        });
        textAfterSearch = "";
      }
    }
  }

  if (preParsed.length === 0) {
    const conditionalRevealMatch =
      /^Reveal\s+1\s+card\s+from\s+the\s+top\s+of\s+your\s+deck\.\s*If\s+(?:that|the\s+revealed)\s+card(?:[''\u2019]s)?\s+type\s+includes\s+["\u201c]([^"\u201d]+)["\u201d],\s*(.+)$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (conditionalRevealMatch) {
      const followUp = parseActions(conditionalRevealMatch[2]!).parsed;
      if (followUp.length > 0) {
        preParsed.push({
          action: "revealFromDeck",
          player: "self",
          count: 1,
          ifRevealedCardMatches: {
            filters: [
              {
                filter: "trait",
                value: conditionalRevealMatch[1]!,
                match: "includes",
              },
            ],
            actions: followUp,
          },
        });
        textAfterSearch = "";
      }
    }
  }

  // "Choose ... from your opponent's hand; reveal it. If the revealed card is a
  // category, ..." keeps the follow-up attached to the selected physical card.
  if (preParsed.length === 0) {
    const conditionalHandRevealMatch =
      /^(Choose\s+\d+\s+cards?\s+from\s+your\s+opponent[''\u2019]s\s+hand;\s*your\s+opponent\s+reveals?\s+(?:that|those)\s+cards?)\.\s*If\s+the\s+revealed\s+card\s+is\s+an?\s+(Character|Event|Stage),\s*(.+)$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (conditionalHandRevealMatch) {
      const reveal = parseChooseRevealAction(conditionalHandRevealMatch[1]!);
      const followUp = parseActions(conditionalHandRevealMatch[3]!).parsed;
      if (reveal && followUp.length > 0) {
        preParsed.push({
          ...reveal,
          ifRevealedCardMatches: {
            filters: [
              {
                filter: "cardCategory",
                value: conditionalHandRevealMatch[2]!.toLowerCase() as
                  | "character"
                  | "event"
                  | "stage",
              },
            ],
            actions: followUp,
          },
        });
        textAfterSearch = "";
      }
    }
  }

  const rearrangeThen = /^(.+?)\.\s*Then,\s*(.+)$/i.exec(textAfterSearch);
  if (rearrangeThen) {
    const rearrange = parseRearrangeDeckAction(rearrangeThen[1]!);
    const following = parseActions(rearrangeThen[2]!);
    if (rearrange && following.parsed.length && !following.unparsed) {
      preParsed.push(rearrange, ...following.parsed);
      textAfterSearch = "";
    }
  }

  // Preserve a successfully parsed leading action before a ". Then,"
  // rearrangeDeck continuation. The rearrange clause must stay intact because
  // its internal "and place" connector is part of the same action.
  const leadingThenRearrangeMatch = /^(.+?)\.\s*Then,\s*(.+)$/i.exec(textAfterSearch);
  if (leadingThenRearrangeMatch) {
    const leadingActions = parseActions(leadingThenRearrangeMatch[1]!);
    const rearrange = parseRearrangeDeckAction(leadingThenRearrangeMatch[2]!);
    if (leadingActions.parsed.length > 0 && !leadingActions.unparsed && rearrange) {
      preParsed.push(...leadingActions.parsed, rearrange);
      textAfterSearch = "";
    }
  }

  // Preserve an independent compound named-or-trait power continuation after
  // a leading action. Generic clause splitting would otherwise split the
  // compound subject at its printed `and`.
  const leadingThenCompoundPowerMatch = /^(.+?)\.\s*Then,\s*(all\s+of\s+your\s+.+)$/i.exec(
    textAfterSearch,
  );
  if (leadingThenCompoundPowerMatch) {
    const leadingActions = parseActions(leadingThenCompoundPowerMatch[1]!);
    const compoundPower = parseCompoundNamedTraitPower(leadingThenCompoundPowerMatch[2]!);
    if (leadingActions.parsed.length > 0 && !leadingActions.unparsed && compoundPower) {
      preParsed.push(...leadingActions.parsed, ...compoundPower);
      textAfterSearch = "";
    }
  }

  // Try rearrangeDeck on the full text BEFORE splitting — it spans "Look at ... and place ..."
  const rearrangePreParse = parseRearrangeDeckAction(textAfterSearch);
  if (rearrangePreParse) {
    textAfterSearch = "";
    preParsed.push(rearrangePreParse);
  }

  // Try compound return patterns BEFORE splitting — they share a destination
  // "Return up to 1 X and up to 1 Y to the owner's hand"
  if (!rearrangePreParse) {
    const compoundReturn = parseCompoundReturnToHand(textAfterSearch);
    if (compoundReturn) {
      textAfterSearch = "";
      preParsed.push(...compoundReturn);
    } else {
      const compoundDeck = parseCompoundReturnToDeck(textAfterSearch);
      if (compoundDeck) {
        textAfterSearch = "";
        preParsed.push(...compoundDeck);
      } else {
        // Compound named + trait power: "your [Name] and all your Characters
        // with a type including "Trait" gain +N power"
        const compoundNamedTraitPower = parseCompoundNamedTraitPower(textAfterSearch);
        if (compoundNamedTraitPower) {
          textAfterSearch = "";
          preParsed.push(...compoundNamedTraitPower);
        } else {
          // Compound keyword + power: "gains [Keyword] and +N power"
          const compoundKwPow = parseCompoundKeywordPower(textAfterSearch);
          if (compoundKwPow) {
            textAfterSearch = "";
            preParsed.push(...compoundKwPow);
          } else {
            const compoundKwCost = parseCompoundKeywordCost(textAfterSearch);
            if (compoundKwCost) {
              textAfterSearch = "";
              preParsed.push(...compoundKwCost);
            } else {
              const compoundPowerCost = parseCompoundPowerCost(textAfterSearch);
              if (compoundPowerCost) {
                textAfterSearch = "";
                preParsed.push(...compoundPowerCost);
              }
            }
          }
        }
      }
    }
  }

  // Keep the shared verb across "Rest this Character and up to N ..." before
  // generic clause splitting separates the second target from "Rest".
  if (preParsed.length === 0) {
    const compoundRest = parseCompoundRestActions(textAfterSearch);
    if (compoundRest) {
      textAfterSearch = "";
      preParsed.push(...compoundRest);
    }
  }

  // "Set <Characters> and up to N of your Leader as active" must stay intact —
  // generic "and up to" splitting would orphan the Leader half.
  if (preParsed.length === 0) {
    const compoundSetActive = parseCompoundSetActiveActions(textAfterSearch);
    if (compoundSetActive) {
      textAfterSearch = "";
      preParsed.push(...compoundSetActive);
    }
  }

  // Split remaining text into clauses
  const clauses = textAfterSearch ? splitActionClauses(textAfterSearch) : [];

  const parsed: Action[] = [];
  const unparsedClauses: string[] = [];

  for (let clause of clauses) {
    const trashFromDeckIsOptional =
      /^you\s+may\s+trash\s+\d+\s+cards?\s+from\s+the\s+top\s+of\s+(?:your|your\s+opponent's)\s+deck/i.test(
        clause,
      );

    // Strip "you may" prefix and trailing punctuation from individual clauses
    clause = clause
      .replace(/^you\s+may\s+/i, "")
      .replace(/[,;]+$/, "")
      .trim();
    if (!clause) continue;

    if (
      /^at\s+the\s+end\s+of\s+this\s+turn,?\s+return\s+DON!!\s+cards?\s+from\s+your\s+field\s+to\s+your\s+DON!!\s+deck\s+until\s+you\s+have\s+the\s+same\s+number\s+of\s+DON!!\s+cards?\s+on\s+your\s+field\s+as\s+your\s+opponent\.?$/i.test(
        clause,
      )
    ) {
      parsed.push({
        action: "delayed",
        timing: "endOfThisTurn",
        actions: [
          {
            action: "returnDon",
            player: "self",
            amount: 0,
            untilSameCountAsOpponent: true,
          },
        ],
      });
      continue;
    }

    // Strip "choose" prefix: "choose up to 1 ..." → "up to 1 ..."
    // This handles split-up patterns where "and K.O. it" was already split away
    clause = clause.replace(/^choose\s+(?=up\s+to\s+\d+|all\s+|\d+\s+of\s+)/i, "").trim();

    const lookAtTopDeckCardMatch =
      /^look\s+at\s+1\s+card\s+from\s+the\s+top\s+of\s+(your\s+opponent[''\u2019]s|your)\s+deck$/i.exec(
        clause,
      );
    if (lookAtTopDeckCardMatch) {
      parsed.push({
        action: "lookAtTopDeckCard",
        player: /opponent/i.test(lookAtTopDeckCardMatch[1]!) ? "opponent" : "self",
      });
      continue;
    }

    const conditionalClause = /^if\s+(.+?),\s*(.+)$/i.exec(clause);
    if (conditionalClause) {
      const condition = parseConditionText(conditionalClause[1]!);
      const followUp = parseActions(conditionalClause[2]!);
      if (condition && followUp.parsed.length > 0 && !followUp.unparsed) {
        parsed.push(
          ...followUp.parsed.map(
            (action): Action =>
              ({
                ...action,
                condition,
              }) as Action,
          ),
        );
        continue;
      }
    }

    const compoundKeywordPower = parseCompoundKeywordPower(clause);
    if (compoundKeywordPower) {
      parsed.push(...compoundKeywordPower);
      continue;
    }

    const draw = parseDrawAction(clause);
    if (draw) {
      parsed.push(draw);
      continue;
    }

    // The continuation refers to the Character chosen for Rest, not a second target.
    const restAndFreeze =
      /^(rest\s+.+?)\s+and\s+that\s+Character\s+will\s+not\s+become\s+active\s+in\s+your\s+opponent['’]s\s+next\s+Refresh\s+Phase$/i.exec(
        clause,
      );
    if (restAndFreeze) {
      const rest = parseRestAction(restAndFreeze[1]!);
      if (rest) {
        parsed.push(rest, { action: "freeze", target: rest.target, previousActionTargets: true });
        continue;
      }
    }

    const compoundRest = parseCompoundRestActions(clause);
    if (compoundRest) {
      parsed.push(...compoundRest);
      continue;
    }

    const rest = parseRestAction(clause);
    if (rest) {
      parsed.push(rest);
      continue;
    }

    const compoundSetActive = parseCompoundSetActiveActions(clause);
    if (compoundSetActive) {
      parsed.push(...compoundSetActive);
      continue;
    }

    const setActive = parseSetActiveAction(clause);
    if (setActive) {
      parsed.push(
        /\s+at\s+the\s+end\s+of\s+this\s+turn\.?$/i.test(clause)
          ? {
              action: "delayed",
              timing: "endOfThisTurn",
              actions: [setActive],
            }
          : setActive,
      );
      continue;
    }

    const ko =
      parseKoAction(clause) ??
      (parsed.at(-1)?.action === "ko" && /^up\s+to\s+\d+\s+of\s+your\s+opponent/i.test(clause)
        ? parseKoAction(`K.O. ${clause}`)
        : null);
    if (ko) {
      parsed.push(ko);
      continue;
    }

    const giveDon = parseGiveDonAction(clause);
    if (giveDon) {
      parsed.push(...(Array.isArray(giveDon) ? giveDon : [giveDon]));
      continue;
    }

    const modCost = parseModifyCostAction(clause);
    if (modCost) {
      parsed.push(modCost);
      continue;
    }

    const grantKeywordChoice = parseGrantKeywordChoiceAction(clause);
    if (grantKeywordChoice) {
      parsed.push(grantKeywordChoice);
      continue;
    }

    const grantKw = parseGrantKeywordAction(clause);
    if (grantKw) {
      parsed.push(grantKw);
      continue;
    }

    const eachModPower = parseEachModifyPowerActions(clause);
    if (eachModPower) {
      parsed.push(...eachModPower);
      continue;
    }

    const groupedStats = parseGroupedPowerAndCostActions(clause);
    if (groupedStats) {
      parsed.push(...groupedStats);
      continue;
    }
    const modPower = parseModifyPowerAction(clause);
    if (modPower) {
      parsed.push(modPower);
      continue;
    }

    const bothPlayersTrashUntil = parseBothPlayersTrashUntilHandSize(clause);
    if (bothPlayersTrashUntil) {
      parsed.push(...bothPlayersTrashUntil);
      continue;
    }

    const trashHand = parseTrashFromHandAction(clause);
    if (trashHand) {
      parsed.push(trashHand);
      continue;
    }

    // Must run before parseTrashFromFieldAction — "trash this Character" is a specific
    // self-trash that takes precedence over the general field-trash parser.
    const trashSelf = parseTrashThisCardAction(clause);
    if (trashSelf) {
      parsed.push(
        /\s+at\s+the\s+end\s+of\s+this\s+turn\.?$/i.test(clause)
          ? {
              action: "delayed",
              timing: "endOfThisTurn",
              actions: [trashSelf],
            }
          : trashSelf,
      );
      continue;
    }

    const endOfTurnTrash = /\s+at\s+the\s+end\s+of\s+this\s+turn\.?$/i.test(clause);
    const trashField = parseTrashFromFieldAction(
      endOfTurnTrash ? clause.replace(/\s+at\s+the\s+end\s+of\s+this\s+turn\.?$/i, "") : clause,
    );
    if (trashField) {
      parsed.push(
        endOfTurnTrash
          ? {
              action: "delayed",
              timing: "endOfThisTurn",
              actions: [trashField],
            }
          : trashField,
      );
      continue;
    }

    const returnHand = parseReturnToHandAction(clause);
    if (returnHand) {
      parsed.push(returnHand);
      continue;
    }

    const addThisCardToHand = parseAddThisCardToHandAction(clause);
    if (addThisCardToHand) {
      parsed.push(addThisCardToHand);
      continue;
    }

    const addFromTrash = parseAddFromTrashToHandAction(clause);
    if (addFromTrash) {
      parsed.push(addFromTrash);
      continue;
    }

    const returnDeck = parseReturnToDeckAction(clause);
    if (returnDeck) {
      parsed.push(returnDeck);
      continue;
    }

    const play = parsePlayAction(clause);
    if (play) {
      parsed.push(play);
      continue;
    }

    const addDonAtEndOfTurn = /\s+at\s+the\s+end\s+of\s+this\s+turn\.?$/i.test(clause);
    const addDon = parseAddDonAction(
      addDonAtEndOfTurn ? clause.replace(/\s+at\s+the\s+end\s+of\s+this\s+turn\.?$/i, "") : clause,
    );
    if (addDon) {
      parsed.push(
        addDonAtEndOfTurn
          ? { action: "delayed", timing: "endOfThisTurn", actions: [addDon] }
          : addDon,
      );
      continue;
    }

    const addLifeAtEndOfTurn = /\s+at\s+the\s+end\s+of\s+this\s+turn\.?$/i.test(clause);
    const addLife = parseAddToLifeAction(
      addLifeAtEndOfTurn ? clause.replace(/\s+at\s+the\s+end\s+of\s+this\s+turn\.?$/i, "") : clause,
    );
    if (addLife) {
      parsed.push(
        addLifeAtEndOfTurn
          ? { action: "delayed", timing: "endOfThisTurn", actions: [addLife] }
          : addLife,
      );
      continue;
    }

    const turnLifeFaceUp = parseTurnLifeFaceUpAction(clause);
    if (turnLifeFaceUp) {
      parsed.push(turnLifeFaceUp);
      continue;
    }

    const removeLife = parseRemoveFromLifeAction(clause);
    if (removeLife) {
      parsed.push(removeLife);
      continue;
    }

    const trashDeck = parseTrashFromDeckAction(clause);
    if (trashDeck) {
      parsed.push(
        trashFromDeckIsOptional
          ? {
              action: "optional",
              actions: [trashDeck],
            }
          : trashDeck,
      );
      continue;
    }

    const rearrange = parseRearrangeDeckAction(clause);
    if (rearrange) {
      parsed.push(rearrange);
      continue;
    }

    const canAttackActive = parseCanAttackActiveAction(clause);
    if (canAttackActive) {
      parsed.push(canAttackActive);
      continue;
    }

    const cannotActivate = parseCannotActivateAction(clause);
    if (cannotActivate) {
      parsed.push(cannotActivate);
      continue;
    }

    const placeHandToDeck = parsePlaceFromHandToDeckAction(clause);
    if (placeHandToDeck) {
      parsed.push(placeHandToDeck);
      continue;
    }

    const cannotBeKod = parseCannotBeKodAction(clause);
    if (cannotBeKod) {
      parsed.push(cannotBeKod);
      continue;
    }

    const cannotBePlayedByEffects = parseCannotBePlayedByEffectsAction(clause);
    if (cannotBePlayedByEffects) {
      parsed.push(cannotBePlayedByEffects);
      continue;
    }

    const cannotDraw = parseCannotDrawAction(clause);
    if (cannotDraw) {
      parsed.push(cannotDraw);
      continue;
    }

    const cannotSetDonActive = parseCannotSetDonActiveAction(clause);
    if (cannotSetDonActive) {
      parsed.push(cannotSetDonActive);
      continue;
    }

    const cannotAttackTargets = parseCannotAttackTargetsAction(clause);
    if (cannotAttackTargets) {
      parsed.push(cannotAttackTargets);
      continue;
    }

    const cannotBeRemoved = parseCannotBeRemovedAction(clause);
    if (cannotBeRemoved) {
      parsed.push(cannotBeRemoved);
      continue;
    }

    const setPower = parseSetPowerAction(clause);
    if (setPower) {
      parsed.push(setPower);
      continue;
    }

    const freeze = parseFreezeAction(clause);
    if (freeze) {
      parsed.push(freeze);
      continue;
    }

    const cannotBeRested = parseCannotBeRestedAction(clause);
    if (cannotBeRested) {
      parsed.push(cannotBeRested);
      continue;
    }

    const playRestriction = parsePlayRestrictionAction(clause);
    if (playRestriction) {
      parsed.push(playRestriction);
      continue;
    }

    const opponentReturnDon = parseOpponentReturnDonAction(clause);
    if (opponentReturnDon) {
      parsed.push(opponentReturnDon);
      continue;
    }

    const negateEffects = parseNegateEffectsAction(clause);
    if (negateEffects) {
      parsed.push(...(Array.isArray(negateEffects) ? negateEffects : [negateEffects]));
      continue;
    }

    const cannotAttack = parseCannotAttackAction(clause);
    if (cannotAttack) {
      parsed.push(cannotAttack);
      continue;
    }

    const activateEffect = parseActivateEffectAction(clause);
    if (activateEffect) {
      parsed.push(activateEffect);
      continue;
    }

    const extraTurn = parseExtraTurnAction(clause);
    if (extraTurn) {
      parsed.push(extraTurn);
      continue;
    }

    const dealDamage = parseDealDamageAction(clause);
    if (dealDamage) {
      parsed.push(dealDamage);
      continue;
    }

    const redistributeDon = parseRedistributeDonAction(clause);
    if (redistributeDon) {
      parsed.push(redistributeDon);
      continue;
    }

    const costReduction = parseCostReductionAction(clause);
    if (costReduction) {
      parsed.push(costReduction);
      continue;
    }

    const opponentTrash = parseOpponentChosenTrashAction(clause);
    if (opponentTrash) {
      parsed.push(opponentTrash);
      continue;
    }

    const shuffleDeck = parseShuffleDeckAction(clause);
    if (shuffleDeck) {
      parsed.push(shuffleDeck);
      continue;
    }

    const chooseReveal = parseChooseRevealAction(clause);
    if (chooseReveal) {
      parsed.push(chooseReveal);
      continue;
    }

    const drawTo = parseDrawToAction(clause);
    if (drawTo) {
      parsed.push(drawTo);
      continue;
    }

    const activateInZone = parseActivateEffectInZoneAction(clause);
    if (activateInZone) {
      parsed.push(activateInZone);
      continue;
    }

    const attackRestriction = parseAttackRestrictionAction(clause);
    if (attackRestriction) {
      parsed.push(attackRestriction);
      continue;
    }

    const drawWithCond = parseDrawWithConditionAction(clause);
    if (drawWithCond) {
      parsed.push(drawWithCond);
      continue;
    }

    const opponentAction = parseOpponentAction(clause);
    if (opponentAction) {
      parsed.push(opponentAction);
      continue;
    }

    const revealEntireHand = parseRevealEntireHandAction(clause);
    if (revealEntireHand) {
      parsed.push(revealEntireHand);
      continue;
    }

    const revealDeck = parseRevealFromDeckAction(clause);
    if (revealDeck) {
      parsed.push(revealDeck);
      continue;
    }

    // "you win the game"
    if (/^you\s+win\s+the\s+game$/i.test(clause.trim().replace(/\.+$/, ""))) {
      parsed.push({ action: "winGame" });
      continue;
    }

    unparsedClauses.push(clause);
  }

  return {
    parsed: [...preParsed, ...parsed],
    unparsed: unparsedClauses.join(" and "),
  };
}

/**
 * Split on " and " when followed by a verb-like word (action boundary).
 * "rest it/them" and "set it/them" are excluded (part of AddDon "and rest it" patterns).
 */
function splitAndClauses(text: string): string[] {
  const andParts = text.split(
    /(?:,\s+and\s+(?=all\s+of\b)|,?\s+and\s+(?=(?:(?:you\s+may\s+)?(?:draw|trash|reveal|reveals|rest(?!\s+(?:it|them)\b)|play|return|give|set(?!\s+(?:it|them)\b)|add|place|look|up\s+to|this|cannot|negate|activate|gains?\b|your\s+opponent\s+returns|your\s+Leader\s+gains?\b|take|shuffle)\b|k\.o\.)))/i,
  );
  const clauses: string[] = [];
  for (const ap of andParts) {
    const trimmed = ap.trim().replace(/\.+$/, "");
    if (trimmed) clauses.push(trimmed);
  }
  return clauses;
}

function splitActionClauses(text: string): string[] {
  // Split on ". Then, ", ", then ", " and then " first
  const thenParts = text.split(/(?:\.\s*Then,\s*|,\s+then\s+|\s+and\s+then\s+)/i);
  const sentenceParts: string[] = [];
  for (const tp of thenParts) {
    // Split on ". This Character/Leader/Stage", ". If", and pronoun continuations
    // such as ". It gains +1000 power during this turn".
    sentenceParts.push(
      ...tp.split(
        /\.\s+(?=(?:This\s+(?:Character|Leader|Stage)|If\s+(?:the|you|your|that|this|there)|It\s+gains?\b|That\s+(?:card|Character|Leader)\s+gains?\b)\s)/i,
      ),
    );
  }
  const clauses: string[] = [];
  for (const part of sentenceParts) {
    clauses.push(...splitAndClauses(part));
  }
  return clauses;
}
