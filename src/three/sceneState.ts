/**
 * Imperative bridge between the DOM and the r3f frame loop.
 *
 * The scene reads these every frame; nothing here should trigger a React
 * re-render, so it is a plain mutable singleton rather than state.
 */
export const sceneState = {
  /** 0 = core blob in the hero, 1 = network graph behind the directory */
  morph: 0,
  /** hovered directory cluster index (0..5), -1 = none */
  hovered: -1,
  /** pointer in NDC; tracked on window because the canvas sits behind the page */
  pointer: [0, 0] as [number, number],
  /**
   * How hard the pointer pushes the cloud, in world units. A mouse pushes
   * whenever it is over the page; a finger only while it is down, because on
   * touch a sustained drag is how you scroll.
   */
  pointerPush: 0,
  /**
   * Set when the pointer teleports rather than travels — a finger landing. The
   * scene snaps to it instead of sweeping a dent across the cloud on the way.
   */
  pointerJump: false,
}

/**
 * How far the pointer throws a particle, in world units. Shared by mouse and
 * touch: the shader scales it by the fit, so a finger on a phone dents the
 * cloud exactly as much, relative to its size, as a cursor does on a desktop.
 */
export const POINTER_PUSH = 0.42

export function setHoveredCluster(index: number) {
  sceneState.hovered = index
}
