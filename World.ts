import System from "./System";

@cc._decorator.ccclass
export default class World extends cc.Component {
    private world: bitecs.IWorld
    private systems: System<World>[] = []
    protected onLoad() {
        this.world = bitecs.createWorld();
    }
    addSystem<S extends System<World>>(type: new () => S) {
        const sys = this.addComponent(type)
        this.systems.push(sys)
    }
    protected start() {
        this.systems.forEach(sys => {
            sys.world = this
            sys.ecsWorld = this.world
            sys.initializeSystem(this)
        })
    }
    protected update(dt: number) {
        for (let i = 0; i < this.systems.length; i++) {
            this.systems[i].onUpdate(dt)
        }
    }
    getEcsWorld() {
        return this.world
    }
    createEntity(node?: cc.Node) {
        const eid = bitecs.addEntity(this.world)
        return eid
    }
    removeEntity(eid: number) {
        bitecs.removeEntity(this.world, eid)
    }
    entityAddComponent(eid: number, component: bitecs.Component) {
        bitecs.addComponent(this.world, component, eid)
    }
    entityHasComponent(eid: number, component: bitecs.Component) {
        return bitecs.hasComponent(this.world, component, eid)
    }
    entityRemoveComponent(eid: number, component: bitecs.Component) {
        bitecs.removeComponent(this.world, component, eid)
    }
}