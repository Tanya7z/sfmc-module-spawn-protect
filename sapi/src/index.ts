/**
 * @sfmc-bds/module-spawn-protect — 进服/复活短时抗性保护
 */

import { world, type PlayerSpawnAfterEvent } from "@minecraft/server";
import { ModuleRegistry } from "@sfmc-bds/sdk/module-loader";
import { debug } from "@sfmc-bds/sdk/sapi/runtime";
import {
  AMPLIFIER,
  DURATION_TICKS,
  EFFECT_ID,
  shouldApplyResistance,
} from "./protect.js";

const MODULE_ID = "spawn-protect";
const eventCleanups: Array<() => void> = [];

function applySpawnProtect(player: PlayerSpawnAfterEvent["player"]): void {
  try {
    const existing = player.getEffect(EFFECT_ID);
    if (!shouldApplyResistance(existing?.amplifier, existing?.duration)) {
      return;
    }
    player.addEffect(EFFECT_ID, DURATION_TICKS, {
      amplifier: AMPLIFIER,
      showParticles: false,
    });
  } catch (err) {
    debug.w(
      "SpawnProtect",
      `施加抗性失败: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

ModuleRegistry.register({
  id: MODULE_ID,
  afterWorldLoad: false,
  lifecycle: {
    registerPermissions() {
      // 无命令面
    },
    registerEvents() {
      const cb = world.afterEvents.playerSpawn.subscribe(
        (ev: PlayerSpawnAfterEvent) => {
          applySpawnProtect(ev.player);
        },
      );
      eventCleanups.push(() => {
        try {
          world.afterEvents.playerSpawn.unsubscribe(cb);
        } catch {
          /* ignore */
        }
      });
    },
    init() {
      debug.i(
        "SpawnProtect",
        `init duration=${DURATION_TICKS} amp=${AMPLIFIER}`,
      );
    },
    cleanup() {
      for (const c of eventCleanups.splice(0, eventCleanups.length)) c();
      debug.i("SpawnProtect", "cleanup");
    },
  },
});
