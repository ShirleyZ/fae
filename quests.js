// **** QUESTS ****

Quests = {
	"teak-intro1": {
		prerequisites: [],
		questName: "Fairy 101",
		startQuestText: "You look like you need a few pointers, how about it?",
		stages: [
			{
				textDesc: "First let's do something about the fact that you're stark naked, can't possibly be comfortable in this chill. Here, put these one. I've always got a set of spares with me.",
				textLabel: "Dressed yourself yet?",
				passConditions: [
					{
						type: 'equipment',
						item: 'torso_leafSlip'
					}
				],
				textNodePass: {
					label: "There, don't you feel better now?",
					action: "progress"
				},
				textNodeNotPass: {
					label: "You can equip items from your inventory page.",
					action: "changeScreen",
					target: "inventory"
				},
				stageGet: [
					{
						type: 'item',
						item: 'torso_leafSlip',
						label: 'Teak rummages around in her pack, before pulling out a <b>Leaf Slip</b> and handing it to you.'
					}
				],
				passRewards: [
					{
						type: 'item',
						item: 'legs_leafLeggings'
					},
					{
						type: 'item',
						item: 'feet_leafWrap'
					},
					{
						type: 'xp',
						amount: 10
					}
				]
			},
			{
				textDesc: "Excellent! I've given you some leggings and shoes too. Go ahead and put them on. Now, here's lesson number two: 'Nothing comes free in this world!' <i>Teak gives a wicked grin, and you suddenly notice all her sharp teeth</i> Some fairies will ask little of you, and some more. Luckily for you, I'm a generous soul. So I think 20 apples should settle the deal.",
				passConditions: [
					{
						type: 'item',
						item: 'apple',
						amount: 20
					}
				],
				textPass: "Ooh is that 20 apples I see? Hand 'em over!",
				textNotPass: "You can find apples in the apple grove.",
				passRewards: [
					{
						type: 'xp',
						amount: 50
					}
				]
			}
		]
	},
	"teak-intro2": {
		prerequisites: [
			{
				type: 'quest',
				name: 'teak-intro1',
				state: 'completed'
			}
		],
		questName: "Fairy 102",
		startQuestText: "Now that the most important rule is out of the way, let's cover the rest of the basics shall we?",
		stages: [
			{
				textDesc: "ddd",
				passConditions: [
					{
						type: 'equipment',
						item: 'torso_leafSlip'
					}
				],
				textPass: "There, don't you feel better now?",
				textNotPass: "You can equip items from your inventory page.",
				passRewards: [
					{
						type: 'item',
						item: 'legs_leafLeggings'
					},
					{
						type: 'item',
						item: 'feet_leafWrap'
					},
					{
						type: 'xp',
						amount: 10
					}
				]
			},
			{
				textDesc: ",,,,",
				passConditions: [
					{
						type: 'item',
						item: 'apple',
						amount: 20
					}
				],
				textPass: "Ooh is that 20 apples I see? Hand 'em over!",
				textNotPass: "You can find apples in the apple grove.",
				passRewards: [
					{
						type: 'xp',
						amount: 50
					}
				]
			}
		]
	},
	"pix-quest1": {
		prerequisites: [],
		startQuestText: "Hey! So I heard there's some treasure hidden around here...",
		stages: [
			{
				passConditions: [
					{
						type: 'giveItem',
						item: 'apple',
						itemNum: 5,
					}
				],
				textPass: "Hand them to me!",
				textNotPass: "I'm not talking until you give me some apples!"
			}
		]
	},
	"example-quest": {
		prerequisites: [
			{
				type: 'inventory',
				item: 'apple',
				amount: 1
			},
			{
				type: 'relationship',
				npc: 'teal',
				relationshipLevel: 3
			},
			{
				type: 'inventory',
				item: 'banana',
				amount: 3
			}
		],
		startQuestText: "",
		stages: [
			{
				passConditions: [
					{
						type: 'giveItem',
						item: 'apple',
						itemNum: 5,
					}
				],
				textPass: "Hand them to me!",
				textNotPass: "I'm not talking until you give me some apples!"
			}
		]
	}
}
