require("dotenv").config({ path: __dirname + "/.env" });

const axios = require("axios");

const data = require("./data.json");

let key;

const Discord = require("discord.js");
const { request } = require("express");
const client = new Discord.Client();

let gameStarted = false;

String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};

client.once("ready", () => {
	console.log("Ready!");
});

const generateEmbed = (image_url) => {
	return (Embed = {
		color: 0x00ff99,
		title: "Example",
		url: "https://discord.js.org",
		author: {
			name: "Roni",
			icon_url: "https://i.imgur.com/wSTFkRM.png",
			url: "https://discord.js.org",
		},
		description: "A descp...",
		thumbnail: { url: "https://i.imgur.com/wSTFkRM.png" },
		image: {
			url: image_url,
		},
		timestamp: new Date(),
		footer: {
			text: "Example footer",
			icon_url: "https://i.imgur.com/wSTFkRM.png",
		},
	});
};

const startGame = (message) => {
	const randInt = Math.floor(Math.random() * data.length);
	console.log(`Notre petit randInt ${randInt}`);
	key = data[randInt][0];
	console.log(`Notre réponse ${key}`);
	axios
		.get(`http://localhost:3000/data/?number=${randInt}`)
		.then((resp) => {
			for (country of resp.data) {
				console.log(country);
				message.channel.send({ embed: generateEmbed(country) });
			}
		})
		.catch((err) => console.log(err));
};

client.on("message", (message) => {
	if (!message.author.bot) {
		const msg = message.content;

		// Administration
		if (message.content.startsWith("?")) {
			const option = msg.slice(1);

			if (option === "start" && !gameStarted) {
				message.channel.send(`<@everyone> Notre jeu vient de commencer !`);
				gameStarted = true;
				startGame(message);
			} else if (option === "stop" && gameStarted) {
				message.channel.send(`<@everyone> Il est fini, notre jeu !`);
				gameStarted = false;
			}
		} else {
			if (gameStarted) {
				if (msg.capitalize() === key) {
					message.reply(`T'as gagné ! Le mot était ${key}.`);
					gameStarted = false;
				} else {
					message.reply(`Bzzt ! Essaie encore...`);
				}
			}
		}
	}
});

client.login(process.env.TOKEN);
