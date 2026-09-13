# Effect disclosure and private sources

An active effect's disclosed origin and its source card's current visibility
are separate facts. The effect ledger may retain the former without exposing
the latter. This is an implementation policy derived from the rules below;
the Comprehensive Rules do not prescribe a digital effect-ledger UI.

## Rules basis

- [CR 3.14.1 and 3.0.8](https://rules.fabtcg.com/en/cr/03-zones/): pitch is
  public, and a private object moving to a public destination becomes public
  before movement. A pre-pitch hand snapshot must not decide the audience of
  the resulting triggered layer.
- [CR 5.2.4b and 5.4.7b](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/):
  activating a private source discloses it; opting to trigger a hidden ability
  also discloses its source. The source can subsequently become private again.
- [CR 6.2.2a and 6.2.3a](https://rules.fabtcg.com/en/cr/06-effects/):
  layer-continuous effects last for their specified duration/applicability;
  static-continuous effects last only while their abilities are functional.
  Do not infer that every internal continuous effect has been announced.
- [CR 5.4.5a and 5.4.7a](https://rules.fabtcg.com/en/cr/05-layers-cards-abilities/):
  property-static abilities function even in private zones, and explicitly
  private while-static abilities can function without prior public disclosure.
  Exposing an anonymous modifier or an effect count could identify such a card.

No applicable erratum was found in the rules skill's errata index for the
representative cards. The linked CR and card sources were checked on 2026-09-04.

## Representative cases

| Case | Expected disclosure |
| --- | --- |
| Authority of Ataya pitched to pay for an attack | Both players and spectators identify its lasting defense-reaction surcharge. |
| Authority followed by Potion of Déjà Vu | Keep the known effect and artwork; omit any link to the physical card now in the deck. |
| Deny Redemption activated from hand | Its lasting life-gain restriction names Deny Redemption after activation. Merely holding the card creates no public artifact. |
| Skybody Keikoi activated while cloaked | The declared activation and resulting prevention are public. An unactivated cloaked card does not advertise its prevention. |
| Mutated Mass held in hand | Its private property-static modifiers are visible only to its owner; opponents and spectators receive no effect entry or source definition. |

[Potion of Déjà Vu's official release notes](https://legacy.fabtcg.com/en/resources/rules-and-policy-center/release-notes/everfest/)
explicitly distinguish the known cards from their unknown order in the deck.
[Deny Redemption](https://cards.fabtcg.com/card/deny-redemption-1/) and
[Skybody Keikoi](https://cards.fabtcg.com/card/skybody-keikoi/) provide private
hand and face-down activation examples respectively.

## Engine boundary

`disclosedFabLayerSource` records public disclosure on the declared layer's
source snapshot. Event-boundary LKI and the physical card's face-down markers
remain intact. Continuous effects, delayed triggers, and persisted prevention
inherit the layer's historical source.

Viewer projection omits effects whose source has not been disclosed to that
viewer. For a known effect, canonical identity and name remain available, but
`source.instanceId` is present only while its physical card is public. Viewer
resources include the known card definition for reconnect/rendering, without
inserting private card instances into the identity map.

`packages/engine/src/viewer-effects.test.ts` covers these public moves,
spectator projection, hidden-source movement, and snapshot restoration.
The simulator fixtures `authority-effect-owner`, `authority-effect-opponent`,
and `authority-effect-hidden-source` render the actual engine projection.

Current public visibility also establishes a known source, including for older
effects carrying a stale private snapshot. If an older effect's source is now
private too, no blanket reveal or speculative repair is performed.
