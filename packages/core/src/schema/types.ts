export const SCHEMA_VERSION = 1;

export type ProjectDocument = {
  schemaVersion: number;
  meta: ProjectMeta;
  nodes: DialogNode[];
  edges: DialogEdge[];
  variables: Variable[];
  viewport?: Viewport;
};

export type ProjectMeta = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type DialogNode = {
  id: string;
  kind: 'npc' | 'player' | 'narrator' | 'branch' | 'start' | 'end';
  speaker?: string;
  text: string;
  conditions?: Condition[];
  effects?: Effect[];
  metadata?: Record<string, unknown>;
  position: {x: number; y: number};
  size?: {width: number; height: number};
  handles?: Handle[];
};

export type Handle = {
  id: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  label?: string;
};

export type DialogEdge = {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  conditions?: Condition[];
  priority?: number;
};

export type Variable = {
  id: string;
  name: string;
  namespace: string;
  type: 'string' | 'number' | 'boolean';
  defaultValue: string | number | boolean;
};

export type Condition = {
  variableId: string;
  operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte';
  value: string | number | boolean;
};

export type Effect = {
  variableId: string;
  operation: 'set' | 'increment' | 'decrement' | 'toggle';
  value?: string | number | boolean;
};

export type Viewport = {
  x: number;
  y: number;
  zoom: number;
};
