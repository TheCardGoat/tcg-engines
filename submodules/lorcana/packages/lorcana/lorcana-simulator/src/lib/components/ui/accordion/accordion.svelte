<script lang="ts">
	import { Accordion as AccordionPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";

	type AccordionSingleRootProps = Extract<AccordionPrimitive.RootProps, { type: "single" }>;
	type AccordionMultipleRootProps = Extract<AccordionPrimitive.RootProps, { type: "multiple" }>;

	let {
		ref = $bindable(null),
		type,
		value,
		onValueChange,
		class: className,
		...restProps
	}: AccordionPrimitive.RootProps = $props();
</script>

{#if type === "multiple"}
	<AccordionPrimitive.Root
		bind:ref
		type={type}
		value={value as AccordionMultipleRootProps["value"]}
		onValueChange={onValueChange as AccordionMultipleRootProps["onValueChange"]}
		data-slot="accordion"
		class={cn("cn-accordion flex w-full flex-col", className)}
		{...restProps}
	/>
{:else}
	<AccordionPrimitive.Root
		bind:ref
		type={type}
		value={value as AccordionSingleRootProps["value"]}
		onValueChange={onValueChange as AccordionSingleRootProps["onValueChange"]}
		data-slot="accordion"
		class={cn("cn-accordion flex w-full flex-col", className)}
		{...restProps}
	/>
{/if}
