<script lang="ts">
  import ChevronUpIcon from "@lucide/svelte/icons/chevron-up";
  import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
  import { m } from "$lib/i18n/messages.js";
  import type { SimulatorLayoutMode } from "@/features/simulator/model/layout-mode.svelte.js";

  interface HandZoneTuckHarnessProps {
    layoutMode?: SimulatorLayoutMode;
    topTucked?: boolean;
    bottomTucked?: boolean;
  }

  let {
    layoutMode = "desktop",
    topTucked = false,
    bottomTucked = false,
  }: HandZoneTuckHarnessProps = $props();
</script>

<section class="hand-tuck-harness" data-layout-mode={layoutMode} data-testid="hand-zone-tuck-harness">
  <div
    class="chrome-slot chrome-slot--hand chrome-slot--top"
    class:chrome-slot--tucked={topTucked}
    data-hand-shell-side="playerOne"
    data-hand-tucked={topTucked}
  ></div>
  {#if layoutMode === "desktop"}
    <button
      type="button"
      class="desktop-hand-toggle desktop-hand-toggle--top"
      class:desktop-hand-toggle--visible={topTucked}
      aria-label={topTucked ? m["sim.hand.show"]({}) : m["sim.hand.hide"]({})}
      aria-pressed={topTucked}
      data-testid="hand-tuck-toggle-playerOne"
    >
      <span class="desktop-hand-toggle__label">
        {topTucked ? m["sim.hand.show"]({}) : m["sim.hand.hide"]({})}
      </span>
      {#if topTucked}
        <ChevronDownIcon class="size-4" />
      {:else}
        <ChevronUpIcon class="size-4" />
      {/if}
    </button>
  {/if}

  <div
    class="chrome-slot chrome-slot--hand chrome-slot--bottom"
    class:chrome-slot--tucked={bottomTucked}
    data-hand-shell-side="playerTwo"
    data-hand-tucked={bottomTucked}
  ></div>
  {#if layoutMode === "desktop"}
    <button
      type="button"
      class="desktop-hand-toggle desktop-hand-toggle--bottom"
      class:desktop-hand-toggle--visible={bottomTucked}
      aria-label={bottomTucked ? m["sim.hand.show"]({}) : m["sim.hand.hide"]({})}
      aria-pressed={bottomTucked}
      data-testid="hand-tuck-toggle-playerTwo"
    >
      <span class="desktop-hand-toggle__label">
        {bottomTucked ? m["sim.hand.show"]({}) : m["sim.hand.hide"]({})}
      </span>
      {#if bottomTucked}
        <ChevronUpIcon class="size-4" />
      {:else}
        <ChevronDownIcon class="size-4" />
      {/if}
    </button>
  {/if}
</section>

<style>
  .hand-tuck-harness {
    position: relative;
    min-height: 20rem;
  }

  .chrome-slot {
    position: absolute;
    left: 0.45rem;
    right: 0.45rem;
  }

  .chrome-slot--top {
    top: 0.45rem;
  }

  .chrome-slot--bottom {
    bottom: 0.45rem;
  }

  .desktop-hand-toggle {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .desktop-hand-toggle--top {
    top: 0.35rem;
  }

  .desktop-hand-toggle--bottom {
    bottom: 0.35rem;
  }
</style>
