  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDGK206E9S077LKvQsK_XISHrRvS9NkqYM",
    authDomain: "bridgethegap-1dcbe.firebaseapp.com",
    projectId: "bridgethegap-1dcbe",
    storageBucket: "bridgethegap-1dcbe.appspot.com",
    messagingSenderId: "971823065997",
    appId: "1:971823065997:web:827dc0ab980b1d9245ebc4",
    measurementId: "G-GPL83XWZK9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


var score,starsEarned, levelNumber, userName; 

levelNumber = localStorage.getItem("GameLevel");
userName = localStorage.getItem("UserName");

  // Trivia messages for different levels
  const triviaMessages = {
      1: "🌳🌳 Forests cover about 31% of the Earth's land surface? These green giants are crucial for our survival, absorbing carbon dioxide and providing over half of the world's biodiversity. Sadly, we're losing forests at an alarming rate - equivalent to 27 soccer fields every minute. Protecting forests means protecting our future.🌳🌳",
      2: "🌵🌵Deserts, often seen as barren, actually occupy about 20% of Earth's surface. These ecosystems are not just sand dunes; they are home to a myriad of life uniquely adapted to extreme conditions. However, due to human activities, deserts are expanding at an alarming rate, impacting global climates and local wildlife. Conservation of these vast lands is essential for the balance of our planet.🌵🌵",
      3: "❄️❄️ The Arctic, a vital climate regulator, is experiencing the fastest warming on Earth, nearly twice the global average. This rapid change threatens unique wildlife and has broader implications like rising sea levels. The melting of Arctic ice also contributes to a feedback loop, accelerating global warming. Preserving the Arctic is key to our planet's health.️❄️❄️"
  };

window.onload = function() {
fetch("https://bridgethegap-1dcbe-default-rtdb.firebaseio.com/userLevel.json")
  .then((response) => response.json())
  .then((data) => {
    score = localStorage.getItem("score");
      if (score >= 15) {
          starsEarned = 3;
      } else if (score >= 10 && score < 15) {
          starsEarned = 2;
      } else if (score >= 6 && score < 10) {
          starsEarned = 1;
      } else {
          starsEarned = 0; // For scores less than 6
      }
    // const userLevels = Object?.values(data);
    let existingRecord 
    if(data){
    existingRecord = Object?.keys(data).find((record)=> data[record]?.level == levelNumber && data[record]?.name == userName)
     } // if(userLevels){}
    // Check if there is an existing record for the user and level
    // const existingRecord = userLevels.find(
    //   (record) => record?.name === userName && record?.level === levelNumber
    // );
        // console.log(existingRecord,userLevels,data)
        if (data && existingRecord) {
            // Update the starsEarned for the existing record
            const id = existingRecord;
            existingRecord = data[existingRecord]
      existingRecord.stars = starsEarned;
            existingRecord.score = score
      // Update the data in the database
      fetch(
        `https://bridgethegap-1dcbe-default-rtdb.firebaseio.com/userLevel/${id}.json`,
        {
          method: "PUT",
          body: JSON.stringify(existingRecord),
          headers: { "Content-type": "application/json" },
        }
      )
        .then(() => {
          console.log("Stars updated successfully");
          localStorage.removeItem("score");
          localStorage.removeItem("GameLevel")
          setTimeout(()=>{
            window.location.href = "level-select.html"
          },30000)
          // Handle successful update
        })
        .catch((error) => {
          console.error("Error updating stars:", error);
          // Handle the error when updating stars
        });
    } else {
      // Create a new record if it doesn't exist
      const newRecord = {
        name: userName,
        level: levelNumber,
        stars: starsEarned,
        score: score,
      };

      // Add the new record to the database
      fetch("https://bridgethegap-1dcbe-default-rtdb.firebaseio.com/userLevel.json", {
        method: "POST",
        body: JSON.stringify(newRecord),
        headers: { "Content-type": "application/json" },
      })
        .then(() => {
          console.log("New record added successfully");
          localStorage.removeItem("score");
          localStorage.removeItem("GameLevel")
          setTimeout(()=>{
            window.location.href = "level-select.html"
          },15000)
          // Handle successful addition
        })
        .catch((error) => {
          console.error("Error adding new record:", error);
          // Handle the error when adding new record
        });
    }
      // Display random trivia for the level
      const triviaElement = document.getElementById("trivia");
      const levelTrivia = triviaMessages[levelNumber];
      if (triviaElement && levelTrivia) {
          triviaElement.innerHTML = levelTrivia;
      }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
    // Handle the error when fetching data
  });

}