export type TokenType =
  | 'Number'
  | 'String'
  | 'Identifier'
  | 'True'
  | 'False'
  | 'Plus'
  | 'Minus'
  | 'Star'
  | 'Slash'
  | 'Eq'
  | 'EqEq'
  | 'BangEq'
  | 'Lt'
  | 'LtEq'
  | 'Gt'
  | 'GtEq'
  | 'PlusEq'
  | 'MinusEq'
  | 'StarEq'
  | 'SlashEq'
  | 'AmpAmp'
  | 'PipePipe'
  | 'Bang'
  | 'Dot'
  | 'Comma'
  | 'LParen'
  | 'RParen'
  | 'EOF';

export type Token = {
  type: TokenType;
  value: string;
  offset: number;
  line: number;
  column: number;
};
