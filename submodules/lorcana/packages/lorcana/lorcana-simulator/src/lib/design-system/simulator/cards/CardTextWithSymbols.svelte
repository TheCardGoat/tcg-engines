<script lang="ts">
import { SYMBOL_BASE_URL, tokenizeTextWithSymbols } from "./symbol-tokenizer.js";

interface Props {
  text: string;
}

const { text }: Props = $props();

const tokens = $derived(tokenizeTextWithSymbols(text));
</script>

{#each tokens as token, i (i)}
  {#if token.type === "symbol"}
    <img
      src={`${SYMBOL_BASE_URL}/${token.file}`}
      alt={token.code}
      class="inline-symbol"
    />
  {:else}
    {token.value}
  {/if}
{/each}

<style>
  .inline-symbol {
    display: inline-block;
    width: 0.9em;
    height: 0.9em;
    margin: 0 0.06em;
    vertical-align: -0.1em;
    object-fit: contain;
  }
</style>
