import { baseSpellEffect, generateStatusEffectChange } from "../specialSpells.js";
import { loadMacroFile, generateMacroChange, generateItemMacroFlag } from "../macros.js";

export async function hideousLaughterEffect(document) {
  let effect = baseSpellEffect(document, document.name);
  effect.changes.push(
    generateStatusEffectChange("Incapacitated"),
    generateStatusEffectChange("Prone"),
  );

  effect.changes.push({
    key: "flags.midi-qol.OverTime",
    mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
    value: "label=Hideous Laughter (End of Turn),turn=end,saveDC=@attributes.spelldc,saveAbility=wis,saveMagic=true,killAnim=true",
    priority: "20",
  });

  const itemMacroText = await loadMacroFile("spell", "hideousLaughter.js");

  document.flags["itemacro"] = generateItemMacroFlag(document, itemMacroText);
  effect.changes.push(generateMacroChange(""));
  document.effects.push(effect);

  return document;
}
