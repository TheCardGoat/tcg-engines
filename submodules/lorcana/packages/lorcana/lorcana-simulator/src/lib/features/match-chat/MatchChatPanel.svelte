<script lang="ts">
  import { MessageSquareText } from "@lucide/svelte";
  import { Button } from "$lib/design-system/primitives/button";
  import { m } from "$lib/i18n/messages.js";
  import type { LorcanaPlayerSide } from "@/features/simulator/model/contracts.js";
  import { maybeUseMatchChatControllerContext } from "./match-chat-controller.svelte.js";

  interface MatchChatPanelProps {
    viewerSide?: LorcanaPlayerSide | null;
    compact?: boolean;
  }

  let { viewerSide = null, compact = false }: MatchChatPanelProps = $props();

  const controllerContext = maybeUseMatchChatControllerContext();
  const controller = $derived(controllerContext?.controller ?? null);
  const messages = $derived(controller?.messages ?? []);
  const canSend = $derived(controller?.canSend ?? false);
  const presetKeys = $derived(controller?.presetKeys ?? []);
  const freeTextEnabled = $derived(controller?.freeTextEnabled ?? false);
  const freeTextProposalPending = $derived(controller?.freeTextProposalPending ?? false);
  const maxTextLength = $derived(controller?.maxTextLength ?? 280);

  let draftText = $state("");

  function handleSendText(): void {
    if (!controller) return;
    const trimmed = draftText.trim();
    if (trimmed.length === 0) return;
    controller.sendText(trimmed);
    draftText = "";
  }

  function handleTextKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendText();
    }
  }

  type ChatTone = "self" | "opponent" | "playerOne" | "playerTwo" | "system";

  function resolveTone(senderSeat: 0 | 1 | 2): ChatTone {
    if (senderSeat === 0) return "system";
    if (viewerSide === "playerOne") {
      return senderSeat === 1 ? "self" : "opponent";
    }

    if (viewerSide === "playerTwo") {
      return senderSeat === 2 ? "self" : "opponent";
    }

    return senderSeat === 1 ? "playerOne" : "playerTwo";
  }

  function resolveSenderLabel(senderSeat: 0 | 1 | 2): string {
    const tone = resolveTone(senderSeat);
    switch (tone) {
      case "system":
        return "System";
      case "self":
        return m["sim.player.you"]({});
      case "opponent":
        return m["sim.player.opponent"]({});
      case "playerOne":
        return m["sim.player.side.playerOne"]({});
      case "playerTwo":
        return m["sim.player.side.playerTwo"]({});
    }
  }

  function chipClasses(senderSeat: 0 | 1 | 2): string {
    switch (resolveTone(senderSeat)) {
      case "system":
        return "border-zinc-400/45 bg-zinc-500/12 text-zinc-300";
      case "self":
        return "border-emerald-400/45 bg-emerald-500/12 text-emerald-100";
      case "opponent":
        return "border-rose-400/45 bg-rose-500/12 text-rose-100";
      case "playerOne":
        return "border-sky-400/45 bg-sky-500/12 text-sky-100";
      case "playerTwo":
        return "border-amber-400/45 bg-amber-500/12 text-amber-100";
    }
  }

  const SYSTEM_EVENT_LABELS: Record<string, string> = {
    // cancel_match lifecycle
    cancel_match_proposed: "Match cancellation proposed",
    cancel_match_accepted: "Match cancelled by mutual agreement",
    cancel_match_declined: "Match cancellation declined",
    cancel_match_expired: "Match cancellation expired",
    // undo lifecycle
    undo_proposed: "Undo proposed",
    undo_accepted: "Undo accepted",
    undo_declined: "Undo declined",
    undo_expired: "Undo request expired",
    // enable_free_text_chat lifecycle
    enable_free_text_chat_proposed: "Free text chat proposed",
    free_text_chat_enabled: "Free text chat enabled",
    enable_free_text_chat_declined: "Free text chat request declined",
    enable_free_text_chat_expired: "Free text chat request expired",
    // legacy / fallback
    proposal_sent: "Proposal sent",
    proposal_accepted: "Proposal accepted",
    proposal_declined: "Proposal declined",
    proposal_expired: "Proposal expired",
  };

  function formatSystemEvent(event: string): string {
    return SYSTEM_EVENT_LABELS[event] ?? event.replaceAll("_", " ");
  }

  function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
</script>

{#if controller}
  <section
    class="flex min-h-0 flex-col overflow-hidden rounded-[1rem] border border-[rgba(109,149,195,0.16)] bg-slate-950/55"
    aria-label={m["sim.tabletop.chat.aria"]({})}
  >
    {#if !compact}
      <header class="flex items-center gap-2 border-b border-[rgba(109,149,195,0.16)] px-3 py-2">
        <MessageSquareText class="size-4 text-sky-200/70" />
        <h2 class="text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[#95a8c1]">
          {m["sim.tabletop.chat.title"]({})}
        </h2>
      </header>
    {/if}

    <div class="min-h-0 flex-1 overflow-y-auto px-3 py-3">
      {#if messages.length === 0}
        <p class="text-sm text-slate-400">{m["sim.tabletop.chat.empty"]({})}</p>
      {:else}
        <div class="space-y-2.5">
          {#each messages as message (message.id)}
            <article class="rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2.5">
              <div class="flex items-center justify-between gap-2">
                <span
                  class={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.63rem] font-semibold uppercase tracking-[0.16em] ${chipClasses(message.senderSeat)}`}
                >
                  {resolveSenderLabel(message.senderSeat)}
                </span>
                <span class="text-[0.68rem] text-slate-500">{formatTimestamp(message.createdAt)}</span>
              </div>
              <p class="mt-2 text-sm leading-5 text-slate-100">
                {message.kind === "preset"
                  ? m[`sim.tabletop.chat.preset.${message.presetKey}`]({})
                  : message.kind === "system"
                    ? formatSystemEvent(message.systemEvent)
                    : message.text}
              </p>
            </article>
          {/each}
        </div>
      {/if}
    </div>

    {#if canSend}
      <div class="border-t border-[rgba(109,149,195,0.16)] px-3 py-3">
        <p class="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
          {m["sim.tabletop.chat.compose"]({})}
        </p>
        <div class="grid grid-cols-2 gap-2">
          {#each presetKeys as presetKey}
            <Button
              variant="outline"
              class="min-h-10 justify-start whitespace-normal border-white/10 bg-white/[0.03] px-3 py-2 text-left text-xs leading-4 text-slate-100 hover:bg-white/[0.06]"
              onclick={() => controller.sendPreset(presetKey)}
              aria-label={m["sim.tabletop.chat.sendPreset"]({
                label: m[`sim.tabletop.chat.preset.${presetKey}`]({}),
              })}
              title={m[`sim.tabletop.chat.preset.${presetKey}`]({})}
            >
              {m[`sim.tabletop.chat.preset.${presetKey}`]({})}
            </Button>
          {/each}
        </div>

        {#if freeTextEnabled}
          <div class="mt-3 flex items-center gap-2">
            <input
              type="text"
              bind:value={draftText}
              onkeydown={handleTextKeydown}
              maxlength={maxTextLength}
              placeholder="Type a message…"
              aria-label="Free text chat message"
              class="min-h-10 flex-1 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs leading-4 text-slate-100 placeholder:text-slate-500 focus:border-sky-400/50 focus:outline-none"
            />
            <Button
              variant="outline"
              class="min-h-10 border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-100 hover:bg-white/[0.06]"
              onclick={handleSendText}
              disabled={draftText.trim().length === 0}
              aria-label="Send message"
            >
              Send
            </Button>
          </div>
        {:else}
          <Button
            variant="outline"
            class="mt-3 w-full min-h-10 border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-100 hover:bg-white/[0.06]"
            onclick={() => controller.proposeEnableFreeText()}
            disabled={freeTextProposalPending}
            aria-label="Propose enabling free text chat"
            title="Ask your opponent to enable free text chat"
          >
            {freeTextProposalPending ? "Waiting for opponent…" : "Enable free text chat"}
          </Button>
        {/if}
      </div>
    {/if}
  </section>
{/if}
