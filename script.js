// JavaScript Code for the Typing Game.

// Grabbing all the required elements.
const sentence = document.querySelector(".sentence");
const wrongCounter = document.querySelector(".wrongCounter");
const textInput = document.querySelector("#myTyping");
const endDisplay = document.querySelector(".endDisplay");
const againButton = document.querySelector("#again");

// Feedback text for the typing game.
const typingSpeedCompare = {
  10: "At this speed, your typing speed is way below average, and you should focus on proper typing technique (explained below).",

  20: "At this speed, your typing speed is way below average, and you should focus on proper typing technique (explained below).",

  30: "At this speed, your typing speed is way below average, and you should focus on proper typing technique (explained below).",

  40: "At 41 , you are now an average typist. You still have significant room for improvement.",

  50: "Congratulations! You’re above average.",

  60: "This is the speed required for most high-end typing jobs. You can now be a professional typist!",

  70: "You are way above average! You would qualify for any typing job assuming your typing accuracy is high enough.",

  80: "You’re a catch! Any employer looking for a typist would love to have you.",

  90: "At this typing speed, you’re probably a gamer, coder, or genius. Either way, you’re doing great!",

  100: "You are in the top 1% of typists! Congratulations!",
};

// A bag of sentence to use when the api is down or the internet is down.
const facts = [
  "A parent may kill its children if the task assigned to them is no longer needed.",
  "Writing cryptic code is deep joy in the soul of a programmer.",
  "A coder is a person who transforms cola & pizza to code 'Refresh button' of the windows desktop is not some magical tool which keeps your computer healthy.",
  "The programmers are the main source of income for eye doctors.",
  "If any programmer orders three beers with his fingers, he normally only gets two.",
  "Programmers love to code day and night.",
  "Sleeping with a problem can actually solve it.",
  "When you format your hard drive, the files are not deleted.",
  "1 Mbps and 1 MBps internet connection don’t mean the same thing.",
  "A programmer is similar to a game of golf.",
  "The point is not getting the ball in the hole but how many strokes it takes",
  "A programmer is not a PC repairman.",
];

let sentenceText = "";

// Assigning variables :

// All this are changed when we restart the game.
let typingStarted = false;

// Time tracking variables :
let startTime, endTime;

// Graph Variables :
let PlayerData = [],
  chartCreated = false;

// Running the setup :
initialStructure();

// The initialStructure is async as we will wait for the api to respond and then store it in the variable.
async function initialStructure() {
  // Waiting for the onRestart function to End.
  await onRestartCondition("restart");

  // Initializing the event listener for key events.
  textInput.addEventListener("input", (e) => {
    if (!typingStarted) typingStartedCondition(); // Condtion to check if Typing is Started.

    if (sentenceText.length === textInput.value.length) endCondition();

    refreshWindow();
  });

  refreshWindow();
}

// Condition to restart ,playAgain or take Input depending on the arguments.
// It is also async as it also waits for a function ot end.
async function onRestartCondition(functionType) {
  // We check the type of function we have to use.
  switch (functionType) {
    case "restart":
      PlayerData = [];
      await textGenerator();
      break;
    case "playAgain":
      againButton.style.display = "none";
      break;
    case "userInput":
      PlayerData = [];
      do {
        sentenceText = prompt("Enter a sentence  :  ");
      } while (
        sentenceText == null ||
        sentenceText == undefined ||
        sentenceText.length == 0
      );
      break;
    default:
      console.error("NOT valid function call");
      break;
  }

  wrongCount = 0;
  typingStarted = false;

  // Changing the Html and css of the elements
  endDisplay.style.display = "none";
  sentence.innerHTML = `<h1>${sentenceText}</h1>`;
  textInput.style.display = "block";
  textInput.value = "";

  refreshWindow();
}

// Function genterates text based on the condition.
async function textGenerator() {
  let randomIndex = Math.floor(Math.random() * facts.length); // generating a random number for choosing a text.
  sentenceText = "";

  // Grabbing the text from api.
  if (window.navigator.onLine) {
    sentenceText = await getRandomTextThroughApi();
  }

  // Checking if the text is valid.
  if (sentenceText === undefined || sentenceText.length === 0) {
    sentenceText = facts[randomIndex];
  } else {
    // making the text easier to type.
    sentenceText = sentenceText.replace(
      /[`~@#$%^&*()_|+\-?;:<>\n\t\r\{\}\[\]\\\/]/gi,
      ""
    );
  }
}

// Return the a string from the api.
function getRandomTextThroughApi() {
  const apiUrl =
    "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit";

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      return data.joke;
    })
    .catch((err) => {
      console.error(err);
    });
}

// Function to refresh Window when called.
function refreshWindow() {
  let wrongCount = 0;
  sentence.innerHTML = "";
  let headingElement = document.createElement("h1");

  textInput.value.split("").forEach((letter, index) => {
    let spanElement = document.createElement("span");

    let text = document.createTextNode(sentenceText[index]);
    spanElement.appendChild(text);

    if (letter === sentenceText[index]) {
      spanElement.classList.add("right");
    } else {
      wrongCount = wrongCount + 1;
      spanElement.classList.add("wrong");
    }

    headingElement.appendChild(spanElement);
  });

  if (textInput.value.length != sentenceText.length) {
    let spanElement = document.createElement("span");
    spanElement.classList.add("currentText");
    let text = document.createTextNode(sentenceText[textInput.value.length]);
    spanElement.appendChild(text);
    headingElement.appendChild(spanElement);
  }

  for (let i = textInput.value.length + 1; i < sentenceText.length; i++) {
    let spanElement = document.createElement("span");
    spanElement.classList.add("remaining");
    let text = document.createTextNode(sentenceText[i]);
    spanElement.appendChild(text);
    headingElement.appendChild(spanElement);
  }

  sentence.appendChild(headingElement);

  wrongCounter.innerHTML = `<p>Extra key-strokes : ${wrongCount} </p>`;
}

// Function to handel the case when typing is started.
function typingStartedCondition() {
  console.log("Starting.");
  typingStarted = true;
  startTime = new Date();
}

// Function to handel the case when typing is started.
function endCondition() {
  endTime = new Date();

  if (window.navigator.onLine) generateGraph();

  let timePassedInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
  let timePassedInMinutes = timePassedInSeconds / 60;

  let typingSpeed = textInput.value.length / (5 * timePassedInMinutes);

  let wrongCount = 0;
  textInput.value.split("").forEach((letter, index) => {
    if (letter != sentenceText[index]) {
      wrongCount = wrongCount + 1;
    }
  });

  let accuracy = 100 - (wrongCount / textInput.value.length) * 100;

  endDisplay.style.display = "block"; // Displaying the endDisplay.
  textInput.style.display = "none"; // Hiding the text input.
  againButton.style.display = "inline-block"; // Displaying the againButton.

  endDisplay.innerHTML = `
    <h1> Wpm : ${typingSpeed.toFixed(0)} </h1>
    <h1> Acurracy : ${accuracy.toFixed(2)} </h1>
    <p>${typingSpeedCompare[Math.floor(typingSpeed / 10) * 10]}</p>
    `;

  PlayerData.push([typingSpeed, accuracy]);

  generateGraph();
  window.scrollTo(0, document.querySelector(".graphContainer").scrollHeight);
  refreshWindow();
}

function generateGraph() {
  document.querySelector(".graphContainer").style.display = "flex";
  let ctx = document.getElementById("myChart").getContext("2d");

  let lables = [];
  let speedData = [];
  let acurracyData = [];

  PlayerData.forEach((data, index) => {
    lables.push(index + 1);
    speedData.push(data[0]);
    acurracyData.push(data[1]);
  });

  if (chartCreated) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: lables,
      datasets: [
        {
          label: "Speed",
          data: speedData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
        {
          label: "Acuraccy",
          data: acurracyData,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          min: 0,
        },
      },
    },
  });

  chartCreated = true;
}
