import {type ReactElement} from 'react';
import ReactFlow, {Background, Controls, type Edge, type Node} from 'reactflow';
import 'reactflow/dist/style.css';

const initialNodes: Node[] = [
  {id: '1', position: {x: 250, y: 0}, data: {label: 'NPC: Hello, traveler!'}, type: 'input'},
  {id: '2', position: {x: 75, y: 150}, data: {label: 'Player: Who are you?'}},
  {id: '3', position: {x: 425, y: 150}, data: {label: 'Player: Farewell.'}},
  {id: '4', position: {x: 75, y: 300}, data: {label: 'NPC: I am the keeper of dialogs.'}},
  {id: '5', position: {x: 425, y: 300}, data: {label: '[End]'}, type: 'output'},
];

const initialEdges: Edge[] = [
  {id: 'e1-2', source: '1', target: '2'},
  {id: 'e1-3', source: '1', target: '3'},
  {id: 'e2-4', source: '2', target: '4'},
  {id: 'e3-5', source: '3', target: '5'},
];

export const App = (): ReactElement => (
  <div className='w-screen h-screen'>
    <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
      <Background />
      <Controls />
    </ReactFlow>
  </div>
);

App.displayName = 'App';
