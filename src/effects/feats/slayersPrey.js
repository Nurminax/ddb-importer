import { baseFeatEffect } from "../specialFeats.js";
import { loadMacroFile, generateItemMacroFlag } from "../macros.js";

// this one is a bit different, the macro is triggered by midi-qol and applies effects to the actor
// the Marked effect gets applied to the target
export async function slayersPreyEffect(document) {
  let effect = baseFeatEffect(document, `Marked by ${document.name}`);
  effect.changes.push(
    {
      key: "flags.dae.onUpdateSource",
      mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
      value: document.name,
      priority: 20,
    },
  );
  effect.transfer = false;
  effect.duration.seconds = 60;
  document.effects.push(effect);

  let damageBonusEffect = baseFeatEffect(document, document.name);
  damageBonusEffect.changes.push({
    key: "flags.dnd5e.DamageBonusMacro",
    value: "ItemMacro",
    mode: CONST.ACTIVE_EFFECT_MODES.CUSTOM,
    priority: 20,
  });
  damageBonusEffect.transfer = true;

  setProperty(damageBonusEffect, "flags.dae.transfer", true);
  document.effects.push(damageBonusEffect);

  const itemMacroText = await loadMacroFile("feat", "slayersPrey.js");
  setProperty(document, "flags.itemacro", generateItemMacroFlag(document, itemMacroText));
  setProperty(document, "flags.midi-qol.onUseMacroName", "[postActiveEffects]ItemMacro");

  setProperty(document, "system.actionType", "util");
  document.system.damage.parts = [];
  document.system.target = {
    value: 1,
    width: null,
    units: "",
    type: "creature",
  };
  document.system.range = {
    value: null,
    long: null,
    units: "",
  };

  return document;
}
