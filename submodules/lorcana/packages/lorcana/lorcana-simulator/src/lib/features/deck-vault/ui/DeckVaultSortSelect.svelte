<script lang="ts">
  import { Select } from "$lib/design-system/primitives/select";

  interface Props {
    value: string;
    onSort: (sort: string) => void;
    options?: Array<{ value: string; label: string }>;
    "aria-label"?: string;
  }

  const DEFAULT_OPTIONS = [
    { value: "newest", label: "Newest" },
    { value: "updated", label: "Last Updated" },
    { value: "name", label: "Name" },
  ];

  let { value = $bindable(), onSort, options = DEFAULT_OPTIONS, "aria-label": ariaLabel }: Props = $props();
</script>

<Select
  {value}
  aria-label={ariaLabel}
  onchange={(e: Event) => {
    const newValue = (e.currentTarget as HTMLSelectElement).value;
    value = newValue;
    onSort(newValue);
  }}
  class="w-36"
>
  {#each options as opt}
    <option value={opt.value}>{opt.label}</option>
  {/each}
</Select>
