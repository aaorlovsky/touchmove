let ongoingTouches = [];
let el = document.getElementById("canvas");
el.width = window.innerWidth;
el.height = window.innerHeight;

let ctx = el.getContext("2d");

//Setting up touch events and handles on the canvas
function startup() {
  el.addEventListener("touchstart", handleStart, false);
  //   el.addEventListener("touchend", handleEnd, false);
  //     el.addEventListener( "touchcancel", handleCancel, false );
  el.addEventListener("touchmove", handleMove, false);
}

document.addEventListener("DOMContentLoaded", startup);

function handleStart(evt) {
  evt.preventDefault();
  console.log("touchstart.");
  let touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    console.log("touchstart: " + i + "...");
    ongoingTouches.push(copyTouch(touches[i]));
    let color = colorForTouch(touches[i]);
    ctx.beginPath();
    ctx.arc(touches[i].pageX, touches[i].pageY, 5, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
    console.log("touchstart:" + i + ".");
  }
}

function handleMove(evt) {
  evt.preventDefault();
  let touches = evt.changedTouches;

  for (let i = 0; i < touches.length; i++) {
    let color = colorForTouch(touches[i]);
    let idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      console.log("continuing touch " + idx);
      ctx.beginPath();
      console.log(
        "ctx.moveTo(" +
          ongoingTouches[idx].pageX +
          ", " +
          ongoingTouches[idx].pageY +
          ");"
      );
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      console.log(
        "ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");"
      );
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i])); // swap in the new touch record
      console.log(".");
    } else {
      console.log("can't figure out which touch to continue");
    }
  }
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1; // not found
}

function colorForTouch(touch) {
  let r = touch.identifier % 16;
  let g = Math.floor(touch.identifier / 3) % 16;
  let b = Math.floor(touch.identifier / 7) % 16;

  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  let color = "#" + r + g + b;

  console.log(
    "color for touch with identifier " + touch.identifier + " = " + color
  );
  return color;
}

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}
