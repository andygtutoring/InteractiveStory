// InteractiveStory.js

// IndexedDB variables
const dbName = 'interactive-story';
const dbVersion = 1;
let db;

// Story data
const storyData = {
  "start": {
    "text": "You are standing at the entrance of a dark forest.",
    "choices": [
      {"text": "Enter the forest", "next": "forest"},
      {"text": "Go back", "next": "end"}
    ]
  },
  "forest": {
    "text": "You are inside the dark forest.",
    "choices": [
      {"text": "Continue", "next": "clearing"},
      {"text": "Go back", "next": "start"}
    ]
  },
  "clearing": {
    "text": "You have reached a clearing.",
    "choices": [
      {"text": "Investigate", "next": "investigate"},
      {"text": "Leave", "next": "forest"}
    ]
  },
  "investigate": {
    "text": "You found something interesting.",
    "choices": [
      {"text": "Take it", "next": "end"},
      {"text": "Leave it", "next": "clearing"}
    ]
  },
  "end": {
    "text": "Your journey has ended.",
    "choices": []
  }
};

// Open IndexedDB connection
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('storyProgress', {keyPath: 'id', autoIncrement: true});
      db.createObjectStore('playerChoices', {keyPath: 'id', autoIncrement: true});
      db.createObjectStore('characterData', {keyPath: 'id', autoIncrement: true});
    };
  });
}

// Save story progress
function saveProgress(progress) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('storyProgress', 'readwrite');
    const store = transaction.objectStore('storyProgress');
    store.put(progress);
    transaction.onsuccess = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Load story progress
function loadProgress() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('storyProgress', 'readonly');
    const store = transaction.objectStore('storyProgress');
    const request = store.get(1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save player choices
function saveChoices(choices) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('playerChoices', 'readwrite');
    const store = transaction.objectStore('playerChoices');
    store.put(choices);
    transaction.onsuccess = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Load player choices
function loadChoices() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('playerChoices', 'readonly');
    const store = transaction.objectStore('playerChoices');
    const request = store.get(1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Save character data
function saveCharacterData(data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('characterData', 'readwrite');
    const store = transaction.objectStore('characterData');
    store.put(data);
    transaction.onsuccess = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

// Load character data
function loadCharacterData() {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('characterData', 'readonly');
    const store = transaction.objectStore('characterData');
    const request = store.get(1);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Display story
function displayStory(storyId) {
  const storyContainer = document.getElementById('story-container');
  storyContainer.innerHTML = '';
  const story = storyData[storyId];
  const text = document.createTextNode(story.text);
  storyContainer.appendChild(text);
  story.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.textContent = choice.text;
    button.onclick = () => {
      saveProgress({ currentStory: choice.next });
      displayStory(choice.next);
    };
    storyContainer.appendChild(button);
  });
}

// Start game
async function startGame() {
  await openDB().then((dbResult) => (db = dbResult));
  const progress = await loadProgress();
  if (!progress) {
    saveProgress({ currentStory: 'start' });
    displayStory('start');
  } else {
    displayStory(progress.currentStory);
  }
}

document.getElementById('start-button').addEventListener('click', startGame);



