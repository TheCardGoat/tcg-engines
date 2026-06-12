<script lang="ts">
  import { Button } from '$lib/design-system/primitives/button';
  import { Select } from '$lib/design-system/primitives/select';
  import { m } from '$lib/i18n/messages.js';
  import Bot from '@lucide/svelte/icons/bot';
  import Loader from '@lucide/svelte/icons/loader-circle';
  import LogIn from '@lucide/svelte/icons/log-in';

  interface Props {
    isAuthenticated: boolean;
    hasSelectedDeck: boolean;
    practiceLoading: boolean;
    practiceError: string | null;
    selectedBotFixtureId: string;
    selectedBotStrategyId: string;
    botFixtureOptions: Array<{ value: string; label: string }>;
    botStrategyOptions: Array<{ value: string; label: string }>;
    botStrategyDescription: string;
    onBotFixtureChange: (fixtureId: string) => void;
    onBotStrategyChange: (strategyId: string) => void;
    onStartPracticeMatch: () => void | Promise<void>;
  }

  let {
    isAuthenticated,
    hasSelectedDeck,
    practiceLoading,
    practiceError,
    selectedBotFixtureId,
    selectedBotStrategyId,
    botFixtureOptions,
    botStrategyOptions,
    botStrategyDescription,
    onBotFixtureChange,
    onBotStrategyChange,
    onStartPracticeMatch,
  }: Props = $props();
</script>

<div class="flex flex-col gap-3">
  <p
    class="overflow-hidden text-xs leading-5 text-slate-300 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
  >
    {m['sim.matchmaking.quickMatch.description']({})}
  </p>

  <div class="grid gap-3">
    <div class="space-y-2">
      <label
        class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400"
        for="matchmaking-bot-fixture-select"
      >
        Bot deck
      </label>
      <Select
        id="matchmaking-bot-fixture-select"
        aria-label="Bot deck"
        value={selectedBotFixtureId}
        onchange={(event) =>
          onBotFixtureChange(
            (event.currentTarget as HTMLSelectElement).value,
          )}
      >
        <option value="">Automatic opponent</option>
        {#each botFixtureOptions as fixture}
          <option value={fixture.value}>{fixture.label}</option>
        {/each}
      </Select>
    </div>

    <div class="space-y-2">
      <label
        class="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400"
        for="matchmaking-bot-strategy-select"
      >
        Bot strategy
      </label>
      <Select
        id="matchmaking-bot-strategy-select"
        aria-label="Bot strategy"
        value={selectedBotStrategyId}
        onchange={(event) =>
          onBotStrategyChange(
            (event.currentTarget as HTMLSelectElement).value,
          )}
      >
        <option value="">Automatic strategy</option>
        {#each botStrategyOptions as strategy}
          <option value={strategy.value}>{strategy.label}</option>
        {/each}
      </Select>
      <p class="text-xs leading-5 text-slate-400">
        {botStrategyDescription}
      </p>
    </div>
  </div>

  <Button
    class="mt-auto h-10 w-full text-sm sm:text-base"
    disabled={practiceLoading || !hasSelectedDeck}
    onclick={onStartPracticeMatch}
  >
    {#if practiceLoading}
      <Loader class="mr-2 size-5 animate-spin" />
      {m['sim.matchmaking.practice.creatingMatch']({})}
    {:else if !isAuthenticated}
      <LogIn class="mr-2 size-4" />
      {m['sim.matchmaking.practice.cta']({})}
    {:else}
      <Bot class="mr-2 size-5" />
      {m['sim.matchmaking.practice.cta']({})}
    {/if}
  </Button>

  {#if practiceError}
    <div
      class="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm leading-6 text-rose-200"
      role="alert"
    >
      {practiceError}
    </div>
  {/if}
</div>
