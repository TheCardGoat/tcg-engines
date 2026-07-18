<script lang="ts">
  import { locales } from "$lib/paraglide/runtime.js";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuTrigger,
  } from "$lib/design-system/primitives/dropdown-menu";
  import { Button } from "$lib/design-system/primitives/button";
  import { m } from "$lib/i18n/messages.js";
  import Globe2 from "@lucide/svelte/icons/globe-2";
  import Check from "@lucide/svelte/icons/check";
  import type { SupportedLocale } from "@/features/settings/player-settings-store.svelte.js";

  interface Props {
    selectedLocale: SupportedLocale;
    onLocaleSelection: (locale: SupportedLocale) => void;
  }

  let { selectedLocale, onLocaleSelection }: Props = $props();

  function localeLabel(locale: SupportedLocale): string {
    return {
      en: m["sim.locale.name.en"]({}),
      es: m["sim.locale.name.es"]({}),
      de: m["sim.locale.name.de"]({}),
      it: m["sim.locale.name.it"]({}),
      "pt-br": m["sim.locale.name.pt-br"]({}),
    }[locale];
  }
</script>

<DropdownMenu>
  <DropdownMenuTrigger>
    {#snippet child({ props })}
      <Button
        variant="ghost"
        size="sm"
        class="h-11 shrink-0 rounded-none border-0 bg-transparent px-2 text-slate-100 shadow-none hover:bg-white/10 hover:text-white"
        aria-label={m["sim.settings.languageLabel"]({})}
        {...props}
      >
        <Globe2 class="size-4 shrink-0 opacity-90 sm:mr-2" aria-hidden="true" />
        <span class="hidden text-sm font-semibold sm:inline">{selectedLocale.toUpperCase()}</span>
      </Button>
    {/snippet}
  </DropdownMenuTrigger>
  <DropdownMenuPortal>
    <DropdownMenuContent align="end" class="w-56 border-white/10 bg-slate-950/98 text-slate-100">
      <DropdownMenuLabel class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
        {m["sim.settings.languageLabel"]({})}
      </DropdownMenuLabel>
      {#each locales as locale (locale)}
        {@const supportedLocale = locale as SupportedLocale}
        <DropdownMenuItem
          class="flex items-center justify-between gap-3"
          onclick={() => onLocaleSelection(supportedLocale)}
        >
          <span>{localeLabel(supportedLocale)}</span>
          {#if selectedLocale === supportedLocale}
            <Check class="size-4 text-sky-300" aria-hidden="true" />
          {/if}
        </DropdownMenuItem>
      {/each}
    </DropdownMenuContent>
  </DropdownMenuPortal>
</DropdownMenu>
