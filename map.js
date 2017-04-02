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
		nodes: [
			{
				name: "grove-apple",
				reqs: []
			}, 
			{
				name: "river-small",
				reqs: []
			}, 
			{
				name: "pond-small",
				reqs: []
			}
		],
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
 		name: "a grove of apple trees",
 		desc: "The trees are ripe with fruit and just ready to be picked. The sound of birdsong twitters through the air.",
 		labelColor: "color-apple"
 	},
 	"river-small": {
 		name: "a small stream",
 		desc: "bub",
 		labelColor: "color-water"
 	},
 	"pond-small": {
 		name: "a small pond",
 		desc: "The water is so clear you can see straight to the bottom",
 		labelColor: "color-water"
 	},
 	"garden-mix-1": {
 		name: "a small garden",
 		desc: "Violets, pansies, daises.",
 		labelColor: "color-flower-1"
 	}
 }