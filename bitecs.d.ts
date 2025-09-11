declare namespace bitecs {


  // Component.ts
  type ComponentRef = any;
  interface ComponentData {
    id: number;
    generationId: number;
    bitflag: number;
    ref: ComponentRef;
    queries: Set<Query>;
    setObservable: Observable;
    getObservable: Observable;
  }
  export declare const registerComponent: (world: World, component: ComponentRef) => ComponentData;
  export declare const registerComponents: (world: World, components: ComponentRef[]) => void;
  export declare const hasComponent: (world: World, eid: EntityId, component: ComponentRef) => boolean;
  export declare const getComponent: (world: World, eid: EntityId, component: ComponentRef) => any;
  export declare const set: <T extends ComponentRef>(component: T, data: any) => {
    component: T;
    data: any;
  };
  type ComponentSetter<T = any> = {
    component: ComponentRef;
    data: T;
  };
  export declare const setComponent: (world: World, eid: EntityId, component: ComponentRef, data: any) => void;
  export declare const addComponent: (world: World, eid: EntityId, componentOrSet: ComponentRef | ComponentSetter) => boolean;
  export declare function addComponents(world: World, eid: EntityId, components: (ComponentRef | ComponentSetter)[]): void;
  export declare function addComponents(world: World, eid: EntityId, ...components: (ComponentRef | ComponentSetter)[]): void;
  export declare const removeComponent: (world: World, eid: EntityId, ...components: ComponentRef[]) => void;
  export declare const removeComponents: (world: World, eid: EntityId, ...components: ComponentRef[]) => void;



  // Entity.ts
  type EntityId = number;
  export declare const Prefab: {};
  export declare const addPrefab: (world: World) => EntityId;
  export declare const addEntity: (world: World) => EntityId;
  export declare const removeEntity: (world: World, eid: EntityId) => void;
  export declare const getEntityComponents: (world: World, eid: EntityId) => ComponentRef[];
  export declare const entityExists: (world: World, eid: EntityId) => boolean;



  // EntityIndex.ts
  type EntityIndex = {
    aliveCount: number;
    dense: number[];
    sparse: number[];
    maxId: number;
    versioning: boolean;
    versionBits: number;
    entityMask: number;
    versionShift: number;
    versionMask: number;
  };
  export declare const getId: (index: EntityIndex, id: number) => number;
  export declare const getVersion: (index: EntityIndex, id: number) => number;
  declare const incrementVersion: (index: EntityIndex, id: number) => number;
  export declare const withVersioning: (versionBits?: number) => {
    versioning: boolean;
    versionBits: number;
  };
  export declare const createEntityIndex: (options?: ReturnType<typeof withVersioning> | typeof withVersioning) => EntityIndex;
  declare const addEntityId: (index: EntityIndex) => number;
  declare const removeEntityId: (index: EntityIndex, id: number) => void;
  declare const isEntityIdAlive: (index: EntityIndex, id: number) => boolean;
  //# sourceMappingURL=EntityIndex.d.ts.map


  // Hierarchy.ts
  declare function ensureDepthTracking(world: World, relation: ComponentRef): void;
  declare function calculateEntityDepth(world: World, relation: ComponentRef, entity: EntityId, visited?: Set<number>): number;
  declare function markChildrenDirty(world: World, relation: ComponentRef, parent: EntityId, dirty: SparseSet, visited?: SparseSet): void;
  declare function updateHierarchyDepth(world: World, relation: ComponentRef, entity: EntityId, parent?: EntityId, updating?: Set<number>): void;
  declare function invalidateHierarchyDepth(world: World, relation: ComponentRef, entity: EntityId): void;
  declare function flushDirtyDepths(world: World, relation: ComponentRef): void;
  declare function queryHierarchy(world: World, relation: ComponentRef, components: ComponentRef[], options?: {
    buffered?: boolean;
  }): QueryResult;
  declare function queryHierarchyDepth(world: World, relation: ComponentRef, depth: number, options?: {
    buffered?: boolean;
  }): QueryResult;
  export declare function getHierarchyDepth(world: World, entity: EntityId, relation: ComponentRef): number;
  export declare function getMaxHierarchyDepth(world: World, relation: ComponentRef): number;



  // Query.ts
  type QueryResult = Readonly<Uint32Array> | readonly EntityId[];
  interface QueryOptions {
    commit?: boolean;
    buffered?: boolean;
  }
  type Query = SparseSet & {
    allComponents: ComponentRef[];
    orComponents: ComponentRef[];
    notComponents: ComponentRef[];
    masks: Record<number, number>;
    orMasks: Record<number, number>;
    notMasks: Record<number, number>;
    hasMasks: Record<number, number>;
    generations: number[];
    toRemove: SparseSet;
    addObservable: ReturnType<typeof createObservable>;
    removeObservable: ReturnType<typeof createObservable>;
    queues: Record<any, any>;
  };
  type QueryOperatorType = 'Or' | 'And' | 'Not';
  declare const $opType: unique symbol;
  declare const $opTerms: unique symbol;
  type OpReturnType = {
    [$opType]: string;
    [$opTerms]: ComponentRef[];
  };
  type QueryOperator = (...components: ComponentRef[]) => OpReturnType;
  type QueryTerm = ComponentRef | QueryOperator | HierarchyTerm;
  export declare const Or: QueryOperator;
  export declare const And: QueryOperator;
  export declare const Not: QueryOperator;
  export declare const Any: QueryOperator;
  export declare const All: QueryOperator;
  export declare const None: QueryOperator;
  declare const $hierarchyType: unique symbol;
  declare const $hierarchyRel: unique symbol;
  declare const $hierarchyDepth: unique symbol;
  type HierarchyTerm = {
    [$hierarchyType]: 'Hierarchy';
    [$hierarchyRel]: ComponentRef;
    [$hierarchyDepth]?: number;
  };
  export declare const Hierarchy: (relation: ComponentRef, depth?: number) => HierarchyTerm;
  export declare const Cascade: (relation: ComponentRef, depth?: number) => HierarchyTerm;
  declare const $modifierType: unique symbol;
  type QueryModifier = {
    [$modifierType]: 'buffer' | 'nested';
  };
  export declare const asBuffer: QueryModifier;
  export declare const isNested: QueryModifier;
  export declare const noCommit: QueryModifier;
  type ObservableHookDef = (...terms: QueryTerm[]) => {
    [$opType]: 'add' | 'remove' | 'set' | 'get';
    [$opTerms]: QueryTerm[];
  };
  type ObservableHook = ReturnType<ObservableHookDef>;
  export declare const onAdd: ObservableHookDef;
  export declare const onRemove: ObservableHookDef;
  export declare const onSet: ObservableHookDef;
  export declare const onGet: ObservableHookDef;
  export declare function observe(world: World, hook: ObservableHook, callback: (eid: EntityId, ...args: any[]) => any): () => void;
  declare const queryHash: (world: World, terms: QueryTerm[]) => string;
  export declare const registerQuery: (world: World, terms: QueryTerm[], options?: {
    buffered?: boolean;
  }) => Query;
  declare function queryInternal(world: World, terms: QueryTerm[], options?: {
    buffered?: boolean;
  }): QueryResult;
  export declare function query(world: World, terms: QueryTerm[], ...modifiers: (QueryModifier | QueryOptions)[]): EntityId[];
  declare function queryCheckEntity(world: World, query: Query, eid: EntityId): boolean;
  declare const queryCheckComponent: (query: Query, c: ComponentData) => boolean;
  declare const queryAddEntity: (query: Query, eid: EntityId) => void;
  export declare const commitRemovals: (world: World) => void;
  declare const queryRemoveEntity: (world: World, query: Query, eid: EntityId) => void;
  export declare const removeQuery: (world: World, terms: QueryTerm[]) => void;



  // Relation.ts
  type OnTargetRemovedCallback = (subject: EntityId, target: EntityId) => void;
  type RelationTarget = number | '*' | typeof Wildcard;
  declare const $relation: unique symbol;
  declare const $pairTarget: unique symbol;
  declare const $isPairComponent: unique symbol;
  declare const $relationData: unique symbol;
  type Relation<T> = (target: RelationTarget) => T;
  export declare const withStore: <T>(createStore: (eid: EntityId) => T) => (relation: Relation<T>) => Relation<T>;
  declare const makeExclusive: <T>(relation: Relation<T>) => Relation<T>;
  export declare const withAutoRemoveSubject: <T>(relation: Relation<T>) => Relation<T>;
  export declare const withOnTargetRemoved: <T>(onRemove: OnTargetRemovedCallback) => (relation: Relation<T>) => Relation<T>;
  export declare const Pair: <T>(relation: Relation<T>, target: RelationTarget) => T;
  export declare const getRelationTargets: (world: World, eid: EntityId, relation: Relation<any>) => number[];
  export declare function createRelation<T>(...modifiers: Array<(relation: Relation<T>) => Relation<T>>): Relation<T>;
  export declare function createRelation<T>(options: {
    store?: () => T;
    exclusive?: boolean;
    autoRemoveSubject?: boolean;
    onTargetRemoved?: OnTargetRemovedCallback;
  }): Relation<T>;
  declare const $wildcard: unique symbol;
  declare function createWildcardRelation<T>(): Relation<T>;
  declare function getWildcard(): Relation<any>;
  export declare const Wildcard: Relation<any>;
  declare function createIsARelation<T>(): Relation<T>;
  declare function getIsA(): Relation<any>;
  export declare const IsA: Relation<any>;
  export declare function isWildcard(relation: any): boolean;
  export declare function isRelation(component: any): boolean;


  // World.ts
  export declare const $internal: unique symbol;
  type WorldContext = {
    entityIndex: EntityIndex;
    entityMasks: number[][];
    entityComponents: Map<EntityId, Set<ComponentRef>>;
    bitflag: number;
    componentMap: Map<ComponentRef, ComponentData>;
    componentCount: number;
    queries: Set<Query>;
    queriesHashMap: Map<string, Query>;
    notQueries: Set<any>;
    dirtyQueries: Set<any>;
    entitiesWithRelations: Set<EntityId>;
    hierarchyData: Map<ComponentRef, {
      depths: Uint32Array;
      dirty: SparseSet;
      depthToEntities: Map<number, SparseSet>;
      maxDepth: number;
    }>;
    hierarchyActiveRelations: Set<ComponentRef>;
    hierarchyQueryCache: Map<ComponentRef, {
      hash: string;
      result: QueryResult;
    }>;
  };
  type InternalWorld = {
    [$internal]: WorldContext;
  };
  export type World<T extends object = {}> = {
    [K in keyof T]: T[K];
  };
  export declare function createWorld<T extends object = {}>(...args: Array<EntityIndex | T>): World<T>;
  export declare const resetWorld: (world: World) => World<{}>;
  export declare const deleteWorld: (world: World) => void;
  export declare const getWorldComponents: (world: World) => string[];
  export declare const getAllEntities: (world: World) => readonly EntityId[];


  // utils/Observer.ts
  type Observer = (entity: EntityId, ...args: any[]) => void | object;
  interface Observable {
    subscribe: (observer: Observer) => () => void;
    notify: (entity: EntityId, ...args: any[]) => void | object;
  }
  declare const createObservable: () => Observable;


  // utils/SparseSet.ts
  type SparseSet = {
    add: (val: number) => void;
    remove: (val: number) => void;
    has: (val: number) => boolean;
    sparse: number[];
    dense: number[] | Uint32Array;
    reset: () => void;
    sort: (compareFn?: (a: number, b: number) => number) => void;
  };
  declare const createSparseSet: () => SparseSet;
  declare const createUint32SparseSet: (initialCapacity?: number) => SparseSet;


  // utils/defineHiddenProperty.ts
  declare const defineHiddenProperty: (obj: any, key: any, value: any) => any;
  declare const defineHiddenProperties: (obj: any, kv: any) => void;


  // utils/pipe.ts
  type Func = (...args: any) => any;
  export declare const pipe: <T extends Func, U extends Func, R extends Func>(...functions: [T, ...U[], R]) => ((...args: Parameters<T>) => ReturnType<R>);
}
