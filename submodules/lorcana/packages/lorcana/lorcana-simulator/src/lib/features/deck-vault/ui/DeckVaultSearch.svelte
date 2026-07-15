<script lang="ts">
  import { Input } from "$lib/design-system/primitives/input";
  import { m } from "$lib/i18n/messages.js";
  import Search from "@lucide/svelte/icons/search";

  interface Props {
    value: string;
    onSearch: (query: string) => void;
    placeholder?: string;
  }

  let { value = $bindable(), onSearch, placeholder }: Props = $props();

  let searchTimeout: ReturnType<typeof setTimeout> | undefined;

  function handleInput(e: Event) {
    const inputValue = (e.target as HTMLInputElement).value;
    value = inputValue;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      onSearch(inputValue);
    }, 300);
  }

  $effect(() => {
    return () => {
      clearTimeout(searchTimeout);
    };
  });
</script>

<div class="relative">
  <Search class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
  <Input
    placeholder={placeholder ?? m["sim.deckVault.search.placeholder"]({})}
    {value}
    oninput={handleInput}
    aria-label={m["sim.deckVault.search.aria"]?.({})}
    class="pl-9"
  />
</div>
