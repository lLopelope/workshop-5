import bodyParser from "body-parser";
import express from "express";
import { BASE_NODE_PORT } from "../config";
import { Value } from "../types";


type NodeState = {
  killed: boolean;
  x: 0 | 1 | "?" | null;
  decided: boolean | null;
  k: number | null;
};

type Message = {
  sender: number; 
  round: number; 
  payload: any; 
};

let receivedMessages: Message[] = [];
let currentRound: number = 0;
const nodes: NodeState[] = [];


export async function node(
  nodeId: number, // the ID of the node
  N: number, // total number of nodes in the network
  F: number, // number of faulty nodes in the network
  initialValue: Value, // initial value of the node
  isFaulty: boolean, // true if the node is faulty, false otherwise
  nodesAreReady: () => boolean, // used to know if all nodes are ready to receive requests
  setNodeIsReady: (index: number) => void // this should be called when the node is started and ready to receive requests
) {
  const node = express();
  node.use(express.json());
  node.use(bodyParser.json());

  // TODO implement this
  // this route allows retrieving the current status of the node
   node.get("/status", (req, res) => {if (isFaulty) {
    res.status(500).send('faulty');
  } else {
    res.status(200).send('live');
  }});

  // TODO implement this
  // this route allows the node to receive messages from other nodes
   node.post("/message", (req, res) => {
    const message: Message = req.body;
    receivedMessages.push(message);
    res.status(200).send('Message received');
   });

  // TODO implement this
  // this route is used to start the consensus algorithm
   node.get("/start", async (req, res) => {
    currentRound = 1;

    // ------------------------------rajouter comment lancer le consensus algo 
    res.status(200).send('Consensus algorithm started');

   });

  // TODO implement this
  // this route is used to stop the consensus algorithm
   node.get("/stop", async (req, res) => {

    receivedMessages = [];
    currentRound = 0;
    res.status(200).send('Consensus algorithm stopped');

   });

  // TODO implement this
  // get the current state of a node
   node.get("/getState", (req, res) => {
     const currentNode : NodeState= req.body.currentValue
     const nodeState: NodeState = {
      killed: isFaulty,
      x: isFaulty ? null : currentNode.x, 
      decided: isFaulty ? null : currentNode.decided, 
      k: isFaulty ? null : currentNode.k 
    };
  
    // Send the nodeState object as JSON response
    res.status(200).json(nodeState);

  });

  // start the server
  const server = node.listen(BASE_NODE_PORT + nodeId, async () => {
    console.log(
      `Node ${nodeId} is listening on port ${BASE_NODE_PORT + nodeId}`
    );

    // the node is ready
    setNodeIsReady(nodeId);
  });

  return server;
}
