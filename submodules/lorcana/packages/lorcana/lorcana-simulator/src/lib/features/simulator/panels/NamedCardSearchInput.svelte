<script lang="ts">
  import { m } from "$lib/i18n/messages.js";
  import type { NamedCardSearchEntry } from "./named-card-search.js";

  interface NamedCardSearchInputProps {
    query: string;
    results: NamedCardSearchEntry[];
    oninput: (query: string) => void;
    onselect: (cardName: string, displayLabel: string) => void;
    compact?: boolean;
  }

  let { query, results, oninput, onselect, compact = false }: NamedCardSearchInputProps = $props();

  function handleInput(event: Event): void {
    oninput((event.currentTarget as HTMLInputElement).value);
  }
</script>

<div class="named-card-search" class:named-card-search--compact={compact}>
  <input
    class="named-card-search__input"
    type="search"
    placeholder={m["sim.actions.namedCardSearch.placeholder"]({})}
    value={query}
    oninput={handleInput} />

  {#if results.length > 0}
    <ul class="named-card-search__results">
      {#each results as result (result.id)}
        <li>
          <button
            type="button"
            class="named-card-search__result"
            class:named-card-search__result--selected={result.selected}
            onclick={() => onselect(result.name, result.label)}
          >
            {result.label}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .named-card-search {
    padding: 0 0.2rem 0.5rem;
  }

  .named-card-search--compact {
    padding: 0;
  }

  .named-card-search__input {
    width: 100%;
    border: 1px solid rgba(109, 149, 195, 0.24);
    border-radius: 0.8rem;
    background: rgba(15, 30, 49, 0.72);
    color: #e4edf8;
    font-size: 0.76rem;
    padding: 0.72rem 0.82rem;
  }

  .named-card-search--compact .named-card-search__input {
    padding: 0.5rem 0.65rem;
    font-size: 0.74rem;
    border-radius: 0.6rem;
  }

  .named-card-search__input::placeholder {
    color: #8ea7c4;
  }

  .named-card-search__results {
    list-style: none;
    margin: 0.35rem 0 0;
    padding: 0;
    display: grid;
    gap: 0.15rem;
    max-height: 12rem;
    overflow-y: auto;
  }

  .named-card-search--compact .named-card-search__results {
    max-height: 8rem;
  }

  .named-card-search__result {
    width: 100%;
    text-align: left;
    padding: 0.45rem 0.65rem;
    border-radius: 0.55rem;
    border: 1px solid transparent;
    background: rgba(15, 30, 49, 0.52);
    color: #dce9f8;
    font-size: 0.74rem;
    cursor: pointer;
    transition: background-color 100ms ease, border-color 100ms ease;
  }

  .named-card-search__result:hover {
    background: rgba(25, 50, 80, 0.72);
    border-color: rgba(109, 149, 195, 0.28);
  }

  .named-card-search__result--selected {
    background: rgba(102, 72, 18, 0.56);
    border-color: rgba(247, 197, 110, 0.46);
    color: #fff4dd;
  }
</style>
