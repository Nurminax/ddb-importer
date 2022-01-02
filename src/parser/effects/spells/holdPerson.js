import { baseSpellEffect, generateStatusEffectChange } from "../specialSpells.js";

export function holdPersonEffect(document) {
  let effect = baseSpellEffect(document, document.name);
  effect.changes.push(generateStatusEffectChange("Paralyzed"));
  document.effects.push(effect);

  return document;
}
