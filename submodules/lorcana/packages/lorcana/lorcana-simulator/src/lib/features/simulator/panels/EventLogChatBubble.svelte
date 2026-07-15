<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import type { LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";
  import type { ChatFeedItem } from "./event-log-presentation.js";

  interface Props {
    group: ChatFeedItem;
    viewerSide?: LorcanaPlayerSide | null;
  }

  let { group, viewerSide = null }: Props = $props();

  const SYSTEM_EVENT_LABELS: Record<string, string> = {
    cancel_match_proposed: "Match cancellation proposed",
    cancel_match_accepted: "Match cancelled by mutual agreement",
    cancel_match_declined: "Match cancellation declined",
    cancel_match_expired: "Match cancellation expired",
    undo_proposed: "Undo proposed",
    undo_accepted: "Undo accepted",
    undo_declined: "Undo declined",
    undo_expired: "Undo request expired",
    enable_free_text_chat_proposed: "Free text chat proposed",
    free_text_chat_enabled: "Free text chat enabled",
    enable_free_text_chat_declined: "Free text chat request declined",
    enable_free_text_chat_expired: "Free text chat request expired",
    enable_manual_mode_proposed: "Board State Correction proposed",
    enable_manual_mode_accepted: "Board State Correction enabled",
    enable_manual_mode_declined: "Board State Correction declined",
    enable_manual_mode_expired: "Board State Correction request expired",
    disable_manual_mode_proposed: "Exit Board State Correction proposed",
    disable_manual_mode_accepted: "Board State Correction disabled",
    disable_manual_mode_declined: "Exit Board State Correction declined",
    disable_manual_mode_expired: "Exit Board State Correction request expired",
    proposal_sent: "Proposal sent",
    proposal_accepted: "Proposal accepted",
    proposal_declined: "Proposal declined",
    proposal_expired: "Proposal expired",
  };

  function isOwn(senderSeat: 0 | 1 | 2): boolean {
    if (senderSeat === 0) return false;
    if (viewerSide === "playerOne") return senderSeat === 1;
    if (viewerSide === "playerTwo") return senderSeat === 2;
    return false;
  }

  function senderLabel(senderSeat: 0 | 1 | 2): string {
    if (senderSeat === 0) return "System";
    if (viewerSide === "playerOne") {
      return senderSeat === 1 ? m["sim.player.you"]({}) : m["sim.player.opponent"]({});
    }
    if (viewerSide === "playerTwo") {
      return senderSeat === 2 ? m["sim.player.you"]({}) : m["sim.player.opponent"]({});
    }
    return senderSeat === 1 ? m["sim.player.side.playerOne"]({}) : m["sim.player.side.playerTwo"]({});
  }

  function messageText(item: ChatFeedItem): string {
    if (item.presetKey) {
      return m[`sim.tabletop.chat.preset.${item.presetKey}`]({});
    }
    if (item.systemEvent) {
      return SYSTEM_EVENT_LABELS[item.systemEvent] ?? item.systemEvent.replaceAll("_", " ");
    }
    return item.text ?? "";
  }

  function formatTimestamp(epochMs: number): string {
    return new Date(epochMs).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const own = $derived(isOwn(group.senderSeat));
</script>

<div class="flex flex-col {own ? 'items-end' : 'items-start'} px-1 py-1">
  <span
    class="mb-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.16em] {own
      ? 'text-emerald-300/60'
      : 'text-violet-300/60'}"
  >
    {senderLabel(group.senderSeat)}
  </span>
  <div
    class="max-w-[85%] px-3 py-1.5 {own
      ? 'rounded-2xl rounded-br-sm border border-emerald-500/30 bg-emerald-600/20 text-emerald-50'
      : 'rounded-2xl rounded-bl-sm border border-violet-500/30 bg-violet-600/20 text-slate-200'}"
  >
    <p class="break-words text-[0.82rem] leading-[1.45]">
      {messageText(group)}
    </p>
  </div>
  <span class="mt-0.5 text-[0.58rem] text-slate-500">{formatTimestamp(group.epochMs)}</span>
</div>
