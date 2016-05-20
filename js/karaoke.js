
//defined manually, probabilities of hits at each of 16 beats:
var kickProbs = [
  1, 0, 1/8, 0,
  1/4, 0, 1/8, 0,
  1/2, 0, 1/8, 0,
  1/4, 0, 1/8, 0
  ];

var snareProbs = [
  1/4, 0, 1/8, 0,
  1/8, 0, 1/2, 0,
  3/4, 0, 1/8, 0,
  1/8, 0, 1/4, 0
  ];

var hatProbs = [
  0.75, 0.08, 0.75, 0.05,
  0.75, 0.08, 0.75, 0.05,
  0.75, 0.08, 0.75, 0.05,
  0.75, 0.08, 0.75, 0.05
  ];

//melody oscillator:
var context = new AudioContext();

//oscillator
var vco = context.createOscillator();
vco.frequency.value = 200;
vco.start(0);
//gain
var vca = context.createGain();
vca.gain.value = 0;
//connections
vco.connect(vca);
vca.connect(context.destination);


//beat
var kickSound = document.querySelector('#kick');
kickSound.volume = 1;
var snareSound = document.querySelector('#snare');
snareSound.volume = 0.5;
var hatSound = document.querySelector('#hat');
hatSound.volume = 0.5;

var melodyArray = melodyRhythm();
var melodyNotes = melodyNotes(melodyArray);

var kickArray = makeBeat(kickProbs);
var snareArray = makeBeat(snareProbs);
var hatArray = makeBeat(hatProbs);

var t = 0;
var measureLength = 1 + Math.random() + Math.random();
var increment = 0.01;
var fudgeFactor = 0.01;


function melodyRhythm(){

    //random melody rhythm input, will be from karaoke code instead
    var randomWordNumber = 1 + Math.floor(8*Math.random());
    var randomSyllables = [];
    for(var i = 0; i<randomWordNumber; i++){
      randomSyllables[i] = 1;
    }
    for(var i = 0; i < (8-randomWordNumber); i++){
      var randomWord = Math.floor(randomWordNumber*Math.random);
      randomSyllables[randomWord] += 1;
    }

    //melody for rhythm
    var melodyArray = getRhythmStarts(randomSyllables);


    return melodyArray;
}

function melodyNotes(melodyArray){
    var melodyNotes = [];
    for (var i = 0; i<melodyArray.length; i++){
      melodyNotes[i] = 200 + 100*Math.random();
    }
    return melodyNotes;
}


function playKaraoke(){ //call every frame
      //karaoke playing sound stuff
      t += increment;

      //only play melody sometimes:
      if (((t)%(4*measureLength)) < 2*measureLength){
      vca.gain.value = 0;
      }else{
      vca.gain.value = 0.6;
      }

      //melody:
      for(var i = 0; i < melodyArray.length; i++){
        if (Math.abs((t%measureLength) - (melodyArray[i]*measureLength)) < fudgeFactor){
          vco.frequency.value = melodyNotes[i];
        }
      }

      //beat:
      for(var i = 0; i < kickArray.length; i++){
        if (Math.abs((t%measureLength) - (kickArray[i]*measureLength)) < fudgeFactor){
          kickSound.play();
        }
      }
      for(var i = 0; i < snareArray.length; i++){
        if (Math.abs((t%measureLength) - (snareArray[i]*measureLength)) < fudgeFactor){
          snareSound.play();
        }
      }
      for(var i = 0; i < hatArray.length; i++){
        if (Math.abs((t%measureLength) - (hatArray[i]*measureLength)) < fudgeFactor){
          hatSound.play();
        }
      }
}

//gives when each note starts
function getRhythmStarts(syllableArray){//expecting an array of syllable numbers per word from 1 to 8 syllables

  var wordNumber = syllableArray.length; //number of words
  var totalSyllables = syllableArray.reduce(add, 0); //total number of syllables

  if (totalSyllables > 8 || totalSyllables < 1){
    return "not the right number of syllables";
  } else {
    var noteValues = [];//what we're trying to figure out

    for (var i = 0; i < wordNumber; i++){
        noteValues[i] = 1/8; //start each word as an eigth note
    }

  while (noteValues.reduce(add, 0) < 1){ //as long as our measure isn't full yet,
    for (var i = 0; i < wordNumber; i++){ //for each word,
      if (noteValues.reduce(add, 0) < 1 && noteValues[i] < syllableArray[i]/totalSyllables){ //make it longer if it's comparatively short
          noteValues[i] += 1/8;
      }
    }
  }

  noteValues[wordNumber-1] = 1 - noteValues[wordNumber-1];//last note starts at 1-last note time
  for (var i = (wordNumber-2); i >= 0; i--){
    noteValues[i] = noteValues[i+1] - noteValues[i];
  }

    return noteValues;
  }

  function add(a, b) {
      return a + b;
  }

}//end function

//gives how long each note is
function getRhythm(syllableArray){//expecting an array of syllable numbers per word from 1 to 8 syllables

  var wordNumber = syllableArray.length; //number of words
  var totalSyllables = syllableArray.reduce(add, 0); //total number of syllables

  if (totalSyllables > 8 || totalSyllables < 1){
    return "not the right number of syllables";
  } else {
    var noteValues = [];//what we're trying to figure out

    for (var i = 0; i < wordNumber; i++){
        noteValues[i] = 1/8; //start each word as an eigth note
    }

  while (noteValues.reduce(add, 0) < 1){ //as long as our measure isn't full yet,
    for (var i = 0; i < wordNumber; i++){ //for each word,
      if (noteValues.reduce(add, 0) < 1 && noteValues[i] < syllableArray[i]/totalSyllables){ //make it longer if it's comparatively short
          noteValues[i] += 1/8;
      }
    }
  }

    return noteValues;
  }

  function add(a, b) {
      return a + b;
  }

}//end function


//each will be an array of when to trigger the sound in a length-1 measure
function makeBeat(probs){
  var beatArray = []; //thing to be returned
  var currentNote = -1; //variable per note, not per beat
  for (var i = 0; i < 16; i++){//for each of 16 possible beat slots
    roll = Math.random(); //roll a random number between 0 and 1
    if (roll < probs[i]){ //if we beat the probability for this note,
      currentNote += 1; //a new note!
      beatArray[currentNote] = i/16; //start playing new note at this beat's time
    }
  }
  return beatArray;
}

