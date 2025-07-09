// svg editor https://yqnn.github.io/svg-path-editor/
import { CountUp } from './js/countUp.min.js';

const audio = document.getElementById('myAudio');
const speedControl = document.getElementById('speedControl');

// audio
const lub = document.getElementById('lub');
const dub = document.getElementById('dub');
const checkbox = document.getElementById('audioCheckbox'); // Replace 'myCheckbox' with the actual ID of your checkbox
const isAudio = checkbox.checked;

const audioPlay = async url => {
  const context = new AudioContext();
  const source = context.createBufferSource();
  const audioBuffer = await fetch(url)
    .then(res => res.arrayBuffer())
    .then(ArrayBuffer => context.decodeAudioData(ArrayBuffer));

  source.buffer = audioBuffer;
  source.connect(context.destination);
  source.playbackRate.value = 1;
  source.start();
};

//options
const autoplayOption = false;
const loopOption = true;
const rateOption = .125;
const numberAnimationDuration = 250;

// alert(newDuration)

const skipAmount = 20;

import {
  animate,
  createTimer,
  createTimeline,
  svg,
  stagger,
  utils
} from "https://cdn.jsdelivr.net/npm/animejs@4.0.2/+esm";

// playback items
const [$playPauseButton] = utils.$(".play-pause");
const [$forward] = utils.$(".fwd");
const [$backward] = utils.$(".back");
const [$range] = utils.$(".range");
const [$timer] = utils.$(".timer");

// heart parts
const [$heartwall] = utils.$(".heartwall");
const [$ventricler] = utils.$(".ventricle-r");
const [$ventriclel] = utils.$(".ventricle-l");
const [$atriumr] = utils.$(".atrium-r");
const [$atriuml] = utils.$(".atrium-l");

// valves
const [$tricuspid1] = utils.$(".tricuspid-valve-1");
const [$tricuspid2] = utils.$(".tricuspid-valve-2");
const [$mitral1] = utils.$(".mitral-valve-1");
const [$mitral2] = utils.$(".mitral-valve-2");
const [$pulmonary1] = utils.$(".pulmonary-valve-1");
const [$pulmonary2] = utils.$(".pulmonary-valve-2");
const [$aortic1] = utils.$(".aortic-valve-1");
const [$aortic2] = utils.$(".aortic-valve-2");

const updateButtonLabel = (tl) => {
  $playPauseButton.textContent = tl.paused ? "Play" : "Pause";
};

const changeClass = (item, parent, addOrRemove) => {
  const parentEl = document.querySelectorAll(parent);
  parentEl.forEach(function(el) {
    if (addOrRemove == "add") {
      el.classList.add(item)
      // console.log("added " + item + " from: " + parent)
    } else {
      el.classList.remove(item)
      // console.log("removed " + item + " from: " + parent)
    }
    
  })
}

let sideButtons = document.querySelectorAll('.sideSwitch button')
sideButtons.forEach(item =>
  item.addEventListener (
    'click', function () {
      if (item.getAttribute("id") === "rightSide") {
        document.getElementById("leftSide").classList.remove("currentTab");
        document.getElementById("right").style.display = "none"
        document.getElementById("left").style.display = "block"; 
        document.getElementById("rightSide").classList.add("currentTab");
        // change colors of ui
        document.querySelector("body").setAttribute("style", "background-color: var(--bg);");
        document.querySelector(".controls").classList.remove("redControls");
      } else {
        document.getElementById("rightSide").classList.remove("currentTab");
        document.getElementById("left").style.display = "none"
        document.getElementById("right").style.display = "block"; 
        document.getElementById("leftSide").classList.add("currentTab");
        document.querySelector("body").setAttribute("style", "background-color: var(--bg-red);");
        document.querySelector(".controls").classList.add("redControls");
      }
    }
))

// function changeTable(side) {
//   var i;
//   var x = document.getElementsByClassName("side");
//   for (i = 0; i < x.length; i++) {
//     x[i].style.display = "none";
//   }
//   document.getElementById(side).style.display = "block";
// }

const removeClass = (item, parent) => {
  const parentEl = document.querySelectorAll(parent);
  parentEl.forEach(function(el) {
    el.classList.remove(item)
    // console.log("removed " + item + " from: " + parent)
  })
}

function numberCount(id, start, end) {
  var obj = document.getElementById(id);
  var startTime = null;

  function update(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = (timestamp - startTime) / numberAnimationDuration;

    if (progress < 1) {
      var currentValue = start + (end - start) * progress;
      obj.textContent = Math.floor(currentValue); // Round to integer
      requestAnimationFrame(update);
    } else {
      obj.textContent = end; // Ensure final value is accurate
    }
  }
  requestAnimationFrame(update);
}

const animateBolus = (el, percent, mult, offset, duration) => {
  animate(el, {
    duration: duration,
    playbackRate: rateOption,
    keyframes: {                 
      '0%'  : {
        '--bolus-opacity': 0
      },
      '5%' : {
        '--bolus-opacity': 1
      },
      '95%' : {
        '--bolus-opacity': 1
      },
      '100%': {
        '--bolus-opacity': 0
      }
    },
    '--bolus-pos': percent * mult,
    '--bolus-offset': offset
  });
}


const setBolus = (el, percent, mult, offset) => {
  document.querySelector(el).setAttribute("style", "--bolus-pos: " + (percent * mult));
  document.querySelector(el).setAttribute("style", "--bolus-offset: " + offset);
}




const toggleActive = (selector) => {
  const element = document.getElementById(selector);
  element.classList.toggle('active');
  console.log("toggled active on something")
}

const tl = createTimeline({
  autoplay: autoplayOption,
  loop: loopOption,
  playbackRate: rateOption,
  onUpdate: (self) => {
    $range.value = self.currentTime;
        // $timer.innerHTML = self.currentTime;

    $timer.innerHTML = (Math.round((self.currentTime + Number.EPSILON)) / 1000).toFixed(2) + "s";

    // updatePhase(self.currentTime);

    // $timer.innerHTML = Math.round(((self.currentTime/1000) + Number.EPSILON) * 100) / 100 + "s"
    // $timer.innerHTML = self.currentTime / 1000 + "s";
    updateButtonLabel(self);
  },
  onLoop: (self) => {
    tl.seek(0);
    // reset numbers
    document.getElementById("row2col5").innerHTML = "2";
    document.getElementById("row4col4").innerHTML = "3";
    document.getElementById("row5col4").innerHTML = "6";
    document.getElementById("row5col5").innerHTML = "4";
    document.getElementById("row6col5").innerHTML = "10";
    document.getElementById("row6col6").innerHTML = "10";
    document.getElementById("row7col5").innerHTML = "25";
    document.getElementById("row7col6").innerHTML = "25";
    document.getElementById("row8col5").innerHTML = "15";
    document.getElementById("row8col6").innerHTML = "15";

    document.getElementById("red-row2col5").innerHTML = "7";
    document.getElementById("red-row4col4").innerHTML = "7";
    document.getElementById("red-row5col4").innerHTML = "10";
    document.getElementById("red-row5col5").innerHTML = "5";
    document.getElementById("red-row6col5").innerHTML = "80";
    document.getElementById("red-row6col6").innerHTML = "80";
    document.getElementById("red-row7col5").innerHTML = "120";
    document.getElementById("red-row7col6").innerHTML = "120";
    document.getElementById("red-row8col5").innerHTML = "85";
    document.getElementById("red-row8col6").innerHTML = "99";
    // removeClass("active", ".tableHead");
    // removeClass("openTricuspid", "#wrightTable");
  },
})

// RAPID VENTRICULAR FILLING - 0 to 110 - duration 110

// Right bolus moves into vena cavae
.add(
  ".bolus-right",
  {
    ease: 'linear',
    visibility: 'visible',
    keyframes: {                 
      '0%'  : { opacity: 0 },
      '15%' : { opacity: 1 }
    },
    duration: 100,
    ...svg.createMotionPath('.bolus-right-path-1')
  }, "<<"
)
// Left bolus moves into pulmonary vein
.add(
  ".bolus-left",
  {
    ease: 'linear',
    visibility: 'visible',
    keyframes: {                 
      '0%'  : { opacity: 0 },
      '10%' : { opacity: 1 }
    },
    duration: 100,
    ...svg.createMotionPath('.bolus-left-path-1')
  }, "<<"
)

// left ventricle expands
.add(
  '.ventricle-l',
  {
    ease: 'linear',
    d: "M319.39 276.6C308.39 276.6 292.39 263.6 287.39 272.6 275.61 294.48 256.75 314.23 233.19 321.13 236.99 328.4 240.64 334.8 243.84 339.96 252.11 353.32 271 366 282 388 300 418 315 443 343 432S376 370 358.32 298.66C354.64 289.51 349.03 276.96 344.5 264.29 342.34 265.3 340.3 266.7 338.4 268.6 332.4 272.6 326.4 277.6 319.4 276.6Z",
    duration: 110
  }
)
// right ventricle expands at the same time
.add(
  '.ventricle-r',
  {
    ease: 'linear',
    d: "M190.96 286.53C158.7 300.07 129.15 327.44 133.39 365.6 133.39 369.6 132.39 374.6 128.39 377.6 112.87 384.9 94.03 388.04 83.26 402.22 85.82 403.72 89.09 407.02 93.26 412.6 128.05 459.1 159.91 495.95 202 498 231 499 251 479 253 434 255 384 228.75 323.96 190.96 286.53Z",
    duration: 110
  }, "<<"
)
// heartwall slightly expands at same time
.add(
  '.heartwall',
  {
    ease: 'linear',
    d: "M128.89 40.51C90.5 105.67 113.63 216.02 176.14 261.49 187.29 269.99 197.9 281.72 208.34 295.09 205.75 286.19 203.42 276.92 201.47 267.6 197.11 246.86 194.6 225.92 195.27 208.49 195.61 199.74 200.29 185.27 209.98 172.65 218.11 162.07 232.4 149.46 254.29 149.46 255.98 149.46 257.7 149.54 259.42 149.69 279.25 151.46 294.23 159.17 306.27 165.37 315.25 169.99 323.01 173.99 330.49 174.55 331.27 174.61 332.1 174.64 332.96 174.64 350.95 174.64 377.16 161.91 377.42 161.78L378.24 161.38 378.78 166.67 382.51 203.18 383.03 208.24C330.11 206.44 357.76 251.84 374.15 294.65 406.97 380.37 375 520 306 534 175 554 114.01 482.49 83.07 411.34 79.55 425.33 82.23 450.52 80.46 468.49H3.66C52.53 320.94-59.97 274.27 50.69 120.87 70.57 91.34 61.45 62.53 61.97 46.4L67.38 45.93 121.82 41.14 128.89 40.51Z",
    duration: 110
  }, "<<"
)

// DIASTASIS - 110 to 320 - duration 210

// bolus moves forwaard into right atrium
.add(
  ".bolus-right",
  {
    ease: 'linear',
    visibility: 'visible',
    duration: 210,
    ...svg.createMotionPath('.bolus-right-path-2')
  }, 110
)
// left bolus moves into left atrium
.add(
  ".bolus-left",
  {
    ease: 'linear',
    visibility: 'visible',
    duration: 210,
    ...svg.createMotionPath('.bolus-left-path-2')
  }, "<<"
)
// left ventricle expands
.add(
  '.ventricle-l',
  {
    ease: 'linear',
    d: "M319.39 276.6C308.39 276.6 292.39 263.6 287.39 272.6 275.61 294.48 256.75 314.23 233.19 321.13 236.99 328.4 240.64 334.8 243.84 339.96 252.11 353.32 271 366 278 392 289 425 314 458 342 448S376 370 358.32 298.66C354.64 289.51 349.03 276.96 344.5 264.29 342.34 265.3 340.3 266.7 338.4 268.6 332.4 272.6 326.4 277.6 319.4 276.6Z",
    duration: 210
  }, 110
)
// right ventricle expands at the same time
.add(
  '.ventricle-r',
  {
    ease: 'linear',
    d: "M190.96 286.53C158.7 300.07 129.15 327.44 133.39 365.6 133.39 369.6 132.39 374.6 128.39 377.6 112.87 384.9 94.03 388.04 83.26 402.22 85.82 403.72 89.09 407.02 93.26 412.6 128.05 459.1 159.91 495.95 216 504 242 508 267 491 262 441 255 384 228.75 323.96 190.96 286.53Z",
    duration: 210
  }, "<<"
)
// heartwall slightly expands at same time
.add(
  '.heartwall',
  {
    ease: 'linear',
    d: "M128.89 40.51C90.5 105.67 113.63 216.02 176.14 261.49 187.29 269.99 197.9 281.72 208.34 295.09 205.75 286.19 203.42 276.92 201.47 267.6 197.11 246.86 194.6 225.92 195.27 208.49 195.61 199.74 200.29 185.27 209.98 172.65 218.11 162.07 232.4 149.46 254.29 149.46 255.98 149.46 257.7 149.54 259.42 149.69 279.25 151.46 294.23 159.17 306.27 165.37 315.25 169.99 323.01 173.99 330.49 174.55 331.27 174.61 332.1 174.64 332.96 174.64 350.95 174.64 377.16 161.91 377.42 161.78L378.24 161.38 378.78 166.67 382.51 203.18 383.03 208.24C330.11 206.44 357.76 251.84 374.15 294.65 406.97 380.37 389 524 310 538 165 557 114.01 482.49 83.07 411.34 79.55 425.33 82.23 450.52 80.46 468.49H3.66C52.53 320.94-59.97 274.27 50.69 120.87 70.57 91.34 61.45 62.53 61.97 46.4L67.38 45.93 121.82 41.14 128.89 40.51Z",
    duration: 210
  }, "<<"
)

// ATRIAL SYSTOLE - 310 to 410 - duration 100

// right bolus moves forward into right ventricle
.add(
  ".bolus-right",
  {
    ease: 'linear',
    visibility: 'visible',
    // keyframes: {                 
    //   '0%'  : { opacity: 0 },
    //   '15%' : { opacity: 1 },
    //   '90%' : { opacity: 1 },
    //   '100%': { opacity: 0 }
    // },
    duration: 100,
    ...svg.createMotionPath('.bolus-right-path-3')
  }, 310
)
// left bolus moves into left ventricle
.add(
  ".bolus-left",
  {
    ease: 'linear',
    visibility: 'visible',
    duration: 100,
    ...svg.createMotionPath('.bolus-left-path-3')
  }, 310
)
// contraction of atrium
.add(
  $atriumr,
  {
    d: "M 133.39 365.6 c 0 4 -1 9 -5 12 c -15.52 7.3 -34.36 10.44 -45.13 24.62 c -4.05 -2.38 -6.3 -0.21 -7.47 4.64 c -0.05 0.21 -0.1 0.44 -0.15 0.67 s -0.1 0.46 -0.14 0.7 c -0.04 0.22 -0.08 0.45 -0.12 0.68 c 0 0.02 0 0.04 -0.01 0.06 c 0 0.02 0 0.04 -0.01 0.06 c -0.07 0.48 -0.14 0.98 -0.21 1.5 c -0.09 0.81 -0.17 1.66 -0.24 2.54 c -0.04 0.56 -0.08 1.13 -0.11 1.71 c -0.06 1.15 -0.1 2.35 -0.12 3.59 c 0 0.4 0 0.8 0 1.2 c -0.01 0.93 -0.01 1.89 0 2.86 c 0 0.55 0 1.1 0.02 1.67 c 0.04 2.25 0.11 4.58 0.2 6.96 c 0.04 1.07 0.09 2.15 0.14 3.24 c 0.08 1.92 0.17 3.85 0.26 5.79 c 0.1 2.11 0.2 4.21 0.28 6.28 c 0.36 8.5 0.53 16.49 -0.2 22.12 H 8.87 c 48.94 -148.39 -20.87 -187.49 45.89 -344.72 c 15.24 -32.77 13.52 -67.01 12.62 -77.84 l 54.44 -4.79 c -38.61 66.46 -16.82 177.77 50.72 229.23 c 6.13 4.67 12.31 10.11 18.42 16.16 c -32.25 13.54 -61.81 40.91 -57.57 79.07 Z",
    duration: 100,
  }, 310
)
.add(
  '.heartwall',
  {
    duration: 100,
    d: "M128.89 40.51C90.5 105.67 113.63 216.02 176.14 261.49 187.29 269.99 197.9 281.72 208.34 295.09 205.75 286.19 203.42 276.92 201.47 267.6 197.11 246.86 194.6 225.92 198 210 200 201 205 193 216 185 226 177 235 173 243 169 253 165 260 165 271 164 282 165 291 165 304 169 315.25 169.99 323.01 173.99 330.49 174.55 331.27 174.61 332.1 174.64 332.96 174.64 350.95 174.64 377.16 161.91 377.42 161.78L378.24 161.38 378.78 166.67 382.51 203.18 383.03 208.24C330.11 206.44 357.76 251.84 374.15 294.65 406.97 380.37 384 514 315 534 180 553 114.01 482.49 83.07 411.34 79.55 425.33 82.23 450.52 80.46 468.49H3.66C52.53 320.94-19 279 50.69 120.87 66 89 61.45 62.53 61.97 46.4L67.38 45.93 121.82 41.14 128.89 40.51Z"
  }, "<<"
)
.add(
  $ventricler,
  {
    duration: 100,
    d: "M190.96 286.53C158.7 300.07 129.15 327.44 133.39 365.6 133.39 369.6 132.39 374.6 128.39 377.6 112.87 384.9 94.03 388.04 83.26 402.22 85.82 403.72 89.09 407.02 93.26 412.6 128.05 459.1 159.91 495.95 205 512 272 527 287 498 273 440 263.69 384.87 228.75 323.96 190.96 286.53Z"
  }, "<<"
)
.add(
  $ventriclel,
  {
    duration: 100,
    d: "M319.39 276.6C308.39 276.6 292.39 263.6 287.39 272.6 275.61 294.48 256.75 314.23 233.19 321.13 236.99 328.4 240.64 334.8 243.84 339.96 252.11 353.32 266 366 274 396 283 429 291 478 331 473S376 370 358.32 298.66C354.64 289.51 349.03 276.96 344.5 264.29 342.34 265.3 340.3 266.7 338.4 268.6 332.4 272.6 326.4 277.6 319.4 276.6Z"
  }, "<<"
)
.add(
  $atriuml,
  {
    duration: 100,
    d: "M382.51 203.18 378.78 166.67C373.8 169.02 347.64 180.87 330.11 179.54 310.66 178.06 296 168 259 173 218 179 213 198 207 218 198.87 244.99 217.32 290.77 233.19 321.13 256.75 314.23 275.61 294.47 287.39 272.6 292.39 263.6 308.39 276.6 319.39 276.6 326.39 277.6 332.39 272.6 338.39 268.6 340.29 266.7 342.34 265.31 344.49 264.29 338.02 246.17 333.79 227.8 340.69 218.72 353.35 202.04 377.81 202.85 382.51 203.18Z"
  }, "<<"
)

// ISOVOLUMETRIC CONTRACTION

// tricuspid valve closes
.add(
  $tricuspid1,
  {
    duration: 40,
    // onComplete: (self) => {
    //   toggleActive("isovolumetricContraction")
    //   toggleActive("rapidVentricularEjection")
    // },
    d: "M126 374C124 371 113 375 102 381 90.64 386.85 83.25 394.46 76.95 403.63L88.78 407.09S95 395 106 389C118 383 127 378 126 374Z",
  }, 410
)
.add(
  $tricuspid2,
  {
    duration: 40,
    d: "M129 374C126 372 127 359 130 349 133 341 137.96 332.61 139.57 321.25L144.56 321.8C144.56 337.21 142 344 138 353 136 359 133 374 129 374Z"
  }, "<<"
)
// mitral valve closes at same time
.add(
  $mitral1,
  {
    duration: 40,
    d: "M317 269C317 267 323 265 332 264 343 263 346 264 350.79 267.6L348.88 273.96S345 270 336 269C328 269 317 272 317 269Z"
  }, "<<"
)
.add(
  $mitral2,
  {
    duration: 40,
    d: "M316 268C315 271 301 265 296 267 290 269 287.06 271.55 283.33 275.89L278.86 273.96C280.57 268.08 287.93 262.57 295 261 303 259 314 263 316 268Z",
    onComplete: self => {
      if (document.getElementById('audioCheckbox').checked) {
        audioPlay('/audio/lub.mp3');
      }
    }
  }, "<<"
)
.add(
  $ventricler,
  {
    duration: 275,
    d: "M190.96 286.53C158.7 300.07 129.15 327.44 133.39 365.6 133.39 369.6 132.39 374.6 128.39 377.6 112.87 384.9 94.03 388.04 83.26 402.22 85.82 403.72 89.09 407.02 93.26 412.6 126 459 153 472 196 475 260 483 276 457 249 376 237 340 228.75 323.96 190.96 286.53Z"
  }, 420
  // right ventricle pushes in at .1s, lasts for .275s
)
.add(
  $ventriclel,
  {
    duration: 275,
    d: "M319.39 276.6C308.39 276.6 292.39 263.6 287.39 272.6 275.61 294.48 256.75 314.23 233.19 321.13 236.99 328.4 240.64 334.8 243.84 339.96 252.11 353.32 271 366 284 389 293 406 324 414 346 402S365 366 358.32 298.66C357 290 349.03 276.96 344.5 264.29 342.34 265.3 340.3 266.7 338.4 268.6 332.4 272.6 326.4 277.6 319.4 276.6Z"
  }, "<<"
)
.add(
  $heartwall,
  {
    duration: 275,
    d: "M128.89 40.51C90.5 105.67 113.63 216.02 176.14 261.49 187.29 269.99 197.9 281.72 208.34 295.09 205.75 286.19 203.42 276.92 201.47 267.6 197.11 246.86 194.6 225.92 198 210 200 201 205 193 216 185 226 177 235 173 243 169 253 165 260 165 271 164 282 165 291 165 304 169 315.25 169.99 323.01 173.99 330.49 174.55 331.27 174.61 332.1 174.64 332.96 174.64 350.95 174.64 377.16 161.91 377.42 161.78L378.24 161.38 378.78 166.67 382.51 203.18 383.03 208.24C330.11 206.44 357.76 251.84 374.15 294.65 406.97 380.37 392 483 305 507 214 526 114.01 482.49 83.07 411.34 79.55 425.33 82.23 450.52 80.46 468.49H3.66C52.53 320.94-19 279 50.69 120.87 66 89 61.45 62.53 61.97 46.4L67.38 45.93 121.82 41.14 128.89 40.51Z"
  }, "<<"
)
.add(
    $atriumr,
    {
      duration: 275,
      d: "M133.39,365.6c0,4-1,9-5,12-15.52,7.3-34.36,10.44-45.13,24.62-4.05-2.38-6.3-.21-7.47,4.64-.05.21-.1.44-.15.67s-.1.46-.14.7c-.04.22-.08.45-.12.68,0,.02,0,.04-.01.06,0,.02,0,.04-.01.06-.07.48-.14.98-.21,1.5-.09.81-.17,1.66-.24,2.54-.04.56-.08,1.13-.11,1.71-.06,1.15-.1,2.35-.12,3.59,0,.4,0,.8,0,1.2-.01.93-.01,1.89,0,2.86,0,.55,0,1.1.02,1.67.04,2.25.11,4.58.2,6.96.04,1.07.09,2.15.14,3.24.08,1.92.17,3.85.26,5.79.1,2.11.2,4.21.28,6.28.36,8.5.53,16.49-.2,22.12H8.87c48.94-148.39-63.83-190.61,45.89-344.72,20.67-29.04,13.52-67.01,12.62-77.84l54.44-4.79c-38.61,66.46-16.82,177.77,50.72,229.23,6.13,4.67,12.31,10.11,18.42,16.16-32.25,13.54-61.81,40.91-57.57,79.07Z"
    }, "<<"
  )
.add(
  $atriuml,
  {
    duration: 275,
    d: "M382.51 203.18 378.78 166.67C373.8 169.02 347.64 180.87 330.11 179.54 310.66 178.06 292.43 157.65 258.98 154.67 219.62 151.16 200.89 192.35 200.27 208.68 198.87 244.99 217.32 290.77 233.19 321.13 256.75 314.23 275.61 294.47 287.39 272.6 292.39 263.6 308.39 276.6 319.39 276.6 326.39 277.6 332.39 272.6 338.39 268.6 340.29 266.7 342.34 265.31 344.49 264.29 338.02 246.17 333.79 227.8 340.69 218.72 353.35 202.04 377.81 202.85 382.51 203.18Z"
  }, "<<"
)
.add(
  $heartwall,
  {
    duration: 275,
    d: "M128.89 40.51C90.5 105.67 113.63 216.02 176.14 261.49 187.29 269.99 197.9 281.72 208.34 295.09 205.75 286.19 203.42 276.92 201.47 267.6 197.11 246.86 194.6 225.92 195.27 208.49 195.61 199.74 200.29 185.27 209.98 172.65 218.11 162.07 232.4 149.46 254.29 149.46 255.98 149.46 257.7 149.54 259.42 149.69 279.25 151.46 294.23 159.17 306.27 165.37 315.25 169.99 323.01 173.99 330.49 174.55 331.27 174.61 332.1 174.64 332.96 174.64 350.95 174.64 377.16 161.91 377.42 161.78L378.24 161.38 378.78 166.67 382.51 203.18 383.03 208.24C330.11 206.44 357.76 251.84 374.15 294.65 406.97 380.37 373 504 293 511 189 514 114.01 482.49 83.07 411.34 79.55 425.33 82.23 450.52 80.46 468.49H3.66C52.53 320.94-59.97 274.27 50.69 120.87 70.57 91.34 61.45 62.53 61.97 46.4L67.38 45.93 121.82 41.14 128.89 40.51Z"
  }, "<<"
)


// RAPID VENTRICULAR EJECTION
// pulmonary and aortic valves open
.add(
  ".bolus-right",
  {
    ease: 'linear',
    visibility: 'visible',
    keyframes: {                 
      '90%' : { opacity: 1 },
      '100%': { opacity: 0 }
    },
    duration: 100,
    ...svg.createMotionPath('.bolus-right-path-4')
  }, 450
)
// left bolus moves into aorta
.add(
  ".bolus-left",
  {
    ease: 'linear',
    visibility: 'visible',
    keyframes: {                 
      '90%' : { opacity: 1 },
      '100%': { opacity: 0 }
    },
    duration: 100,
    ...svg.createMotionPath('.bolus-left-path-4')
  }, "<<"
)
.add(
  $pulmonary1,
  {
    duration: 40,
    d: "M202 309C196 310 200.87 327.3 207.82 330.83 212.39 333.15 222.42 334.69 228.07 331.02L225.73 326.2C219.51 327.14 216 327 211 325 205 322 204 309 202 309Z"
  }, 450
)
.add(
  $pulmonary2,
  {
    duration: 40,
    d: "M175 304C181 303 177.58 325.91 166.94 328.12 158.34 329.91 148.74 329.84 138.87 328.45L144.37 320.76S154.46 322.65 161 322C175.46 317.93 173 305 175 304Z"
  }, "<<"
)
.add(
  $aortic1,
  {
    duration: 40,
    d: "M245 297C255 297 257 316 249 320 243 324 233.93 325.15 225.73 325.76L228.08 317.81S236.52 317.54 243 315C252.77 310.42 243 301 245 297Z"
  }, "<<"
)
.add(
  $aortic2,
  {
    duration: 40,
    d: "M264 285C262 289 273 300 279 294 284 288 286.6 278.74 284.15 273.13L279.48 274.52C279.41 280.24 280 283 277 288 273 293 266 285 264 285Z"
  }, "<<"
)

// close valves

.add(
  $pulmonary1,
  {
    duration: 40,
    // onComplete: (self) => {
    //   toggleActive("rapidVentricularEjection")
    //   toggleActive("slowVentriculeEjection")
    // },
    d: "M189.23 314.23C187.83 316.98 200.87 327.3 207.82 330.83 212.39 333.15 222.42 334.69 228.07 331.02L225.73 326.2C219.51 327.14 217.51 327.01 211.67 323.79 204.91 320.07 190.68 311.41 189.24 314.23Z"
  }, 590
)
.add(
  $pulmonary2,
  {
    duration: 40,
    d: "M188.37 313.64C189.93 316.39 177.58 325.91 166.94 328.12 158.34 329.91 148.74 329.84 138.87 328.45L144.37 320.76S154.46 322.65 164.93 320.3C175.46 317.93 186.8 310.9 188.36 313.65Z"
  }, "<<"
)
.add(
  $aortic1,
  {
    duration: 40,
    d: "M262.54 305C264.22 306.82 256.63 317.31 248.37 320.78 241.69 323.59 233.93 325.15 225.73 325.76L228.08 317.81S236.52 317.54 244.63 313.99C252.77 310.42 260.86 303.18 262.54 304.99Z"
  }, "<<"
)
.add(
  $aortic2,
  {
    duration: 40,
    d: "M263.36 305.47C266.28 307.72 277 297 281 292 284 288 286.6 278.74 284.15 273.13L279.48 274.52C279.41 280.24 278.99 282.01 275 288 272 293 261.07 303.72 263.35 305.47Z",
    onComplete: self => {
      if (document.getElementById('audioCheckbox').checked) {
        audioPlay('/audio/dub.mp3');
      }
    }
  }, "<<"
)

// ISOVOLUMETRIC RELAXATION

// tricuspid and mitral valves open
.add(
  $tricuspid1,
  {
    duration: 48,
    // onComplete: (self) => {
    //   toggleActive("slowVentriculeEjection")
    //   toggleActive("isovolumetricRelaxation")
    // },
    d: "M131 404C134 401 117 376 99 384 90.64 386.85 83.25 394.46 76.95 403.63L88.78 407.09S95 391 106 392C119 394 130 406 131 404Z"
  }, "752"
  // opens at 0.4 seconds
)
.add(
  $tricuspid2,
  {
    duration: 48,
    d: "M156 371C153 373 134 365 132 350 129.49 341.1 137.96 332.61 139.57 321.25L144.56 321.8C144.56 337.21 139.5 343.29 142 353 145 362 155 365 156 371Z"
  }, "<<"
)
.add(
  $mitral1,
  {
    duration: 48,
    d: "M330 287C327 288 323 267 334 264 343 262 346 264 350.79 267.6L348.88 273.96S345 270 339 270C330 270 332 286 330 287Z"
  }, "<<"
)
.add(
  $mitral2,
  {
    duration: 48,
    d: "M308 285C304 285 298 269 292 269 290 269 287.06 271.55 283.33 275.89L278.86 273.96C280.57 268.08 287.93 262.57 292.45 261.46 303 258 313 285 308 285Z"
  }, "<<"
)
// table updates

// rapid filling phase
.call(() => {
  console.log("rapid ventricular filling")
  document.getElementById("wrightTable").classList.remove("openPulmonary")
  document.getElementById("wrightTable").classList.remove("openTricuspid")

  document.getElementById("wrightTableRed").classList.remove("openMitral")
  changeClass("highlight", ".tableHead", "remove")
  changeClass("highlight", "#rapidFillingPhaseRight", "add")
  changeClass("highlight", "#rapidFillingPhaseLeft", "add")
  // open tricuspid and mitral valves
  document.getElementById("wrightTable").classList.add("openTricuspid")
  document.getElementById("wrightTableRed").classList.add("openMitral")
  // numbers
  if (seekDirection === 'forward') {
    const count1 = new CountUp('row2col5', -2, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('red-row2col5', 0, { startVal: 7, duration: numberAnimationDuration/1000 });
    count2.start();
  } 
}, 0)
// diastasis
.call(() => {
  console.log("diastasis")
  changeClass("highlight", ".tableHead", "remove")
  changeClass("highlight", "#diastasisLeft", "add")
  changeClass("highlight", "#diastasisRight", "add")
  if (seekDirection === 'backward') {
    const count1 = new CountUp('row4col4', 3, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('red-row4col4', 7, { duration: numberAnimationDuration/1000 });
    count2.start();
  }
}, 110)
// atrial systole
.call(() => {
  console.log("atrial systole")
  document.getElementById("wrightTable").classList.add("openTricuspid")
  document.getElementById("wrightTableRed").classList.add("openMitral")
  changeClass("highlight", ".tableHead", "remove")
  changeClass("highlight", "#atrialSystole", "add")
  // numbers
  if (seekDirection === 'forward') {
    const count1 = new CountUp('row4col4', 6, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('red-row4col4', 10, { duration: numberAnimationDuration/1000 });
    count2.start();
  } else if (seekDirection === 'backward') {
    

    const count1 = new CountUp('row5col4', 6, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('row5col5', 4, { duration: numberAnimationDuration/1000 });
    count2.start();
    const count3 = new CountUp('red-row5col4', 10, { duration: numberAnimationDuration/1000 });
    count3.start();
    const count4 = new CountUp('red-row5col5', 5, { duration: numberAnimationDuration/1000 });
    count4.start();
  }
}, 320)
// isovolumetric contraction
.call(() => {
  console.log("isovolumetric contraction")
  document.getElementById("wrightTable").classList.remove("openPulmonary")
  document.getElementById("wrightTable").classList.remove("openTricuspid")
  document.getElementById("wrightTableRed").classList.remove("openMitral")
  changeClass("highlight", ".tableHead", "remove")
  changeClass("highlight", "#isovolumetricContraction", "add")
  // close tricuspid and mitral valves
  document.getElementById("wrightTable").classList.remove("openTricuspid")
  document.getElementById("wrightTable").classList.remove("openMitral")
  // numbers
  if (seekDirection === 'forward') {
    const count1 = new CountUp('row5col4', 3, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('row5col5', 9, { duration: numberAnimationDuration/1000 });
    count2.start();
    const count3 = new CountUp('red-row5col4', 6, { duration: numberAnimationDuration/1000 });
    count3.start();
    const count4 = new CountUp('red-row5col5', 79, { duration: numberAnimationDuration/1000 });
    count4.start();
  } else if (seekDirection === 'backward') {
    

    const count1 = new CountUp('row6col5', 10, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('row6col6', 10, { duration: numberAnimationDuration/1000 });
    count2.start();
    const count3 = new CountUp('red-row6col5', 80, { duration: numberAnimationDuration/1000 });
    count3.start();
    const count4 = new CountUp('red-row6col6', 80, { duration: numberAnimationDuration/1000 });
    count4.start();
  }
}, 410)
// rapid ventricular ejection
.call(() => {
  console.log("rapid ventricular ejection")
  changeClass("highlight", ".tableHead", "remove")
  changeClass("highlight", "#rapidVentricularEjection", "add")
  // open pulmonary and aortic valve
  document.getElementById("wrightTable").classList.add("openPulmonary")
  document.getElementById("wrightTableRed").classList.add("openAortic")
  // numbers
  if (seekDirection === 'forward') {
    const count1 = new CountUp('row6col5', 25, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('row6col6', 25, { duration: numberAnimationDuration/1000 });
    count2.start();
    const count3 = new CountUp('red-row6col5', 120, { duration: numberAnimationDuration/1000 });
    count3.start();
    const count4 = new CountUp('red-row6col6', 120, { duration: numberAnimationDuration/1000 });
    count4.start();
  } else if (seekDirection === 'backward') {
    

    const count1 = new CountUp('row7col5', 25, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('row7col6', 25, { duration: numberAnimationDuration/1000 });
    count2.start();
    const count3 = new CountUp('red-row7col5', 120, { duration: numberAnimationDuration/1000 });
    count3.start();
    const count4 = new CountUp('red-row7col6', 120, { duration: numberAnimationDuration/1000 });
    count4.start();
  }
}, 450)
// slow ventricular ejection
.call(() => {
  console.log("slow ventricular ejection")
  document.getElementById("wrightTable").classList.add("openPulmonary")
  document.getElementById("wrightTableRed").classList.add("openAortic")
  changeClass("highlight", ".tableHead", "remove")
  changeClass("highlight", "#slowVentricularEjection", "add")
    // numbers
  if (seekDirection === 'forward') {
    const count1 = new CountUp('row7col5', 15, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('row7col6', 15, { duration: numberAnimationDuration/1000 });
    count2.start();
    const count3 = new CountUp('red-row7col5', 85, { duration: numberAnimationDuration/1000 });
    count3.start();
    const count4 = new CountUp('red-row7col6', 100, { duration: numberAnimationDuration/1000 });
    count4.start();
  } else if (seekDirection === 'backward') {
    

    const count1 = new CountUp('row8col5', 15, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('row8col6', 15, { duration: numberAnimationDuration/1000 });
    count2.start();
    const count3 = new CountUp('red-row8col5', 85, { duration: numberAnimationDuration/1000 });
    count3.start();
    const count4 = new CountUp('red-row8col6', 99, { duration: numberAnimationDuration/1000 });
    count4.start();
  }
}, 560)
// isovolumetric relaxation
.call(() => {
  console.log("isovolumetric relaxation")
  changeClass("highlight", ".tableHead", "remove")
  changeClass("highlight", "#isovolumetricRelaxation", "add")
  // close pulmonary valve
  document.getElementById("wrightTable").classList.remove("openPulmonary")
  document.getElementById("wrightTableRed").classList.remove("openAortic")
      // numbers
  if (seekDirection === 'forward') {
    const count1 = new CountUp('row8col5', 6, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('row8col6', 17, { duration: numberAnimationDuration/1000 });
    count2.start();
    const count3 = new CountUp('red-row8col5', 8, { duration: numberAnimationDuration/1000 });
    count3.start();
    const count4 = new CountUp('red-row8col6', 103, { duration: numberAnimationDuration/1000 });
    count4.start();
  } else if (seekDirection === 'backward') {
    const count1 = new CountUp('row2col5', 2, { duration: numberAnimationDuration/1000 });
    count1.start();
    const count2 = new CountUp('red-row2col5', 7, { duration: numberAnimationDuration/1000 });
    count2.start();
  }
}, 700)
// CONTRACTION AND RELAXATION TABLE ANIMATIONS
.add(
  '#atrialSystole .contract',
  {
    duration: 40,
    'border-width': '6px',
  }, 320
)
.add(
  '#isovolumetricContraction .contract',
  {
    duration: 40,
    'border-width': '6px',
  }, 410
)
.add(
  '#row5col4 + .relax',
  {
    duration: 40,
    'border-width': '0px',
  }, 410
)
.add(
  '#red-row5col4 + .relax',
  {
    duration: 40,
    'border-width': '0px',
  }, 410
)
.add(
  '#rapidVentricularEjection .contract',
  {
    duration: 40,
    'border-width': '6px',
  }, 450
)
.add(
  '#slowVentricularEjection .contract',
  {
    duration: 110,
    'border-width': '6px',
  }, 560
)
.add(
  '#isovolumetricRelaxation .relax',
  {
    duration: 40,
    'border-width': '0px',
  }, 700
)
// BOLUS ANIMATIONS IN TABLE
.add(
  ['#rapidFillingPhaseRight', '#rapidFillingPhaseLeft'],
  {
    duration: 110,
    keyframes: {                 
      '0%'  : {'--bolus-opacity': 0},
      '5%' : {'--bolus-opacity': 1},
      '95%': {'--bolus-opacity': 1},
      '100%': {'--bolus-opacity': 0}
    },
    '--bolus-pos': 16.666 * 2.5,
    '--bolus-offset': '0px'

  }, 0
)
.add(
  ['#diastasisRight', '#diastasisLeft'],
  {
    duration: 210,
    keyframes: {                 
      '0%'  : {'--bolus-opacity': 0},
      '5%' : {'--bolus-opacity': 1},
      '95%': {'--bolus-opacity': 1},
      '100%': {'--bolus-opacity': 0}
    },
    '--bolus-pos': 16.666 * 3.5,
    '--bolus-offset': '0px'

  }, 110
)
.add(
  '#atrialSystole',
  {
    duration: 90,
    keyframes: {                 
      '0%'  : {'--bolus-opacity': 0},
      '5%' : {'--bolus-opacity': 1},
      '95%': {'--bolus-opacity': 1},
      '100%': {'--bolus-opacity': 0}
    },
    '--bolus-pos': 16.666 * 4.5,
    '--bolus-offset': '10px'
  }, 320
)
.add(
  '#isovolumetricContraction',
  {
    duration: 40,
    keyframes: {                 
      '0%'  : {'--bolus-opacity': 0},
      '5%' : {'--bolus-opacity': 1},
      '95%': {'--bolus-opacity': 1},
      '100%': {'--bolus-opacity': 0}
    },
    '--bolus-pos': 16.666 * 5,
    '--bolus-offset': '15px'
  }, 410
)
.add(
  '#rapidVentricularEjection',
  {
    duration: 110,
    keyframes: {                 
      '0%'  : {'--bolus-opacity': 0},
      '5%' : {'--bolus-opacity': 1},
      '95%': {'--bolus-opacity': 1},
      '100%': {'--bolus-opacity': 0}
    },
    '--bolus-pos': 16.666 * 5.5,
    '--bolus-offset': '0px'
  }, 450
)
.add(
  '#slowVentricularEjection',
  {
    duration: 110,
    keyframes: {                 
      '0%'  : {'--bolus-opacity': 0},
      '5%' : {'--bolus-opacity': 1},
      '95%': {'--bolus-opacity': 1},
      '100%': {'--bolus-opacity': 0}
    },
    '--bolus-pos': 16.666 * 5.5,
    '--bolus-offset': '-15px'
  }, 560
)
.add(
  '#isovolumetricRelaxation',
  {
    duration: 100,
    keyframes: {                 
      '0%'  : {'--bolus-opacity': 0},
      '5%' : {'--bolus-opacity': 1},
      '95%': {'--bolus-opacity': 1},
      '100%': {'--bolus-opacity': 0}
    },
    '--bolus-pos': 16.666 * 6,
    '--bolus-offset': '0px'
  }, 700
)



let seekDirection = 'forward';
function seekTimeline() {
  tl.seek(+$range.value);
  const newValue = +$range.value;
  if (newValue > previousValue) {
    seekDirection = 'forward';
  } else if (newValue < previousValue) {
    seekDirection = 'backward';
  }
  console.log(seekDirection + " new: " + newValue + " old: " + previousValue)
  previousValue = newValue;
}



const playPauseTimeline = () => {
  if (tl.paused) {
    tl.play();
    seekDirection = 'forward';
  } else {
    tl.pause();
    updateButtonLabel(tl);
  }
};

const skipForward = () => {
  tl.seek(tl.currentTime + skipAmount)
}
const skipBackward = () => {
  tl.seek(tl.currentTime - skipAmount)
}

let previousValue = document.getElementById('progressSlider').value;
$range.addEventListener("input", seekTimeline);
$playPauseButton.addEventListener("click", playPauseTimeline);
$forward.addEventListener("click", skipForward);
$backward.addEventListener("click", skipBackward);