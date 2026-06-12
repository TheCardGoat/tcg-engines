import type { Action, TargetFilter, Zone } from "@tcg/op-types";
import { KEYWORD_BRACKET_TO_TYPE, TRIGGER_MAP_ACTIVATE } from "../constants.ts";
import { parseComparison, parseZoneList } from "../helpers.ts";
import { extractTargetFilters } from "../target-parser.ts";
import { parseFullDuration } from "./helpers.ts";

type ActivateEffectAction = Extract<Action, { action: "activateEffect" }>;

type ExtraTurnAction = Extract<Action, { action: "extraTurn" }>;

type DealDamageAction = Extract<Action, { action: "dealDamage" }>;

type RestAction = Extract<Action, { action: "rest" }>;
type ReturnToHandAction = Extract<Action, { action: "returnToHand" }>;
type ReturnToDeckAction = Extract<Action, { action: "returnToDeck" }>;
type RemoveFromLifeAction = Extract<Action, { action: "removeFromLife" }>;

/**
 * Parse "Activate this card's [Trigger] effect"
 */
export function parseActivateEffectAction(text: string): ActivateEffectAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  const match = /^activate\s+this\s+card[''\u2019]s\s+\[([^\]]+)\]\s+effect$/i.exec(trimmed);
  if (!match) return null;

  const trigger = TRIGGER_MAP_ACTIVATE[match[1]!.toLowerCase()];
  if (!trigger) return null;

  return { action: "activateEffect", effectTrigger: trigger };
}

export function parseActivateEffectInZoneAction(text: string): ActivateEffectAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "activate the [Main] effect of up to 1 Event card with a cost of 7 or less in your trash"
  const m =
    /^activate\s+the\s+\[([^\]]+)\]\s+effect\s+of\s+(?:up\s+to\s+)?(\d+)\s+(.+?)\s+in\s+your\s+(trash|hand|deck)$/i.exec(
      trimmed,
    );
  if (!m) return null;

  const trigger = TRIGGER_MAP_ACTIVATE[m[1]!.toLowerCase()];
  if (!trigger) return null;

  return { action: "activateEffect", effectTrigger: trigger };
}

export function parseExtraTurnAction(text: string): ExtraTurnAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  if (/^take an extra turn after this one$/i.test(trimmed)) {
    return { action: "extraTurn" };
  }
  return null;
}

export function parseDealDamageAction(text: string): DealDamageAction | null {
  const trimmed = text.trim().replace(/\.+$/, "");
  const match = /^(?:you may )?deal\s+(\d+)\s+damage\s+to\s+your\s+opponent$/i.exec(trimmed);
  if (!match) return null;
  return { action: "dealDamage", player: "opponent", amount: parseInt(match[1]!, 10) };
}

export function parseSelectAction(text: string): Action[] | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Select up to N of your/opponent's Characters [with filters]. The selected Character(s) cannot attack during this turn"
  const selectCannotAttackMatch =
    /^select\s+(?:up\s+to\s+)?(\d+)\s+(?:of\s+)?(your(?:\s+opponent[''\u2019]s)?)\s+(.+?)\.\s+The\s+selected\s+Characters?\s+cannot\s+attack(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (selectCannotAttackMatch) {
    const amount = parseInt(selectCannotAttackMatch[1]!, 10);
    const upTo = /^select\s+up\s+to/i.test(trimmed);
    const player = /opponent/i.test(selectCannotAttackMatch[2]!) ? "opponent" : "self";
    const filterText = selectCannotAttackMatch[3]!;
    const { zonesText, filters } = extractTargetFilters(filterText);
    const zones = parseZoneList(zonesText) || ["character"];
    const duration = selectCannotAttackMatch[4]
      ? parseFullDuration(selectCannotAttackMatch[4])
      : "thisTurn";

    return [
      {
        action: "cannotAttack",
        target: {
          player: player as "self" | "opponent",
          zones: zones as Zone[],
          count: { amount, ...(upTo && { upTo: true }) },
          ...(filters.length > 0 && { filters }),
        },
        duration,
      },
    ];
  }

  // "Select up to N of your Characters. The selected Character cannot be K.O.'d during this battle"
  const selectCannotKoMatch =
    /^select\s+(?:up\s+to\s+)?(\d+)\s+(?:of\s+)?(your(?:\s+opponent[''\u2019]s)?)\s+(.+?)\.\s+The\s+selected\s+Characters?\s+cannot\s+be\s+K\.O\.\u2019?'?d(?:\s+(in\s+battle|by\s+(?:your\s+opponent[''\u2019]s\s+)?effects?))?\s*(?:during\s+this\s+(turn|battle))?$/i.exec(
      trimmed,
    );
  if (selectCannotKoMatch) {
    const amount = parseInt(selectCannotKoMatch[1]!, 10);
    const upTo = /^select\s+up\s+to/i.test(trimmed);
    const player = /opponent/i.test(selectCannotKoMatch[2]!) ? "opponent" : "self";
    const filterText = selectCannotKoMatch[3]!;
    const { zonesText, filters } = extractTargetFilters(filterText);
    const zones = parseZoneList(zonesText) || ["character"];
    const restrictionText = selectCannotKoMatch[4]?.toLowerCase();
    const restriction: "inBattle" | "byEffect" | undefined = restrictionText
      ? restrictionText.startsWith("in")
        ? "inBattle"
        : "byEffect"
      : undefined;
    const duration = selectCannotKoMatch[5]
      ? selectCannotKoMatch[5].toLowerCase() === "battle"
        ? "thisBattle"
        : "thisTurn"
      : "thisBattle";

    return [
      {
        action: "cannotBeKod",
        target: {
          player: player as "self" | "opponent",
          zones: zones as Zone[],
          count: { amount, ...(upTo && { upTo: true }) },
          ...(filters.length > 0 && { filters }),
        },
        duration,
        ...(restriction && { restriction }),
      },
    ];
  }

  // "Select ... rested Leader and up to 1 Character card. The selected cards will not become active in ..."
  const selectFreezeMatch =
    /^select\s+(?:your\s+opponent[''\u2019]s\s+rested\s+Leader\s+and\s+)?(?:up\s+to\s+)?(\d+)\s+(.+?)\.\s+The\s+selected\s+cards?\s+will\s+not\s+become\s+active\s+in\s+your\s+opponent[''\u2019]s\s+next\s+Refresh\s+Phase$/i.exec(
      trimmed,
    );
  if (selectFreezeMatch) {
    const hasLeader = /rested\s+Leader\s+and/i.test(trimmed);
    const zones: Zone[] = hasLeader ? ["leader", "character"] : ["character"];
    return [
      {
        action: "freeze",
        target: {
          player: "opponent",
          zones,
          count: {
            amount: hasLeader
              ? parseInt(selectFreezeMatch[1]!, 10) + 1
              : parseInt(selectFreezeMatch[1]!, 10),
            upTo: true,
          },
          filters: [{ filter: "state", value: "rested" as const }],
        },
      },
    ];
  }

  // "Select ... Characters. The selected Character(s) gains +N power during this turn. Then, if the selected card attacks ..., opponent cannot activate [Blocker]"
  const selectGainPowerOnlyMatch =
    /^select\s+(?:up\s+to\s+)?(\d+)\s+(?:of\s+)?(your(?:\s+opponent[''\u2019]s)?)\s+(.+?)\.\s+If\s+the\s+selected\s+(?:Character|card)\s+attacks?\s+during\s+this\s+turn,\s+your\s+opponent\s+cannot\s+activate\s+\[([^\]]+)\]$/i.exec(
      trimmed,
    );
  if (selectGainPowerOnlyMatch) {
    const keyword = KEYWORD_BRACKET_TO_TYPE[selectGainPowerOnlyMatch[4]!.toLowerCase()];
    const actions: Action[] = [];
    if (keyword) {
      actions.push({
        action: "cannotActivate",
        target: { player: "opponent", zones: ["character"], count: { amount: "all" } },
        keyword,
        duration: "thisTurn",
      });
    }
    return actions.length > 0 ? actions : null;
  }

  // "Select up to N of your opponent's Characters. This Character's base power becomes the same as the selected Character's power during this turn."
  const selectSetPowerMatch =
    /^select\s+(?:up\s+to\s+)?(\d+)\s+(?:of\s+)?(your(?:\s+opponent[''\u2019]s)?)\s+(.+?)\.\s+This\s+Character[''\u2019]s\s+base\s+power\s+becomes\s+the\s+same\s+as\s+the\s+selected\s+Character[''\u2019]s\s+power(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (selectSetPowerMatch) {
    const duration = selectSetPowerMatch[4]
      ? parseFullDuration(selectSetPowerMatch[4])
      : "thisTurn";
    return [
      {
        action: "setPower",
        target: { player: "self", zones: ["character" as Zone], count: { amount: 1 }, self: true },
        value: 0, // Sentinel: "copy selected power"
        duration,
      },
    ];
  }

  // "Select up to 1 of your [Name] cards and that card gains +N power during this turn. Then, if the selected card attacks during this turn, your opponent cannot activate [Blocker]"
  const selectGainPowerMatch =
    /^select\s+(?:up\s+to\s+)?(\d+)\s+(?:of\s+)?(your(?:\s+opponent[''\u2019]s)?)\s+(.+?)\s+and\s+that\s+card\s+gains?\s+([+-]?\d+)\s+power(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?(?:\.\s+Then,\s+if\s+the\s+selected\s+card\s+attacks?\s+during\s+this\s+turn,\s+your\s+opponent\s+cannot\s+activate\s+\[([^\]]+)\])?$/i.exec(
      trimmed,
    );
  if (selectGainPowerMatch) {
    const amount = parseInt(selectGainPowerMatch[1]!, 10);
    const upTo = /^select\s+up\s+to/i.test(trimmed);
    const player = /opponent/i.test(selectGainPowerMatch[2]!) ? "opponent" : "self";
    const filterText = selectGainPowerMatch[3]!;
    const { zonesText, filters } = extractTargetFilters(filterText);
    const zones = parseZoneList(zonesText) || ["character"];
    const value = parseInt(selectGainPowerMatch[4]!, 10);
    const duration = selectGainPowerMatch[5]
      ? parseFullDuration(selectGainPowerMatch[5])
      : "thisTurn";
    const actions: Action[] = [
      {
        action: "modifyPower",
        target: {
          player: player as "self" | "opponent",
          zones: zones as Zone[],
          count: { amount, ...(upTo && { upTo: true }) },
          ...(filters.length > 0 && { filters }),
        },
        value,
        duration,
      },
    ];
    if (selectGainPowerMatch[6]) {
      const keyword = KEYWORD_BRACKET_TO_TYPE[selectGainPowerMatch[6].toLowerCase()];
      if (keyword) {
        actions.push({
          action: "cannotActivate",
          target: { player: "opponent", zones: ["character"], count: { amount: "all" } },
          keyword,
          duration: "thisTurn",
        });
      }
    }
    return actions;
  }

  // "Select up to 1 {Trait} type card with a cost of N or less from your hand and play it or add it to the top of your Life cards face-up"
  const selectPlayOrLifeMatch =
    /^select\s+(?:up\s+to\s+)?(\d+)\s+(.+?)\s+from\s+your\s+(hand|trash)\s+and\s+play\s+it\s+or\s+add\s+it\s+to\s+the\s+(top|bottom)\s+of\s+your\s+Life\s+cards\s+face-up$/i.exec(
      trimmed,
    );
  if (selectPlayOrLifeMatch) {
    const filterText = selectPlayOrLifeMatch[2]!;
    const { filters } = extractTargetFilters(filterText);
    const zone = selectPlayOrLifeMatch[3]!.toLowerCase() as Zone;
    const lifePos = selectPlayOrLifeMatch[4]!.toLowerCase() as "top" | "bottom";
    return [
      {
        action: "choice",
        options: [
          [
            {
              action: "play",
              source: { player: "self" as const, zone },
              count: { amount: parseInt(selectPlayOrLifeMatch[1]!, 10), upTo: true },
              ...(filters.length > 0 && { filters }),
            },
          ],
          [
            {
              action: "addToLife",
              target: {
                player: "self",
                zones: [zone],
                count: { amount: parseInt(selectPlayOrLifeMatch[1]!, 10), upTo: true },
                ...(filters.length > 0 && { filters }),
              },
              position: lifePos,
              faceUp: true,
            },
          ],
        ],
      },
    ];
  }

  // "Select your Leader and 1 Character. Swap the base power of the selected cards with each other during this battle"
  const selectSwapMatch =
    /^select\s+(?:your\s+Leader\s+and\s+)?(\d+)\s+(?:of\s+)?(your(?:\s+opponent[''\u2019]s)?\s+)?(.+?)\.\s+Swap\s+the\s+base\s+power\s+of\s+the\s+selected\s+(?:cards|Characters)\s+with\s+each\s+other(?:\s+(during\s+this\s+(?:turn|battle)|until\s+.+))?$/i.exec(
      trimmed,
    );
  if (selectSwapMatch) {
    const duration = selectSwapMatch[4] ? parseFullDuration(selectSwapMatch[4]) : "thisBattle";
    const isLeaderAndChar = /your\s+Leader\s+and/i.test(trimmed);
    const zones: Zone[] = isLeaderAndChar ? ["leader", "character"] : ["character"];
    const player = selectSwapMatch[2] && /opponent/i.test(selectSwapMatch[2]) ? "opponent" : "self";
    const filterText = selectSwapMatch[3]!;
    const { filters } = extractTargetFilters(filterText);
    return [
      {
        action: "setPower",
        target: {
          player: player as "self" | "opponent",
          zones,
          count: { amount: isLeaderAndChar ? 2 : parseInt(selectSwapMatch[1]!, 10) },
          ...(filters.length > 0 && { filters }),
        },
        value: 0,
        duration,
      },
    ];
  }

  // "Select your Leader or 1 of your {Trait} type Characters. Change the attack target to the selected card"
  const selectRedirectMatch =
    /^select\s+your\s+Leader\s+or\s+(\d+)\s+of\s+your\s+(.+?)\.\s+Change\s+the\s+attack\s+target\s+to\s+the\s+selected\s+card$/i.exec(
      trimmed,
    );
  if (selectRedirectMatch) {
    const filterText = selectRedirectMatch[2]!;
    const { filters } = extractTargetFilters(filterText);
    return [
      {
        action: "attackRestriction",
        restriction: "cannotAttackOtherThan",
        target: {
          player: "self",
          zones: ["leader", "character"],
          count: { amount: 1 },
          ...(filters.length > 0 && { filters }),
        },
        duration: "thisBattle",
      },
    ];
  }

  // "Select (all of) your opponent's Characters on their field. Until ..., none of the selected Characters can attack unless ..."
  const selectAllCannotAttackMatch =
    /^select\s+(?:all\s+(?:of\s+)?)?your\s+opponent[''\u2019]s\s+Characters\s+(?:on\s+their\s+field\s*)?\.\s*Until\s+(.+?),\s+(?:none\s+of\s+)?the\s+selected\s+Characters?\s+(?:can(?:not|'t)\s+attack|cannot\s+attack|can\s+attack\s+unless)/i.exec(
      trimmed,
    );
  if (selectAllCannotAttackMatch) {
    const duration = parseFullDuration("until " + selectAllCannotAttackMatch[1]!);
    return [
      {
        action: "cannotAttack",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount: "all" },
        },
        duration,
      },
    ];
  }

  return null;
}

export function parseOpponentAction(text: string): Action | null {
  const trimmed = text.trim().replace(/\.+$/, "");

  // "Your opponent returns all cards in their hand to their deck [and shuffles their deck]"
  const returnDeckMatch =
    /^your\s+opponent\s+returns?\s+all\s+cards?\s+in\s+their\s+hand\s+to\s+their\s+deck(?:\s+and\s+shuffles?\s+their\s+deck)?$/i.exec(
      trimmed,
    );
  if (returnDeckMatch) {
    return {
      action: "returnToDeck",
      target: {
        player: "opponent",
        zones: ["hand"],
        count: { amount: "all" },
      },
      position: "any",
    } as ReturnToDeckAction;
  }

  // "Your opponent places N cards/Events from their trash at the bottom of their deck in any order"
  const placeTrashMatch =
    /^your\s+opponent\s+places?\s+(\d+)\s+(?:cards?|Events?)\s+from\s+their\s+trash\s+at\s+the\s+(bottom|top)\s+of\s+their\s+deck(?:\s+in\s+any\s+order)?$/i.exec(
      trimmed,
    );
  if (placeTrashMatch) {
    return {
      action: "returnToDeck",
      target: {
        player: "opponent",
        zones: ["trash"],
        count: { amount: parseInt(placeTrashMatch[1]!, 10) },
      },
      position: placeTrashMatch[2]!.toLowerCase() as "top" | "bottom",
    } as ReturnToDeckAction;
  }

  // "Your opponent chooses N of their Character(s) with a cost of N or less and return to the owner's hand"
  const oppChooseReturnMatch =
    /^your\s+opponent\s+chooses\s+(\d+)\s+of\s+their\s+Characters?\s+(?:with\s+(.+?)\s+)?and\s+returns?\s+(?:it\s+|them\s+)?to\s+the\s+owner[''\u2019]s\s+hand$/i.exec(
      trimmed,
    );
  if (oppChooseReturnMatch) {
    const amount = parseInt(oppChooseReturnMatch[1]!, 10);
    const filters: TargetFilter[] = [];
    if (oppChooseReturnMatch[2]) {
      const costMatch = /a\s+cost\s+of\s+(\d+)\s+or\s+(less|more)/i.exec(oppChooseReturnMatch[2]);
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
    } as ReturnToHandAction;
  }

  // "Your opponent returns/places N of their Characters at the bottom of the owner's deck"
  const oppReturnCharMatch =
    /^your\s+opponent\s+(?:returns?|places?)\s+(\d+)\s+of\s+their\s+Characters?\s+(?:(?:with\s+(.+?)\s+)?(?:at\s+)?)?(?:to\s+)?the\s+(bottom|top)\s+of\s+the\s+owner[''\u2019]s\s+deck$/i.exec(
      trimmed,
    ) ??
    /^your\s+opponent\s+(?:returns?|places?)\s+(\d+)\s+of\s+their\s+Characters?\s+to\s+the\s+owner[''\u2019]s\s+hand$/i.exec(
      trimmed,
    );
  if (oppReturnCharMatch) {
    const amount = parseInt(oppReturnCharMatch[1]!, 10);
    const isHand = /hand$/i.test(trimmed);
    if (isHand) {
      return {
        action: "returnToHand",
        target: {
          player: "opponent",
          zones: ["character"],
          count: { amount },
          chosenBy: "opponent",
        },
      } as ReturnToHandAction;
    }
    return {
      action: "returnToDeck",
      target: {
        player: "opponent",
        zones: ["character"],
        count: { amount },
        chosenBy: "opponent",
      },
      position: (oppReturnCharMatch[3]?.toLowerCase() ?? "bottom") as "top" | "bottom",
    } as ReturnToDeckAction;
  }

  // "Your opponent rests N of their active DON!! cards"
  const oppRestDonMatch =
    /^your\s+opponent\s+rests?\s+(\d+)\s+of\s+their\s+active\s+DON!!\s+cards?/i.exec(trimmed);
  if (oppRestDonMatch) {
    return {
      action: "rest",
      target: {
        player: "opponent",
        zones: ["costArea" as Zone],
        count: { amount: parseInt(oppRestDonMatch[1]!, 10) },
        filters: [{ filter: "state", value: "active" as const }],
      },
    } as RestAction;
  }

  // "Your opponent may trash N card(s) from the top of their Life cards"
  const oppTrashLifeMatch =
    /^your\s+opponent\s+(?:may\s+)?trash(?:es)?\s+(\d+)\s+cards?\s+from\s+the\s+top\s+of\s+their\s+Life\s+cards?$/i.exec(
      trimmed,
    );
  if (oppTrashLifeMatch) {
    return {
      action: "removeFromLife",
      player: "opponent",
      count: { amount: parseInt(oppTrashLifeMatch[1]!, 10) },
      destination: "trash",
    } as RemoveFromLifeAction;
  }

  return null;
}
