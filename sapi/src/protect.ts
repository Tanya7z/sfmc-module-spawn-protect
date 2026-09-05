/** 出生保护常量与判定（纯函数，便于单测）。 */

/** 药水效果标识 */
export const EFFECT_ID = "minecraft:resistance";
/** 保护时长（ticks） */
export const DURATION_TICKS = 60;
/** 效果等级（amplifier） */
export const AMPLIFIER = 5;

/**
 * 若玩家已有同等或更高抗性则跳过，避免逆向缩减。
 */
export function shouldApplyResistance(
  existingAmplifier: number | undefined,
  existingDuration: number | undefined,
): boolean {
  if (existingAmplifier === undefined) return true;
  if (existingAmplifier > AMPLIFIER) return false;
  if (existingAmplifier === AMPLIFIER && (existingDuration ?? 0) >= DURATION_TICKS) return false;
  return true;
}
