<script lang="ts">
  import { untrack } from "svelte";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import {
    submitPlayerReport,
    PLAYER_REPORT_REASONS,
    type PlayerReportReason,
  } from "@/features/simulator/support/feedback-api.js";

  interface SimulatorPlayerReportDialogProps {
    open?: boolean;
    reportedDisplayName?: string | null;
    reportedGameProfileId?: string | null;
    matchId?: string | null;
    gameId?: string | null;
  }

  let {
    open = $bindable(false),
    reportedDisplayName = null,
    reportedGameProfileId = null,
    matchId = null,
    gameId = null,
  }: SimulatorPlayerReportDialogProps = $props();

  const REASON_LABELS: Record<PlayerReportReason, string> = {
    stalling: "Stalling / wasting time",
    abusive_chat: "Abusive chat / harassment",
    exploit: "Cheating / exploit",
    collusion: "Collusion",
    inappropriate_name: "Inappropriate name",
    intentional_disconnect: "Intentional disconnect / rage quit",
    other: "Other",
  };

  const MAX_DETAILS_LENGTH = 1000;

  function shuffledReasonOrder(): PlayerReportReason[] {
    const shufflable = PLAYER_REPORT_REASONS.filter((r) => r !== "other");
    const pool = [...shufflable];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return [...pool, "other"];
  }

  let reasonOrder = $state<PlayerReportReason[]>(shuffledReasonOrder());
  let reason = $state<PlayerReportReason>(untrack(() => reasonOrder[0]));
  let details = $state("");
  let status = $state<"idle" | "submitting" | "success" | "error">("idle");
  let errorText = $state("");

  let dialogEpoch = $state(0);
  let nextDialogEpoch = 0;
  let wasOpen = open;

  $effect(() => {
    if (wasOpen && !open) {
      nextDialogEpoch += 1;
      dialogEpoch = nextDialogEpoch;
      reasonOrder = shuffledReasonOrder();
      reason = reasonOrder[0];
      details = "";
      status = "idle";
      errorText = "";
    }
    wasOpen = open;
  });

  const detailsRequired = $derived(reason === "other");
  const canSubmit = $derived(
    !!reportedGameProfileId &&
      status !== "submitting" &&
      (!detailsRequired || details.trim().length > 0),
  );

  async function handleSubmit() {
    if (!canSubmit || !reportedGameProfileId) return;

    const epoch = dialogEpoch;
    status = "submitting";
    errorText = "";

    try {
      await submitPlayerReport({
        reportedGameProfileId,
        matchId: matchId ?? undefined,
        gameId: gameId ?? undefined,
        reason,
        details: details.trim() ? details.trim() : undefined,
      });
      if (epoch !== dialogEpoch) return;
      status = "success";
    } catch (err) {
      if (epoch !== dialogEpoch) return;
      errorText = err instanceof Error ? err.message : "Failed to submit report";
      status = "error";
    }
  }
</script>

<Dialog.Root bind:open>
  <Dialog.Portal>
    <Dialog.Overlay class="player-settings-overlay" />
    <Dialog.Content class="player-settings-dialog" showCloseButton={false}>
      <Dialog.Header class="gap-1">
        <Dialog.Title class="text-base font-semibold tracking-tight text-slate-100">
          Report player
        </Dialog.Title>
        <Dialog.Description class="text-sm text-slate-400">
          {reportedDisplayName
            ? `Submit a moderation report against ${reportedDisplayName}.`
            : "Submit a moderation report against this player."}
          The replay of this match will be saved for staff review.
        </Dialog.Description>
      </Dialog.Header>

      {#if status === "success"}
        <p class="report-success">
          Thanks — your report has been sent to the moderation team.
        </p>
      {:else if !reportedGameProfileId}
        <p class="report-error">
          Player identity isn't available yet — please try again in a moment.
        </p>
      {:else}
        <div class="report-form">
          <label class="report-field">
            <span class="report-label">Reason</span>
            <select class="report-select" bind:value={reason} disabled={status === "submitting"}>
              {#each reasonOrder as r}
                <option value={r}>{REASON_LABELS[r]}</option>
              {/each}
            </select>
          </label>

          <label class="report-field">
            <span class="report-label">
              Details {detailsRequired ? "(required)" : "(optional)"}
            </span>
            <textarea
              class="report-textarea"
              placeholder="Add any context that would help staff review this report."
              maxlength={MAX_DETAILS_LENGTH}
              bind:value={details}
              disabled={status === "submitting"}
              rows={4}
            ></textarea>
            <span class="report-char-count">{details.length} / {MAX_DETAILS_LENGTH}</span>
          </label>

          {#if status === "error"}
            <p class="report-error">{errorText}</p>
          {/if}
        </div>
      {/if}

      <Dialog.Footer>
        {#if status === "success"}
          <Dialog.Close class="player-settings-close">Done</Dialog.Close>
        {:else}
          <Dialog.Close class="player-settings-close">Cancel</Dialog.Close>
          <button
            type="button"
            class="report-submit"
            disabled={!canSubmit}
            onclick={handleSubmit}
          >
            {status === "submitting" ? "…" : "Submit report"}
          </button>
        {/if}
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  .report-form {
    display: grid;
    gap: 0.6rem;
  }

  .report-field {
    display: grid;
    gap: 0.25rem;
  }

  .report-label {
    font-size: 0.75rem;
    color: rgba(148, 163, 184, 0.85);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .report-select,
  .report-textarea {
    width: 100%;
    border-radius: 0.6rem;
    border: 1px solid rgba(125, 211, 252, 0.2);
    background: rgba(2, 8, 18, 0.6);
    color: #e5edf7;
    padding: 0.55rem 0.75rem;
    font-size: 0.85rem;
    line-height: 1.4;
    outline: none;
    transition: border-color 160ms ease;
  }

  .report-textarea {
    resize: vertical;
  }

  .report-select:focus,
  .report-textarea:focus {
    border-color: rgba(125, 211, 252, 0.5);
  }

  .report-select:disabled,
  .report-textarea:disabled {
    opacity: 0.5;
  }

  .report-char-count {
    font-size: 0.72rem;
    color: rgba(148, 163, 184, 0.6);
    text-align: right;
  }

  .report-error {
    font-size: 0.78rem;
    color: #f87171;
    margin: 0;
  }

  .report-success {
    font-size: 0.88rem;
    color: #86efac;
    margin: 0.25rem 0;
  }

  .report-submit {
    border-radius: 0.5rem;
    border: 1px solid rgba(248, 113, 113, 0.5);
    background: rgba(127, 29, 29, 0.45);
    color: #fee2e2;
    padding: 0.4rem 0.8rem;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition:
      background 160ms ease,
      border-color 160ms ease;
  }

  .report-submit:hover:not(:disabled),
  .report-submit:focus-visible:not(:disabled) {
    background: rgba(153, 27, 27, 0.7);
    border-color: rgba(254, 202, 202, 0.85);
    outline: none;
  }

  .report-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
