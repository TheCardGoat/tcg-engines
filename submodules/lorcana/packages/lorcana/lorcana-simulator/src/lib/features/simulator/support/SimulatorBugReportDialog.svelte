<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import { getTrackerOrigin } from "$lib/config/public-url-config.js";
  import { submitBugReport, type BugReportContext } from "@/features/simulator/support/feedback-api.js";
  import SupportProcessNote from "@/features/simulator/support/SupportProcessNote.svelte";

  interface SimulatorBugReportDialogProps {
    open?: boolean;
    gameContext?: BugReportContext;
  }

  let { open = $bindable(false), gameContext }: SimulatorBugReportDialogProps = $props();

  let description = $state("");
  let status = $state<"idle" | "submitting" | "success" | "error">("idle");
  let errorText = $state("");
  let submittedReportId = $state<string | null>(null);

  const MAX_LENGTH = 5000;

  let dialogEpoch = $state(0);
  let nextDialogEpoch = 0;
  let wasOpen = open;

  function getTriageHref(reportId: string): string {
    return `${getTrackerOrigin()}/lorcana/bug-triage/${encodeURIComponent(reportId)}`;
  }

  $effect(() => {
    if (wasOpen && !open) {
      nextDialogEpoch += 1;
      dialogEpoch = nextDialogEpoch;
      description = "";
      status = "idle";
      errorText = "";
      submittedReportId = null;
    }

    wasOpen = open;
  });

  async function handleSubmit() {
    if (!description.trim() || status === "submitting") return;

    const epoch = dialogEpoch;
    status = "submitting";
    errorText = "";

    try {
      const result = await submitBugReport({
        description: description.trim(),
        source: "simulator",
        context: gameContext,
      });
      if (epoch !== dialogEpoch) return;
      submittedReportId = result.id;
      status = "success";
    } catch (err) {
      if (epoch !== dialogEpoch) return;
      errorText = err instanceof Error ? err.message : m["sim.support.submitError"]({});
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
          {m["sim.support.reportBugLabel"]({})}
        </Dialog.Title>
        <Dialog.Description class="text-sm text-slate-400">
          {m["sim.support.reportBugDescription"]({})}
        </Dialog.Description>
      </Dialog.Header>
      <SupportProcessNote />

      {#if status === "success"}
        <div class="feedback-success-panel">
          <p class="feedback-success">{m["sim.support.submitSuccess"]({})}</p>
          {#if submittedReportId}
            <a
              class="feedback-triage-link"
              href={getTriageHref(submittedReportId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              {m["sim.support.openTriageLabel"]({})}
            </a>
          {/if}
        </div>
      {:else}
        <div class="feedback-form">
          <textarea
            class="feedback-textarea"
            placeholder={m["sim.support.bugReportPlaceholder"]({})}
            maxlength={MAX_LENGTH}
            bind:value={description}
            disabled={status === "submitting"}
            rows={6}
          ></textarea>
          <span class="feedback-char-count">{description.length} / {MAX_LENGTH}</span>
          {#if gameContext}
            <p class="feedback-context-note">
              {m["sim.support.contextNote"]({})}
            </p>
          {/if}
          {#if status === "error"}
            <p class="feedback-error">{errorText}</p>
          {/if}
        </div>
      {/if}

      <Dialog.Footer>
        {#if status === "success"}
          <Dialog.Close class="player-settings-close">
            {m["sim.support.backLabel"]({})}
          </Dialog.Close>
        {:else}
          <Dialog.Close class="player-settings-close" aria-label={m["sim.settings.closeAria"]({})}>
            {m["sim.settings.close"]({})}
          </Dialog.Close>
          <button
            type="button"
            class="feedback-submit"
            disabled={!description.trim() || status === "submitting"}
            onclick={handleSubmit}
          >
            {status === "submitting" ? "…" : m["sim.support.submitLabel"]({})}
          </button>
        {/if}
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  .feedback-form {
    display: grid;
    gap: 0.4rem;
  }

  .feedback-textarea {
    width: 100%;
    border-radius: 0.6rem;
    border: 1px solid rgba(125, 211, 252, 0.2);
    background: rgba(2, 8, 18, 0.6);
    color: #e5edf7;
    padding: 0.65rem 0.75rem;
    font-size: 0.85rem;
    line-height: 1.5;
    resize: vertical;
    outline: none;
    transition: border-color 160ms ease;
  }

  .feedback-textarea:focus {
    border-color: rgba(125, 211, 252, 0.5);
  }

  .feedback-textarea:disabled {
    opacity: 0.5;
  }

  .feedback-char-count {
    font-size: 0.72rem;
    color: rgba(148, 163, 184, 0.6);
    text-align: right;
  }

  .feedback-context-note {
    font-size: 0.72rem;
    color: rgba(148, 163, 184, 0.6);
    margin: 0;
  }

  .feedback-error {
    font-size: 0.78rem;
    color: #f87171;
    margin: 0;
  }

  .feedback-success {
    font-size: 0.88rem;
    color: #86efac;
    margin: 0.25rem 0;
  }

  .feedback-success-panel {
    display: grid;
    gap: 0.5rem;
  }

  .feedback-triage-link {
    width: fit-content;
    border-radius: 0.5rem;
    border: 1px solid rgba(134, 239, 172, 0.35);
    color: #bbf7d0;
    padding: 0.4rem 0.65rem;
    font-size: 0.78rem;
    font-weight: 600;
    text-decoration: none;
  }

  .feedback-triage-link:hover,
  .feedback-triage-link:focus-visible {
    border-color: rgba(187, 247, 208, 0.72);
    background: rgba(21, 128, 61, 0.18);
    outline: none;
  }

  .feedback-submit {
    border-radius: 0.5rem;
    border: 1px solid rgba(125, 211, 252, 0.5);
    background: rgba(21, 48, 77, 0.8);
    color: #dbeafe;
    padding: 0.4rem 0.8rem;
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition:
      background 160ms ease,
      border-color 160ms ease;
  }

  .feedback-submit:hover:not(:disabled),
  .feedback-submit:focus-visible:not(:disabled) {
    background: rgba(34, 74, 117, 0.95);
    border-color: rgba(191, 219, 254, 0.82);
    outline: none;
  }

  .feedback-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
