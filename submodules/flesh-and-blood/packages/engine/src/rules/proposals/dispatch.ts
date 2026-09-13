import type { FabEffect } from "@tcg/flesh-and-blood-types";
import { assertNever } from "../evaluation/assert-never.ts";
import { unsupported, type FabEffectProposalResult, type ProposalContext } from "./shared.ts";
import { proposeCardMovementEffect } from "./card-movement-effects.ts";
import { proposeAddCounter } from "./effects/add-counter.ts";
import { proposeAddDefending } from "./effects/add-defending.ts";
import { proposeAmp } from "./effects/amp.ts";
import { proposeAttackWith } from "./effects/attack-with.ts";
import { proposeAwaken } from "./effects/awaken.ts";
import { proposeBanish } from "./effects/banish.ts";
import { proposeBecome } from "./effects/become.ts";
import { proposeCanBeAttacked } from "./effects/can-be-attacked.ts";
import { proposeCancelEvent } from "./effects/cancel-event.ts";
import { proposeCharge } from "./effects/charge.ts";
import { proposeIgnore } from "./effects/ignore.ts";
import { proposeIfYouDo } from "./effects/if-you-do.ts";
import { proposeChoice } from "./effects/choice.ts";
import { proposeChooseAndCreateToken } from "./effects/choose-and-create-token.ts";
import { proposeChooseCard } from "./effects/choose-card.ts";
import { proposeChooseNewTargets } from "./effects/choose-new-targets.ts";
import { proposeChooseSameNameGroup } from "./effects/choose-same-name-group.ts";
import { proposeChooseColor } from "./effects/choose-color.ts";
import { proposeChooseNumber } from "./effects/choose-number.ts";
import { proposeChooseOpponent } from "./effects/choose-opponent.ts";
import { proposeChooseOption } from "./effects/choose-option.ts";
import { proposeClash } from "./effects/clash.ts";
import { proposeConditional } from "./effects/conditional.ts";
import { proposeContract } from "./effects/contract.ts";
import { proposeCopy } from "./effects/copy.ts";
import { proposeCreateCard } from "./effects/create-card.ts";
import { proposeCreateExtra } from "./effects/create-extra.ts";
import { proposeCreateToken } from "./effects/create-token.ts";
import { proposeCrowdBoos } from "./effects/crowd-boos.ts";
import { proposeCrowdCheers } from "./effects/crowd-cheers.ts";
import { proposeDealDamage } from "./effects/deal-damage.ts";
import { proposeDelayedTrigger } from "./effects/delayed-trigger.ts";
import { proposeDestroy } from "./effects/destroy.ts";
import { proposeDiscard } from "./effects/discard.ts";
import { proposeDistributeCounters } from "./effects/distribute-counters.ts";
import { proposeTransformIntoResolvingCard } from "./mechanic-effects.ts";
import { proposeDraw } from "./effects/draw.ts";
import { proposeEquip } from "./effects/equip.ts";
import { proposeRetrieve } from "./effects/retrieve.ts";
import { proposeExchange } from "./effects/exchange.ts";
import { proposeForEach } from "./effects/for-each.ts";
import { proposeFreeze } from "./effects/freeze.ts";
import { proposeGainActionPoints } from "./effects/gain-action-points.ts";
import { proposeGainChi } from "./effects/gain-chi.ts";
import { proposeGainControl } from "./effects/gain-control.ts";
import { proposeGainLife } from "./effects/gain-life.ts";
import { proposeGainResources } from "./effects/gain-resources.ts";
import { proposeGrantProperty } from "./effects/grant-property.ts";
import { proposeGuess } from "./effects/guess.ts";
import { proposeIntimidate } from "./effects/intimidate.ts";
import { proposeLook } from "./effects/look.ts";
import { proposeLoseGame } from "./effects/lose-game.ts";
import { proposeLoseLife } from "./effects/lose-life.ts";
import { proposeMark } from "./effects/mark.ts";
import { proposeModifyNumeric } from "./effects/modify-numeric.ts";
import { proposeModifyActivationCost } from "./effects/modify-activation-cost.ts";
import { proposeModifyActivationLimit } from "./effects/modify-activation-limit.ts";
import { proposeMoveCard } from "./effects/move-card.ts";
import { proposeMoveCounter } from "./effects/move-counter.ts";
import { proposeNameCard } from "./effects/name-card.ts";
import { proposeNegate } from "./effects/negate.ts";
import { proposeOpt } from "./effects/opt.ts";
import { proposeOptional } from "./effects/optional.ts";
import { proposePay } from "./effects/pay.ts";
import { proposePitchCard } from "./effects/pitch-card.ts";
import { proposePlayCard } from "./effects/play-card.ts";
import { proposePrevention } from "./effects/prevention.ts";
import { proposeRemoveAllCounters } from "./effects/remove-all-counters.ts";
import { proposeRemoveCounters } from "./effects/remove-counters.ts";
import { proposeRemoveProperty } from "./effects/remove-property.ts";
import { proposeRepeat } from "./effects/repeat.ts";
import { proposeReturnToBrood } from "./effects/return-to-brood.ts";
import { proposeReplacement } from "./effects/replacement.ts";
import { proposeReveal } from "./effects/reveal.ts";
import { proposeRoll } from "./effects/roll.ts";
import { proposeRuleModification } from "./effects/rule-modification.ts";
import { proposeSearch } from "./effects/search.ts";
import { proposeSequence } from "./effects/sequence.ts";
import { proposeSetStatus } from "./effects/set-status.ts";
import { proposeSharpen } from "./effects/sharpen.ts";
import { proposeShuffle } from "./effects/shuffle.ts";
import { proposeStartGame } from "./effects/start-game.ts";
import { proposeTakeExtraTurn } from "./effects/take-extra-turn.ts";
import { proposeTap } from "./effects/tap.ts";
import { proposeTransform } from "./effects/transform.ts";
import { proposeTranscend } from "./effects/transcend.ts";
import { proposeTurnFaceDown } from "./effects/turn-face-down.ts";
import { proposeTurnFaceUp } from "./effects/turn-face-up.ts";
import { proposeUnfreeze } from "./effects/unfreeze.ts";
import { proposeUnless } from "./effects/unless.ts";
import { proposeUntap } from "./effects/untap.ts";
import { proposeWager } from "./effects/wager.ts";
import { proposeWinClash } from "./effects/win-clash.ts";
import { proposeWinWager } from "./effects/win-wager.ts";

/** Exhaustive FabEffect → proposal handler dispatch. New effect types fail tsc here. */
export function proposeEffectDispatch(
  ctx: ProposalContext,
  effect: FabEffect,
): FabEffectProposalResult {
  switch (effect.type) {
    case "add-counter":
      return proposeAddCounter(ctx, effect);
    case "add-defending":
      return proposeAddDefending(ctx, effect);
    case "amp":
      return proposeAmp(ctx, effect);
    case "attack-with":
      return proposeAttackWith(ctx, effect);
    case "awaken":
      return proposeAwaken(ctx, effect);
    case "banish":
      return proposeBanish(ctx, effect);
    case "become":
      return proposeBecome(ctx, effect);
    case "can-be-attacked":
      return proposeCanBeAttacked(ctx, effect);
    case "cancel-event":
      return proposeCancelEvent(ctx, effect);
    case "ignore":
      return proposeIgnore(ctx, effect);
    case "if-you-do":
      return proposeIfYouDo(ctx, effect);
    case "charge":
      return proposeCharge(ctx, effect);
    case "choice":
      return proposeChoice(ctx, effect);
    case "choose-and-create-token":
      return proposeChooseAndCreateToken(ctx, effect);
    case "choose-card":
      return proposeChooseCard(ctx, effect);
    case "choose-new-targets":
      return proposeChooseNewTargets(ctx, effect);
    case "choose-same-name-group":
      return proposeChooseSameNameGroup(ctx, effect);
    case "choose-color":
      return proposeChooseColor(ctx, effect);
    case "choose-number":
      return proposeChooseNumber(ctx, effect);
    case "choose-opponent":
      return proposeChooseOpponent(ctx, effect);
    case "choose-option":
      return proposeChooseOption(ctx, effect);
    case "clash":
      return proposeClash(ctx, effect);
    case "conditional":
      return proposeConditional(ctx, effect);
    case "contract-task":
    case "contract-watch":
      return proposeContract(ctx, effect);
    case "copy":
      return proposeCopy(ctx, effect);
    case "create-card":
      return proposeCreateCard(ctx, effect);
    case "create-extra":
      return proposeCreateExtra(ctx, effect);
    case "create-token":
      return proposeCreateToken(ctx, effect);
    case "crowd-boos":
      return proposeCrowdBoos(ctx, effect);
    case "crowd-cheers":
      return proposeCrowdCheers(ctx, effect);
    case "deal-damage":
      return proposeDealDamage(ctx, effect);
    case "delayed-trigger":
      return proposeDelayedTrigger(ctx, effect);
    case "destroy":
      return proposeDestroy(ctx, effect);
    case "discard":
      return proposeDiscard(ctx, effect);
    case "distribute-counters":
      return proposeDistributeCounters(ctx, effect);
    case "draw":
      return proposeDraw(ctx, effect);
    case "equip":
      return proposeEquip(ctx, effect);
    case "retrieve":
      return proposeRetrieve(ctx, effect);
    case "exchange":
      return proposeExchange(ctx, effect);
    case "for-each":
      return proposeForEach(ctx, effect);
    case "freeze":
      return proposeFreeze(ctx, effect);
    case "gain-action-points":
      return proposeGainActionPoints(ctx, effect);
    case "gain-chi":
      return proposeGainChi(ctx, effect);
    case "gain-control":
    case "give":
    case "steal":
      return proposeGainControl(ctx, effect);
    case "gain-life":
      return proposeGainLife(ctx, effect);
    case "gain-resources":
      return proposeGainResources(ctx, effect);
    case "grant-property":
      return proposeGrantProperty(ctx, effect);
    case "guess":
      return proposeGuess(ctx, effect);
    case "intimidate":
      return proposeIntimidate(ctx, effect);
    case "look":
      return proposeLook(ctx, effect);
    case "lose-game":
      return proposeLoseGame(ctx, effect);
    case "lose-life":
      return proposeLoseLife(ctx, effect);
    case "mark":
      return proposeMark(ctx, effect);
    case "modify-numeric":
      return proposeModifyNumeric(ctx, effect);
    case "modify-activation-cost":
      return proposeModifyActivationCost(ctx, effect);
    case "modify-activation-limit":
      return proposeModifyActivationLimit(ctx, effect);
    case "move-card":
      return proposeMoveCard(ctx, effect);
    case "bind-aura":
      return (
        proposeCardMovementEffect(ctx, effect) ??
        unsupported(effect, "bind-aura proposal was not handled")
      );
    case "move-counter":
      return proposeMoveCounter(ctx, effect);
    case "name-card":
      return proposeNameCard(ctx, effect);
    case "negate":
      return proposeNegate(ctx, effect);
    case "opt":
      return proposeOpt(ctx, effect);
    case "reorder-deck":
      return (
        proposeCardMovementEffect(ctx, effect) ??
        unsupported(effect, "reorder-deck proposal was not handled")
      );
    case "optional":
      return proposeOptional(ctx, effect);
    case "pay":
      return proposePay(ctx, effect);
    case "pitch-card":
      return proposePitchCard(ctx, effect);
    case "play-card":
      return proposePlayCard(ctx, effect);
    case "prevention":
      return proposePrevention(ctx, effect);
    case "remove-all-counters":
      return proposeRemoveAllCounters(ctx, effect);
    case "remove-counters":
      return proposeRemoveCounters(ctx, effect);
    case "remove-property":
      return proposeRemoveProperty(ctx, effect);
    case "repeat":
      return proposeRepeat(ctx, effect);
    case "return-to-brood":
      return proposeReturnToBrood(ctx, effect);
    case "replacement":
      return proposeReplacement(ctx, effect);
    case "reveal":
      return proposeReveal(ctx, effect);
    case "roll":
      return proposeRoll(ctx, effect);
    case "rule-modification":
      return proposeRuleModification(ctx, effect);
    case "search":
      return proposeSearch(ctx, effect);
    case "sequence":
      return proposeSequence(ctx, effect);
    case "set-status":
      return proposeSetStatus(ctx, effect);
    case "sharpen":
      return proposeSharpen(ctx, effect);
    case "shuffle":
      return proposeShuffle(ctx, effect);
    case "start-game":
      return proposeStartGame(ctx, effect);
    case "take-extra-turn":
      return proposeTakeExtraTurn(ctx, effect);
    case "tap":
      return proposeTap(ctx, effect);
    case "transform":
      return proposeTransform(ctx, effect);
    case "transcend":
      return proposeTranscend(ctx, effect);
    case "transform-into-resolving-card":
      return proposeTransformIntoResolvingCard(ctx, effect);
    case "turn-face-down":
      return proposeTurnFaceDown(ctx, effect);
    case "turn-face-up":
      return proposeTurnFaceUp(ctx, effect);
    case "unfreeze":
      return proposeUnfreeze(ctx, effect);
    case "unless":
      return proposeUnless(ctx, effect);
    case "untap":
      return proposeUntap(ctx, effect);
    case "wager":
      return proposeWager(ctx, effect);
    case "reclash":
      return {
        supported: false,
        reason: "reclash is valid only as a typed clash-outcome replacement continuation",
      };
    case "swap-clash-reveals":
      return {
        supported: false,
        reason: "swap-clash-reveals is valid only as a clash replacement modification",
      };
    case "win-clash":
      return proposeWinClash(ctx, effect);
    case "win-wager":
      return proposeWinWager(ctx, effect);
    case "inline-trigger":
      return {
        supported: false,
        reason: "inline-trigger generation-boundary registration is not yet implemented",
      };
    case "self-replacement":
      // CR 6.4.7: only meaningful as the step directly after the effect it
      // replaces — proposeSequence applies it via look-ahead.
      return {
        supported: false,
        reason: "self-replacement requires a preceding effect in the same sequence",
      };
    default:
      return assertNever(effect, "FabEffect.type");
  }
}
