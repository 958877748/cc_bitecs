import System from "./System";

@cc._decorator.ccclass
export default class World extends cc.Component {
    private world: bitecs.World
    private systems: System<World>[] = []
    protected onLoad() {
        this.world = bitecs.createWorld();
    }
    addSystem<S extends System<World>>(type: new () => S) {
        const sys = this.addComponent(type)
        this.systems.push(sys)
    }
    registerComponent(component: any) {
        bitecs.registerComponent(this.world, component)
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
    createEid(node?: cc.Node) {
        const eid = bitecs.addEntity(this.world)
        return eid
    }
    eidAddComp(eid: number, comps: object) {
        bitecs.addComponent(this.world, eid, comps)
    }
    eidAddCompData<T>(eid: number, comps: Array<T>, data: T) {
        bitecs.addComponent(this.world, eid, comps)
        comps[eid] = data
    }
    eidAddCompClass<T>(eid: number, comps: Array<T>, comp: new () => T, onData: (v: T) => void) {
        bitecs.addComponent(this.world, eid, comps)
        let data = new comp()
        comps[eid] = data
        onData(data)
    }
    removeEid(eid: number) {
        bitecs.removeEntity(this.world, eid)
    }
    eidHasComp(eid: number, comp: any) {
        return bitecs.hasComponent(this.world, eid, comp)
    }
    eidRemoveComp(eid: number, component: any) {
        bitecs.removeComponent(this.world, eid, component)
    }
}