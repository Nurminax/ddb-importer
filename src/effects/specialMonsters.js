import CompendiumHelper from "../lib/CompendiumHelper.js";
import { effectModules, forceItemEffect } from "./effects.js";
import { configureDependencies } from "./macros.js";

import { absorptionEffect } from "./monsterFeatures/absorbtion.js";
import { generateLegendaryEffect } from "./monsterFeatures/legendary.js";
import { generateOverTimeEffect } from "./monsterFeatures/overTimeEffect.js";
import { generatePackTacticsEffect } from "./monsterFeatures/packTactics.js";

export function baseMonsterFeatureEffect(document, label) {
  return {
    label,
    icon: document.img,
    changes: [],
    duration: {},
    tint: "",
    transfer: false,
    disabled: false,
    flags: {
      dae: {
        transfer: false,
        stackable: "none",
      },
      ddbimporter: {
        disabled: false,
      },
      "midi-qol": { // by default force CE effect usage to off
        forceCEOff: true,
      },
    },
  };
}

function transferEffectsToActor(document) {
  if (!document.effects) document.effects = [];
  const compendiumLabel = CompendiumHelper.getCompendiumLabel("monsters");

  // loop over items and item effect and transfer any effects to the actor
  document.items.forEach((item) => {
    item.effects.forEach((effect) => {
      if (effect.transfer) {
        const transferEffect = duplicate(effect);
        if (!hasProperty(item, "_id")) item._id = randomID();
        if (!hasProperty(effect, "_id")) effect._id = randomID();
        transferEffect._id = randomID();
        transferEffect.transfer = false;
        transferEffect.origin = `Compendium.${compendiumLabel}.${document._id}.Item.${item._id}`;
        document.effects.push(transferEffect);
      }
    });
  });

  return document;
}

/**
 * This function is mainly for effects that can't be dynamically generated
 * @param {*} document
 */
export async function monsterFeatureEffectAdjustment(document, monster) {
  if (!document.effects) document.effects = [];

  const deps = effectModules();
  if (!deps.hasCore) {
    return document;
  }
  if (!CONFIG.DDBI.EFFECT_CONFIG.MODULES.configured) {
    CONFIG.DDBI.EFFECT_CONFIG.MODULES.configured = configureDependencies();
  }

  // const name = document.flags.ddbimporter?.originalName ?? document.name;

  // absorbtion on monster
  document = absorptionEffect(document);

  // damage over time effects
  document.items.forEach(function(item, index) {
    // Legendary Resistance Effects
    if (item.name.startsWith("Legendary Resistance")) item = generateLegendaryEffect(item);
    if (item.name.startsWith("Pack Tactics")) item = generatePackTacticsEffect(item);
    // auto overtime effect
    const overTimeResults = generateOverTimeEffect(item, document, monster);
    this[index] = overTimeResults.document;
    document = overTimeResults.actor;

    document = forceItemEffect(document);
  }, document.items);

  document = transferEffectsToActor(document);
  return document;
}
