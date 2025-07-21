import World from "./World"

@cc._decorator.ccclass
export default class System<W extends World = World> extends cc.Component {
    world: W
    ecsWorld: bitecs.IWorld
    initializeSystem(world: W) {
    }
    onUpdate(dt: number) {
    }
}