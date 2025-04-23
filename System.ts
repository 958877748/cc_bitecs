import World from "./World"

@cc._decorator.ccclass
export default class System extends cc.Component {
    ecsWorld: bitecs.IWorld
    initializeSystem(world: World) {
    }
    onUpdate(dt: number): number {
        return dt
    }
}