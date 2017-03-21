// **** MAP & NODES ****
/* 
 * NOTES:
 * - npc requirements are here instead of npc.js because it allows npcs to be in multiple
 *   maps w/ custom reqs
 * Dependencies:
 * - none
 */

 GameMap = {
 	"lost": {
		name: "You're lost",
 		desc: "There's nothing here. It's pitch black.",
 		npcs: [],
		nodes: [],
		exits: ["forest-1"],
		reqs: []
 	},
 	"forest-1": {
 		name: "Forest Outskirts",
 		desc: "Large, age old tree trunks rise into the sky and dappled sunlight streams in to cover the forest floor.",
 		npcs: [
 			{ name: "teak",
 				reqs: []
 			},
 			{ name: "willow",
 				reqs: [false]
 			}
		],
		nodes: ["grove-apple", "river-small", "pond-small"],
		exits: ["garden-1"],
		reqs: []
 	},
 	"garden-1": {
 		name: "Court Gardens",
 		desc: "A winding cobblestone path meanders around brightly coloured flowers bursting from the flowerbeds.",
 		npcs: [
 			{ name: "felli",
 				reqs: []
 			},
 			{ name: "pix",
 				reqs: [false]
 			}
		],
		nodes: ["garden-mix-1"],
		exits: ["forest-1"],
		reqs: [
			{
				type: 'quest',
				name: 'teak-intro1',
				state: 'completed'
			}
		]
 	}
 }

 Nodes = {
 	"grove-apple": {

 	},
 	"river-small": {

 	},
 	"pond-small": {

 	},
 	"garden-mix-1": {

 	}
 }