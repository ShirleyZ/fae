// **** ACTIONS UTIL ****
/* Object to help with managing what gets displayed
 * on the page as an action, for different page types
 *
 * Dependencies:
 * - npc.js
 */

ActionUtil = {
	addMoveToNpc: function(toNpc, actionList) {
		var npcInfo = Npc[toNpc];
		if (npcInfo == undefined) {
			return;
		}
		var newAction = {
			name: toNpc,
			action: "changeNpc",
			label: "[NPC] "+npcInfo.name
		}
		actionList.push(newAction);
	}
}