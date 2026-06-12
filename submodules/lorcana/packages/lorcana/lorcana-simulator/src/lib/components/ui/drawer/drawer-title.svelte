<script lang="ts">
	import { Dialog } from "bits-ui";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: Dialog.TitleProps = $props();
</script>

<Dialog.Title
	bind:ref
	data-slot="drawer-title"
	class={cn("text-foreground text-base font-medium", className)}
	{...restProps}
/>
