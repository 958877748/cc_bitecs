import System from "./System";

export const CocosNode = bitecs.defineComponent()

@cc._decorator.ccclass
export default class World extends cc.Component {
    private world: bitecs.IWorld
    private systems: System[] = []
    entityNodeMap = new Map<number, cc.Node>();
    protected onLoad() {
        this.world = bitecs.createWorld();
        this.systems = this.getComponentsInChildren(System)
    }
    protected start() {
        this.systems.forEach(sys => {
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
        if (node) {
            this.entityNodeMap.set(eid, node)
            this.entityAddComponent(eid, CocosNode)
        }
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