// **** ACTIONS UTIL ****
/* Object to help with managing what gets displayed
 * on the page as an action, for different page types
 *
 * Dependencies:
 * - npc.js
 */

ActionUtil = {
	addMoveToNode: function(toNode, actionList, isFirst) {
		var nodeInfo = Nodes[toNode];
		if (nodeInfo == undefined) {
			return;
		}
		var newAction = {
			name: toNode,
			action: "changeNode",
			label: nodeInfo.name,
			color: nodeInfo.labelColor
		}
		actionList.push(newAction);
	},
	addMoveToNpc: function(toNpc, actionList) {
		var npcInfo = Npc[toNpc];
		if (npcInfo == undefined) {
			return;
		}
		if (actionList == undefined) {
			actionList = [];
		}
		var newAction = {
			name: toNpc,
			action: "changeNpc",
			label: "[NPC] "+npcInfo.name
		}
		actionList.push(newAction);
	}
}