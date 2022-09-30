const initSDK = new Promise((res) => {
	res(
		CY.loader()
			.licenseKey("")
			.addModule(CY.modules().FACE_AGE.name)
			.addModule(CY.modules().FACE_GENDER.name)
			.addModule(CY.modules().FACE_EMOTION.name)
			.addModule(CY.modules().FACE_ATTENTION.name)
			.load()
	);
});

/*
  Oyentes de eventos para la salida de MorphCast SDK
*/

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //Enero es 0!
var yyyy = today.getFullYear();
today = mm + "/" + dd + "/" + yyyy;

window.addEventListener(CY.modules().FACE_AGE.eventName, (evt) => {
	age_div.innerHTML =
		"Edad probable: " + evt.detail.output.numericAge + " años";
	console.log("Edad:", evt.detail.output.numericAge);
});

window.addEventListener(CY.modules().FACE_GENDER.eventName, (evt) => {
	gen_div.innerHTML = "Genero probable: " + evt.detail.output.mostConfident;
	console.log("Genero:", evt.detail.output.mostConfident);
});

window.addEventListener(CY.modules().FACE_EMOTION.eventName, (evt) => {
	emo_div.innerHTML =
		"Emoción dominante: " + evt.detail.output.dominantEmotion;
	var myDate = new Date()
		.toTimeString()
		.replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
	console.log("Fecha:", today);
	console.log("Hora:", myDate);
	console.log("Emoción dominante:", evt.detail.output.dominantEmotion);
	// datos para el histograma
	const emotions = evt.detail.output.emotion;
	const labels = [];
	const data = [];
	console.log("Enojo:", evt.detail.output.emotion.Angry);
	console.log("Disgusto:", evt.detail.output.emotion.Disgust);
	console.log("Miedo:", evt.detail.output.emotion.Fear);
	console.log("Felicidad:", evt.detail.output.emotion.Happy);
	console.log("Neutral:", evt.detail.output.emotion.Neutral);
	console.log("Triste:", evt.detail.output.emotion.Sad);
	console.log("Sorpresa:", evt.detail.output.emotion.Surprise);

	Object.keys(emotions).forEach((k) => {
		labels.push(k);
		data.push(parseInt((emotions[k] * 100).toFixed(0)));
	});

	chart.updateOptions({
		labels: labels,
		series: [
			{
				name: "Emotion",
				data: data,
			},
		],
	});
});

window.addEventListener(CY.modules().FACE_ATTENTION.eventName, (evt) => {
	const attention = evt.detail.output.attention;
	console.log("Atención:", evt.detail.output.attention);
	console.log(";");
	const elem = document.getElementById("myBar");
	elem.style.width = attention * 100 + "%";
});

var video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {
	navigator.mediaDevices
		.getUserMedia({ video: true })
		.then(function (stream) {
			video.srcObject = stream;
		})
		.catch(function (err0r) {
			console.log("Algo salió mal!");
		});
}

/*
  elementos de la pagina
*/

const startButton = document.querySelector("#start_over");

startButton.onclick = () => {
	startButton.style.display = "none";
	initSDK.then(({ start }) => start());
};

const age_div = document.querySelector("#age");
const gen_div = document.querySelector("#gender");
const emo_div = document.querySelector("#emotion");

const options = {
	chart: {
		height: 350,
		width: 500,
		type: "bar",
	},
	colors: ["#7C0098"],
	yaxis: {
		min: 0,
		max: 100,
	},
	series: [],
	title: {
		text: "",
	},
	labels: [],
};
const chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();
