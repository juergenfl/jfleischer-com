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
}

export function setHoveredCluster(index: number) {
  sceneState.hovered = index
}
