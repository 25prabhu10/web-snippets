// Using setInterval
function interval(node) {
  return setInterval(() => {
    node.textContent = new Date().toLocaleTimeString();
  }, 1000);
}

// Using setTimeout
function timeout(node) {
  const now = () => {
    node.textContent = new Date().toLocaleTimeString();
    setTimeout(now, 1000);
  };
  now();
}

// Using requestAnimationFrame
function frame(node) {
  let last = 0;
  const render = (now) => {
    if (!last || now - last >= 1000) {
      last = now;
      node.textContent = new Date().toLocaleTimeString();
    }
    requestAnimationFrame(render);
  };

  window.requestAnimationFrame(render);
}

// Using CSS
function css(node) {
  const P = (name, delay) => node.style.setProperty(name, `${delay}s`);

  const time = new Date();
  const hours = time.getHours() * 3600;
  const minutes = time.getMinutes() * 60;
  const seconds = time.getSeconds();

  P("--delay-hours", -Math.abs(hours + minutes + seconds));
  P("--delay-minutes", -Math.abs(minutes + seconds));
  P("--delay-seconds", -Math.abs(seconds));
}

function countdown(node, locale) {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  const setDelay = (name, delay) => {
    node.style.setProperty(`--delay-${name}`, `${delay}s`);
  };
  const setLabel = (type) => {
    const parts = rtf.formatToParts(3, type);
    return parts.at(parts.length - 1)?.value;
  };

  const end = new Date(node.getAttribute("data-time")).getTime();
  const remaining = end - Date.now();

  const DAY = 86400;
  const HOUR = 3600;

  const seconds = Math.floor((remaining / 1000) % 60);
  const days = Math.floor(remaining / (DAY * 1000));
  const hours = Math.floor((remaining / (HOUR * 1000)) % 24);
  const minutes = Math.floor((remaining / (60 * 1000)) % 60);

  const SECONDS = -Math.abs(60 - seconds);
  const MINUTES = -Math.abs(HOUR - minutes * 60 - (60 - 1) - SECONDS);
  const HOURS = -Math.abs(DAY - hours * HOUR + MINUTES);

  [...node.children].forEach((child, _) => {
    child.textContent = setLabel(child.dataset.label);
  });

  setDelay("days", -Math.abs(31536000 - days * DAY + HOURS));
  setDelay("hours", HOURS);
  setDelay("minutes", MINUTES);
  setDelay("seconds", SECONDS);
}

interval(document.getElementById("interval"));
timeout(document.getElementById("timeout"));
frame(document.getElementById("frame"));
css(document.getElementById("css"));

// // Init, play with `locale`!
const localeLanguage = navigator?.language ?? "en-US";
countdown(document.querySelector(".countdown", localeLanguage));
