import World from "./World"

@cc._decorator.ccclass
export default class System<W extends World = World> extends cc.Component {
    world: W
    ecsWorld: bitecs.World
    initializeSystem(world: W) {
        this.world = world
    }
    onUpdate(dt: number) {
    }
}