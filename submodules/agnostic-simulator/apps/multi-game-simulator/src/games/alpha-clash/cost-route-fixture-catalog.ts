export const costRouteFixtures = [
  {
    id: "prompt-cost-routes",
    title: "Shadowlight · Normal or alternative cost",
    description:
      "Pay resources or return your white Shadowlight to hand. Try an incomplete resource payment, retry, change route, and cancel before paying.",
  },
  {
    id: "prompt-additional-cost",
    title: "Chaotic Unmaking · Required additional cost",
    description:
      "Discard one other hand card and pay three resources. The native command rejects missing or repeated payments.",
  },
  {
    id: "prompt-discount-cost",
    title: "Enter from Beyond · Optional additional cost",
    description:
      "Player 2 attacks with Sonoro; Player 1 responds. Pay two resources, or discard a card and pay one. Changing route clears payment choices.",
  },
] as const;
