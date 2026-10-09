<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import X from "@lucide/svelte/icons/x";
  import * as Popover from "$lib/design-system/primitives/popover/index.js";
  import type { Snippet } from "svelte";

  interface SimulatorSupportReminderProps {
    text: string;
    open?: boolean;
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    onOpen?: () => void;
    onDismiss?: () => void;
    child: Snippet<[ { props: Record<string, unknown> } ]>;
  }

  let {
    text,
    open = $bindable(false),
    side = "top",
    align = "center",
    onOpen,
    onDismiss,
    child: trigger,
  }: SimulatorSupportReminderProps = $props();

  function handleOpenClick(): void {
    open = false;
    onOpen?.();
  }

  function handleDismissClick(): void {
    open = false;
    onDismiss?.();
  }
</script>

<Popover.Root bind:open>
  <Popover.Trigger>
    {#snippet child({ props })}
      <!-- This button opens Support, not the reminder. Keep native button keyboard activation. -->
      {@render trigger({ props: { ...props, onclick: () => { open = false; }, onkeydown: undefined } })}
    {/snippet}
  </Popover.Trigger>

  <Popover.Content
    {side}
    {align}
    sideOffset={10}
    class="support-reminder-tooltip"
    aria-label={text}
    trapFocus={false}
    onOpenAutoFocus={(event) => event.preventDefault()}
    onCloseAutoFocus={(event) => event.preventDefault()}
  >
    <div class="support-reminder-tooltip__body">
      <p class="support-reminder-tooltip__text">{text}</p>
      <div class="support-reminder-tooltip__actions">
        <button
          type="button"
          class="support-reminder-tooltip__cta"
          onclick={handleOpenClick}
        >
          {m["sim.support.reportBugLabel"]({})}
        </button>
        <button
          type="button"
          class="support-reminder-tooltip__dismiss"
          onclick={handleDismissClick}
          aria-label={m["sim.support.dismissReminderLabel"]({})}
        >
          <X class="size-3.5" />
        </button>
      </div>
    </div>
  </Popover.Content>
</Popover.Root>

<style>
  :global(.support-reminder-tooltip) {
    max-width: min(18rem, calc(100vw - 1.5rem));
    border: 1px solid rgba(125, 211, 252, 0.32);
    background:
      linear-gradient(180deg, rgba(16, 32, 54, 0.98), rgba(8, 18, 32, 0.98)) !important;
    color: #eff6ff !important;
    box-shadow: 0 18px 44px rgba(2, 6, 23, 0.46);
    padding: 0.7rem 0.72rem 0.66rem !important;
  }

  .support-reminder-tooltip__body {
    display: grid;
    gap: 0.55rem;
  }

  .support-reminder-tooltip__text {
    margin: 0;
    font-size: 0.74rem;
    line-height: 1.45;
    color: rgba(239, 246, 255, 0.95);
  }

  .support-reminder-tooltip__actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .support-reminder-tooltip__cta,
  .support-reminder-tooltip__dismiss {
    border: 0;
    cursor: pointer;
  }

  .support-reminder-tooltip__cta {
    min-height: 1.85rem;
    border-radius: 999px;
    background: linear-gradient(180deg, rgba(56, 189, 248, 0.32), rgba(3, 105, 161, 0.55));
    padding: 0.38rem 0.72rem;
    color: #f8fafc;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.01em;
  }

  .support-reminder-tooltip__dismiss {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.85rem;
    height: 1.85rem;
    border-radius: 999px;
    background: rgba(30, 41, 59, 0.7);
    color: rgba(191, 219, 254, 0.9);
    transition: background 140ms ease, color 140ms ease;
  }

  .support-reminder-tooltip__cta:hover,
  .support-reminder-tooltip__cta:focus-visible,
  .support-reminder-tooltip__dismiss:hover,
  .support-reminder-tooltip__dismiss:focus-visible {
    outline: none;
  }

  .support-reminder-tooltip__cta:hover,
  .support-reminder-tooltip__cta:focus-visible {
    background: linear-gradient(180deg, rgba(125, 211, 252, 0.46), rgba(2, 132, 199, 0.72));
  }

  .support-reminder-tooltip__dismiss:hover,
  .support-reminder-tooltip__dismiss:focus-visible {
    background: rgba(51, 65, 85, 0.96);
    color: #f8fafc;
  }
</style>
