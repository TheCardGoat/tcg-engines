import type { Action, Comparison, TargetFilter, Zone } from "@tcg/op-types";
import type { ParseActionsResult } from "../types.ts";
import { parseTarget, parseModifyPowerTarget, extractTargetFilters } from "../target-parser.ts";
import { parseZoneList } from "../helpers.ts";
import { parseConditionText } from "../condition-parser/index.ts";

import {
  parseDrawAction,
  parseTrashFromHandAction,
  parseOpponentChosenTrashAction,
  parseChooseRevealAction,
  parseDrawToAction,
  parseDrawWithConditionAction,
} from "./draw-hand.ts";
import {
  parseKoAction,
  parseCompoundKoAction,
  parseRestAction,
  parseSetActiveAction,
  parseFreezeAction,
  parseTrashFromFieldAction,
  parseTrashThisCardAction,
  parsePlayAction,
  parseCompoundPlayAction,
} from "./field.ts";
import {
  parseReturnToHandAction,
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
  parseRemoveFromLifeAction,
  parsePlaceCharacterToLifeAction,
  parseLifeCardLookAction,
} from "./life.ts";
import {
  parseModifyPowerAction,
  parseSetPowerAction,
  parseModifyCostAction,
  parseCostReductionAction,
  parseGrantKeywordAction,
  parseCompoundKeywordPower,
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
  parseCannotBeKodAction,
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

  // Strip "Choose a cost and reveal 1 card from your opponent's deck. If the revealed card has the chosen cost, " prefix
  text = text.replace(
    /^choose\s+a\s+cost\s+and\s+reveal\s+\d+\s+cards?\s+from\s+the\s+top\s+of\s+your\s+opponent[''\u2019]s\s+deck\.\s*If\s+the\s+revealed\s+card\s+has\s+the\s+chosen\s+cost,\s*/i,
    "",
  );

  // Strip trailing "shuffle your deck" — it's a game-state cleanup, not a parseable action
  text = text
    .replace(/\.?\s*Then,?\s+shuffle\s+your\s+deck\.?$/i, "")
    .replace(/[.,]?\s+(?:and\s+)?then\s+shuffle\s+your\s+deck\.?$/i, "")
    .replace(/[.,]?\s+and\s+shuffle\s+your\s+deck\.?$/i, "")
    .trim()
    .replace(/[.,]+$/, "")
    .trim();

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
    text = text.slice(addDonPrefixMatch[0].length).trim();
  }

  // Try search action on the full text BEFORE any splitting.
  // Search actions span across ". Then, " and "and" connectors that would
  // otherwise be split apart (e.g., "add it to your hand. Then, place the rest...").
  const preParsed: Action[] = [...addDonPreAction];
  let textAfterSearch = text;
  const search = parseSearchAction(text);
  if (search) {
    preParsed.push(search.action);
    textAfterSearch = search.remaining;
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

  // Try "Rest up to N DON!! cards or {Trait} type Characters" compound rest pre-parse
  if (preParsed.length === 0) {
    const compoundRestMatch =
      /^rest\s+(?:up\s+to\s+)?(\d+)\s+of\s+your\s+opponent[''\u2019]s\s+DON!!\s+cards?\s+or\s+(.+)$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (compoundRestMatch) {
      const amount = parseInt(compoundRestMatch[1]!, 10);
      const target2 = parseTarget(
        "up to " + amount + " of your opponent's " + compoundRestMatch[2]!,
      );
      if (target2) {
        preParsed.push({
          action: "choice",
          options: [
            [
              {
                action: "rest",
                target: {
                  player: "opponent",
                  zones: ["costArea" as Zone],
                  count: { amount, upTo: true },
                },
              },
            ],
            [{ action: "rest", target: target2 }],
          ],
        });
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
      preParsed.push({ action: "draw", player: "self" as const, amount: 0 }); // 0 = dynamic amount
      if (/trash\s+the\s+same/i.test(textAfterSearch)) {
        preParsed.push({ action: "trashFromHand", player: "self" as const, amount: 0 });
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
      preParsed.push(
        {
          action: "play",
          source: { player: "self" as const, zone: source },
          count: { amount: 1, upTo: true },
          filters: filters1.length > 0 ? filters1 : undefined,
        } as Action,
        {
          action: "play",
          source: { player: "self" as const, zone: source },
          count: { amount: 1, upTo: true },
          filters: filters2.length > 0 ? filters2 : undefined,
          playState: "rested" as const,
        } as Action,
      );
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

  // Try "Place N of ... at the top or bottom of ... Life cards face-up: action"
  if (preParsed.length === 0) {
    const placeToLifeColonMatch =
      /^Place\s+(\d+)\s+of\s+(your\s+opponent[''\u2019]s)\s+(.+?)\s+at\s+the\s+(top\s+or\s+bottom|top|bottom)\s+of\s+(?:your\s+opponent[''\u2019]s|the\s+owner[''\u2019]s)\s+Life\s+cards?\s*(?:face-up)?[:.]\s*(.+)$/i.exec(
        textAfterSearch.trim().replace(/\.+$/, ""),
      );
    if (placeToLifeColonMatch) {
      const amount = parseInt(placeToLifeColonMatch[1]!, 10);
      const { filters } = extractTargetFilters(placeToLifeColonMatch[3]!);
      const zones = parseZoneList(placeToLifeColonMatch[3]!.replace(/\s+with\s+.+$/i, ""));
      const faceUp = /face-up/i.test(textAfterSearch);
      preParsed.push({
        action: "addToLife",
        target: {
          player: "opponent" as const,
          zones: zones ?? ["character"],
          count: { amount },
          ...(filters.length > 0 && { filters }),
        },
        position: "top" as const,
        ...(faceUp && { faceUp: true }),
      } as Action);
      // Parse remaining action after colon
      const remaining = placeToLifeColonMatch[5]!;
      const followUp = parseActions(remaining);
      if (followUp.parsed.length > 0) {
        preParsed.push(...followUp.parsed);
      }
      textAfterSearch = "";
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
        amount: 0, // dynamic
        filters: [{ filter: "trait", value: trashForPowerMatch[1]! }],
      } as Action);
      const targetText = trashForPowerMatch[2]!;
      const target = parseTarget(targetText) ?? parseModifyPowerTarget(targetText);
      if (target) {
        preParsed.push({
          action: "modifyPower",
          target,
          value: parseInt(trashForPowerMatch[3]!, 10),
          duration: parseFullDuration(trashForPowerMatch[4]!),
        } as Action);
      }
      textAfterSearch = "";
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
          action: "choice",
          options: [[trashAction], elseActions],
        } as Action);
        textAfterSearch = "";
      }
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
        // Compound keyword + power: "gains [Keyword] and +N power"
        const compoundKwPow = parseCompoundKeywordPower(textAfterSearch);
        if (compoundKwPow) {
          textAfterSearch = "";
          preParsed.push(...compoundKwPow);
        }
      }
    }
  }

  // Split remaining text into clauses
  const clauses = textAfterSearch ? splitActionClauses(textAfterSearch) : [];

  const parsed: Action[] = [];
  const unparsedClauses: string[] = [];

  for (let clause of clauses) {
    // Strip "you may" prefix and trailing punctuation from individual clauses
    clause = clause
      .replace(/^you\s+may\s+/i, "")
      .replace(/[,;]+$/, "")
      .trim();
    if (!clause) continue;

    // Strip "choose" prefix: "choose up to 1 ..." → "up to 1 ..."
    // This handles split-up patterns where "and K.O. it" was already split away
    clause = clause.replace(/^choose\s+(?=up\s+to\s+\d+|all\s+|\d+\s+of\s+)/i, "").trim();

    const draw = parseDrawAction(clause);
    if (draw) {
      parsed.push(draw);
      continue;
    }

    const rest = parseRestAction(clause);
    if (rest) {
      parsed.push(rest);
      continue;
    }

    const setActive = parseSetActiveAction(clause);
    if (setActive) {
      parsed.push(setActive);
      continue;
    }

    const ko = parseKoAction(clause);
    if (ko) {
      parsed.push(ko);
      continue;
    }

    const giveDon = parseGiveDonAction(clause);
    if (giveDon) {
      parsed.push(giveDon);
      continue;
    }

    const modCost = parseModifyCostAction(clause);
    if (modCost) {
      parsed.push(modCost);
      continue;
    }

    const grantKw = parseGrantKeywordAction(clause);
    if (grantKw) {
      parsed.push(grantKw);
      continue;
    }

    const modPower = parseModifyPowerAction(clause);
    if (modPower) {
      parsed.push(modPower);
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
      parsed.push(trashSelf);
      continue;
    }

    const trashField = parseTrashFromFieldAction(clause);
    if (trashField) {
      parsed.push(trashField);
      continue;
    }

    const returnHand = parseReturnToHandAction(clause);
    if (returnHand) {
      parsed.push(returnHand);
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

    const addDon = parseAddDonAction(clause);
    if (addDon) {
      parsed.push(addDon);
      continue;
    }

    const addLife = parseAddToLifeAction(clause);
    if (addLife) {
      parsed.push(addLife);
      continue;
    }

    const removeLife = parseRemoveFromLifeAction(clause);
    if (removeLife) {
      parsed.push(removeLife);
      continue;
    }

    const trashDeck = parseTrashFromDeckAction(clause);
    if (trashDeck) {
      parsed.push(trashDeck);
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
      parsed.push(negateEffects);
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
    /,?\s+and\s+(?=(?:(?:you\s+may\s+)?(?:draw|trash|rest(?!\s+(?:it|them)\b)|play|return|give|set(?!\s+(?:it|them)\b)|add|place|look|up\s+to|this|cannot|negate|activate|gains?\b|your\s+opponent\s+returns|your\s+Leader\s+gains?\b|take|shuffle)\b|k\.o\.))/i,
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
    // Split on ". This Character/Leader/Stage" and ". If"
    sentenceParts.push(
      ...tp.split(
        /\.\s+(?=(?:This\s+(?:Character|Leader|Stage)|If\s+(?:the|you|your|that|this|there))\s)/i,
      ),
    );
  }
  const clauses: string[] = [];
  for (const part of sentenceParts) {
    clauses.push(...splitAndClauses(part));
  }
  return clauses;
}
