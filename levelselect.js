
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// If you enabled Analytics in your project, add the Firebase SDK for Google Analytics
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Add Firebase products that you want to use
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  // Import the functions you need from the SDKs you need
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
const auth = getAuth(app);
const firestore = getFirestore(app);
const userName = localStorage.getItem("UserName");// Change this to the user's name
// const levelNumber = 3; // Change this according to the level you want to update
const starsEarned = 2;

let length = 10 ;

fetch("https://bridgethegap-1dcbe-default-rtdb.firebaseio.com/userLevel.json")
  .then((response) => response.json())
  .then((data) => {
    // const userLevels = Object?.values(data);
    let existingRecord 
    if(data){
    existingRecord = Object?.values(data).filter((record)=> record?.name == userName)
     } 
console.log(existingRecord)


const levelContainer = document.getElementById('levelContainer');


function handleLevelClick(level) {
  localStorage.setItem('GameLevel', level);
  window.location.href = 'index.html'; // Replace with your main URL
}

// Loop through each level object and create the corresponding elements
for(let i = 0; i < 3; i++) {
  const div = document.createElement('div');
  div.classList.add('image-container');

  const img = document.createElement('img');
  if(!existingRecord.length && i === 0){
    img.src = 'assets/level-select-level-block.png';
  }
  else if(existingRecord && (existingRecord[i]?.level == i+1 || existingRecord[i-1])) {
    img.src = 'assets/level-select-level-block.png';
  }
  else{
    img.src = 'assets/level-select-level-lock-block.png';
  }
  img.classList.add('block-image');
  div.appendChild(img);

  if(!existingRecord.length && i === 0){
    const span = document.createElement('span');
    span.textContent = i + 1;
    span.style.position = 'absolute';
    span.style.top = '17%';
    span.style.fontSize = '53px';
    // Adjust left position based on level number or as needed
    span.style.left = `4.3vw`;
    div.appendChild(span);
  }
 else if(existingRecord && (existingRecord[i]?.level == i+1 || existingRecord[i-1])) {
console.log("i",i)
  const span = document.createElement('span');
  span.textContent = i + 1;
  span.style.position = 'absolute';
  span.style.top = '17%';
  span.style.fontSize = '53px';
  // Adjust left position based on level number or as needed
  span.style.left = `4.3vw`;
  div.appendChild(span);
  }

  div.addEventListener('click', (e) => {
    if(e.srcElement.src?.split('/')?.slice(-1)[0] != "level-select-level-lock-block.png"){
      handleLevelClick(i+1);
    }
  });

  for (let j = 1; j <= 3; j++) {
    const star = document.createElement('i');
    star.classList.add('fa', 'fa-star', 'icon');
    star.setAttribute('aria-hidden', 'true');
    // Decide color based on the number of stars for each level
    if (existingRecord && j <= existingRecord[i]?.stars) {
      star.style.color = 'yellow';
    } else {
      star.style.color = 'black';
    }
    // Adjust left position for stars
    star.style.left = `${30 + (j - 1) * 20}%`;
    div.appendChild(star);
  }

  levelContainer.appendChild(div);
};})


