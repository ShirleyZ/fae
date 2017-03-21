// **** CHARACTERS ****

NpcUtil = {
	getNpcQuote: function(toNpc) {
		var npcInfo = Npc[toNpc];
		var max = npcInfo.extra.length;
		var min = 0;
		var randInt = Math.random() * (max - min) + min;
		randInt = Math.floor(randInt);
		// If it's num of length it's out of bounds
		// Accounts for small chance it lands perfectly on max
		if (randInt == max) {
			randInt-=1;
		}
		console.log("Num betw: "+min+ " - "+max);
		console.log(randInt);
		return npcInfo.extra[randInt];
	},
	listNpcActions: function(npcName, playerObj) {
		// Todo: Refactor this better ;-;
		// - So it doesn't alter vm.actions directly
		var currNpc = Npc[npcName];
		var npcQuests = currNpc.quests;
		// Go through list of currNpc if it's not completed
		if (npcQuests != undefined) {
			for (var i = 0; i < npcQuests.length; i++) { 
				console.log("Q: "+npcQuests[i]);
				var currQuest = Quests[npcQuests[i]];
				// If the quest isn't completed
				if (playerObj.quests_completed.indexOf(npcQuests[i]) == -1) {
					var stageType = "";
					// Check if quest is in progress
					if (playerObj.quests_active[npcQuests[i]] != undefined) {
						// console.log("Quest in progress.")
						stageType = "quest-progress";
						var playerQuestStage = playerObj.quests_active[npcQuests[i]].stage;
						if (playerQuestStage == undefined) {
							console.log("Error: quest in progress but no stage saved");
							break;								
						}
						var questNode = currQuest.stages[playerQuestStage];
						// console.log(questNode);

						// console.log("Adding to action list")
						var newAction = {
							name: npcQuests[i],
							action: stageType,
							stage: playerQuestStage,
							label: "["+currQuest.questName+"] "+questNode.textLabel
						}
						vm.actions.push(newAction)
					} else {
						// console.log("Unstarted quest. Checking prereqs")
						stageType = "quest-start";
						// Check if you can start this quest
						// Set to true and if anything fails you can't start
						var passPrereqs = QuestsUtil.checkPrereqs(npcQuests[i], playerObj);
						console.log("Prereqs pass state: "+passPrereqs);

						// If it passes, add it to the list of actions
						if (passPrereqs) {
							console.log("Adding to action list")
							var newAction = {
								name: npcQuests[i],
								action: 'quest-start',
								stage: 0,
								label: currQuest.startQuestText
							}
							vm.actions.push(newAction)
						}
						
					}
				} else {
					console.log("Quest complete. Next.");
				}
			}
		}
	}
}

Npc = {
	"pix": {
		name: "Pix the Troublemaker",
		port: "",
		extra: ["Always seen skulking around in the shadows, if something's gone wrong it's probably pix",
						"Pix is short for 'Pixie', and no one knows Pix's real name since they guard their secrets so closely."],
		greeting: "You didn't see me here, right pal?",
		quests: ["pix-quest1"]
	},
	"felli": {
		name: "Flowergirl Felli",
		port: "",
		extra: ["More often than not, Felli seems to be off in her own little world. But despite appearances she knows everything that happens in the court.",
						"Many new pixies mistake Felli's appearance to mean that she is quite young, however few members of the court have been around for longer than she."],
		greeting: "Oh, the stars and sparrows whisper to me so. The things I know about the court..."
	},
	"tommen": {
		name: "Kitchenhand Tommen",
		port: "",
		extra: [""],
		greeting: ""
	},
	"teak": {
		name: "Tree Guardian Teak",
		port: "",
		extra: ["A common sight around the grove, Teak is constantly flitting about the boughs and making sure everything is well.",
						"Teak is oft looked up to as an elder sister figure by many pixies in the grove, in no small part due to her being the first to find many of them and helping them through the disorientation of Waking.",
						"Cheery and brightly coloured, Teak has taken it upon herself to welcome newly awakened pixies after watching one too many meet an early demise."],
		greeting: "Hey-ho! What can I do for you, dear?",
		quests: ["teak-intro1", "teak-intro2"],
		actions: ["", ""]
	},
	"willow": {
		name: "Tree Guardian Willow",
		port: "",
		extra: [""],
		greeting: "Hop away from that now! Yes, yes, can't you see you're crushing that sapling?"
	},
	"ink": {
		name: "Ink",
		port: "",
		extra: [""],
		greeting: ""
	},
	"tmp": {
		name: "tmp",
		port: "",
		extra: ["...","... who are you"],
		greeting: "you're not meant to be here"
	}
}
