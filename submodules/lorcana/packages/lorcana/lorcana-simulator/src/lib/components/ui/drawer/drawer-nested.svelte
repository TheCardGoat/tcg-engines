<script lang="ts">
	import { Dialog } from "bits-ui";

	let {
		shouldScaleBackground = true,
		open = $bindable(false),
		activeSnapPoint = $bindable(null),
		direction = "bottom",
		...restProps
	}: Dialog.RootProps & {
		shouldScaleBackground?: boolean;
		activeSnapPoint?: number | string | null;
		direction?: "top" | "bottom" | "left" | "right";
	} = $props();
</script>

<Dialog.Root bind:open {...restProps} />
