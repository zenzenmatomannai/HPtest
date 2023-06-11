const prefInfoMap = {};
const prefNameList = [];

let inputResolve = null;
let point = 0;
let count = 0;

const init = () => {
  const svg = document.getElementsByTagName("svg")[0];
  const groups = svg.getElementsByTagName("g");
  const svgRect = svg.getBoundingClientRect();

  for (const group of groups) {
    if (!group.id || group.id === "Hopporyodo") {
      continue;
    }
    prefNameList.push(group.id);

    const input = document.createElement("input");
    input.type = "button";
    input.value = group.id;
    input.onclick = () => {
      inputResolve(group.id);
    };
    document.getElementById("inputarea").appendChild(input);

    const rect = group.getBoundingClientRect();
    const left = rect.left - svgRect.left;
    const top = rect.top - svgRect.top;
    const info = {
      left,
      top,
      width: rect.width,
      height: rect.height,
      element: group
    };
    prefInfoMap[group.id] = info;
  }
};

const showPref = (id, angle) => {
  const svg = document.getElementsByTagName("svg")[0];
  for (const name of prefNameList) {
    prefInfoMap[name].element.style.transition = "none";
    prefInfoMap[name].element.style.opacity = 0;
  }

  const { left, top, width, height, element } = prefInfoMap[id];
  element.style.opacity = 1;

  element.parentElement.style.transform = `translate(${-left}px, ${-top}px)`;
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", `300`);
  svg.setAttribute("height", `300`);

  svg.style.transition = `none`;
  svg.style.transform = `scale(0.7) rotate(${angle}deg)`;
};

const game = async () => {
  const message = document.getElementById("message");
  const svg = document.getElementsByTagName("svg")[0];
  while (true) {
    message.textContent = ``;
    const angle = Math.random() * 360 - 180;
    const pref = prefNameList[Math.trunc(Math.random() * prefNameList.length)];
    showPref(pref, angle);
    const answer = await new Promise((resolve) => {
      inputResolve = resolve;
    });
    if (answer === pref) {
      point++;
      message.textContent = `正解！${point}問連続正解！`;
    } else {
      point=0;
      message.textContent = `不正解！${answer}ではなく${pref}でした`;
    }
    for (const name of prefNameList) {
      prefInfoMap[name].element.style.transition = "all 2s ease-out";
      prefInfoMap[name].element.style.opacity = 1;
    }
    svg.style.transition = `all 2s ease-out`;
    svg.style.transform = `scale(0.3) rotate(0)`;

    //    await new Promise((r) => setTimeout(r, 2000));
    await new Promise((r) => setTimeout(r, 2000));
  }
};

window.onload = () => {
  init();
  game();
};
