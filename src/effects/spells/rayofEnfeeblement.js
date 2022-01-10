import { baseSpellEffect } from "../specialSpells.js";
import { loadMacroFile, generateMacroChange, generateMacroFlags } from "../macros.js";

export async function rayofEnfeeblementEffect(document) {
  let effect = baseSpellEffect(document, document.name);
  effect.changes.push({
    key: "flags.midi-qol.OverTime",
    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
    value: `label=${document.name},turn=end,saveDC=@attributes.spelldc,saveAbility=con,savingThrow=true,saveMagic=true`,
    priority: "20",
  });
  // MACRO START
  const itemMacroText = await loadMacroFile("spell", "rayofEnfeeblement.js");
  // MACRO STOP
  document.flags["itemacro"] = generateMacroFlags(document, itemMacroText);
  effect.changes.push(generateMacroChange(""));
  document.effects.push(effect);

  return document;
}