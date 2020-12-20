require("dotenv").config({ path: __dirname + "/.env" });

const http = require("http");
const express = require("express");
const data = require("./data.json");

const axios = require("axios");
// const { process } = require("ipaddr.js");

const hostname = "localhost";
const port = 3000;

const app = express();

const mapGenerator = function (country_name) {
	/* const options = {
        "key": process.env.MAPQUEST_KEY,
        "location": "FR",
        "size": "600,400",
        "zoom": 5,
        "showicon": "red_1-1",
        "type": "sat",
        "imagetype": "png"
    }; */

	//const options = [process.env.MAPQUEST_KEY, "FR", "600,400", 5, "red_1-1", "sat", "png"];

	// options raccourci

	const host = "https://open.mapquestapi.com/staticmap/v4/getplacemap";
	return `${host}?key=${process.env.MAPQUEST_KEY}&location=${country_name}&size=600,400&zoom=4&showicon=red_1-1&type=sat`;
};

const imageGenerator = async function (query_name) {
	const host = "http://api.serpstack.com/search";
	console.log(
		`${host}?access_key=${process.env.SERPSTACK_KEY}&query=${query_name}&type=images`,
	);

	const options = {
		access_key: process.env.SERPSTACK_KEY,
		query: query_name,
		type: "images",
	};

	return await axios
		.get(host, {
			params: options,
		})
		.then((resp) => {
			const temp = resp.data["image_results"][0]["image_url"];
			return temp;
		})
		.catch((err) => console.log(err));
};

app.get("/data/", async function (req, res) {
	const number = req.query.number % data.length;
	console.log(number);
	const country_object = data[number];

	const [country_name, country_famous, country_celeb] = country_object;
	// ["France", "baguette", "Macron"]
	// country_name, country_famous, country_celeb

	const country_famous_img = await imageGenerator(country_famous);

	console.log("Famous image [200] ");

	const country_celeb_img = await imageGenerator(country_celeb);

	console.log("Celebrity image [200] ");

	// const country_celeb_img = await imageGenerator(country_celeb)
	// .then(resp => {

	//     const temp = resp.data["image_results"][0]["image_url"]
	//     //console.log(temp);
	//     return temp;

	// })
	// .catch(err => console.log(err));

	// console.log(await country_celeb_img);

	const mapURI = mapGenerator(country_name);

	console.log("Map image [200] ");

	res.json([mapURI, country_famous_img, country_celeb_img]);
});

app.listen(port, function () {
	console.log("Listening on port 3000");
});

// data.json input

// function which returns SVGs [baguette, Macron, French map]

// https://open.mapquestapi.com/staticmap/v4/getplacemap?
// key=process.env.MAPQUEST_KEY&
// location=FR&
// size=600,400&
// zoom=5&
// showicon=red_1-1&
// type=sat

// http://api.serpstack.com/search?
// access_key=process.env.SERPSTACK_KEY&
// query=mcdonalds&
// type=images
