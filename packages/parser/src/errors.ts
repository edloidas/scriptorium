import type {ASTNode} from './ast';

export type ParseError = {
  kind: 'parse';
  message: string;
  offset: number;
  line: number;
  column: number;
};

export type ValidationError = {
  kind: 'validation';
  message: string;
  path?: string;
  node: ASTNode;
};

export type EvalError = {
  kind: 'eval';
  message: string;
  node: ASTNode;
};
