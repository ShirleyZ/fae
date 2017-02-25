console.log("Hello comoponent")


Vue.component('user-info', {
	props: ['player'],
	template: ''
});

var vm = new Vue({
	el: '#wrapper',
	data: {
		playerInfo: {
			name: "Flippity Jack the Pixie",
			level: 1
		},
		mainInfo: {
			type: 'npc',
			imgSrc: '',
			imgCaption: '',
			greeting: '',
			mainDesc: '',
			actions: [
				{label: "Action 1",url: "", action:""},
				{label: "Action 2",url: "", action:""}
			]
		},
		extraInfo: {
			quote: ''
		},
		data: "Dog",
		areaInfo: {
			npc: {},
			actions: {},
			desc: ""
		}
	}
})


