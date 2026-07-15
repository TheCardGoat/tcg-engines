<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import * as Dialog from "$lib/design-system/primitives/dialog";
  import { submitFeedback } from "@/features/simulator/support/feedback-api.js";
  import SupportProcessNote from "@/features/simulator/support/SupportProcessNote.svelte";

  interface SimulatorFeedbackDialogProps {
    open?: boolean;
  }

  let { open = $bindable(false) }: SimulatorFeedbackDialogProps = $props();

  let message = $state("");
  let status = $state<"idle" | "submitting" | "success" | "error">("idle");
  let errorText = $state("");

  const MAX_LENGTH = 2000;

  let dialogEpoch = $state(0);
  let nextDialogEpoch = 0;
  let wasOpen = open;

  $effect(() => {
    if (wasOpen && !open) {
      nextDialogEpoch += 1;
      dialogEpoch = nextDialogEpoch;
      message = "";
      status = "idle";
      errorText = "";
    }

    wasOpen = open;
  });

  async function handleSubmit() {
    if (!message.trim() || status === "submitting") return;

    const epoch = dialogEpoch;
    status = "submitting";
    errorText = "";

    try {
      await submitFeedback({ message: message.trim(), source: "simulator" });
      if (epoch !== dialogEpoch) return;
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
          {m["sim.support.shareFeedbackLabel"]({})}
        </Dialog.Title>
        <Dialog.Description class="text-sm text-slate-400">
          {m["sim.support.shareFeedbackDescription"]({})}
        </Dialog.Description>
      </Dialog.Header>
      <SupportProcessNote />

      {#if status === "success"}
        <p class="feedback-success">{m["sim.support.submitSuccess"]({})}</p>
      {:else}
        <div class="feedback-form">
          <textarea
            class="feedback-textarea"
            placeholder={m["sim.support.feedbackPlaceholder"]({})}
            maxlength={MAX_LENGTH}
            bind:value={message}
            disabled={status === "submitting"}
            rows={5}
          ></textarea>
          <span class="feedback-char-count">{message.length} / {MAX_LENGTH}</span>
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
            disabled={!message.trim() || status === "submitting"}
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
