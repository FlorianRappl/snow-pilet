const transforms = ['transform', 'msTransform', 'webkitTransform', 'mozTransform', 'oTransform'];
const transformProperty = getSupportedPropertyName(transforms);

const snowflakes: Array<any> = [];

const numberOfSnowflakes = 70;
let resetPositionFlag = false;
let browserWidth: number;
let browserHeight: number;
let currentFrame: number;

function resizeHandler() {
  resetPositionFlag = true;
}

// Check for vendor's supported properties.
function getSupportedPropertyName(properties: Array<string>) {
  for (const prop of properties) {
    if (typeof document.body.style[prop] !== 'undefined') {
      return prop;
    }
  }
  return '';
}

// Constructor for our Snowflake object
function Snowflake(element: Node, radius: number, speed: number, xPos: number, yPos: number) {
  this.element = element;
  this.radius = radius;
  this.speed = speed;
  this.xPos = xPos;
  this.yPos = yPos;

  this.counter = 0;
  this.sign = Math.random() < 0.5 ? 1 : -1;

  this.element.style.opacity = 0.1 + Math.random();
  this.element.style.fontSize = 12 + Math.random() * 50 + 'px';

  function setTranslate3DTransform(element: HTMLElement, xPosition: number, yPosition: number) {
    const val = 'translate3d(' + xPosition + 'px, ' + yPosition + 'px' + ', 0)';
    element.style[transformProperty] = val;
  }

  this.update = function () {
    this.counter += this.speed / 5000;
    this.xPos += (this.sign * this.speed * Math.cos(this.counter)) / 40;
    this.yPos += Math.sin(this.counter) / 40 + this.speed / 30;

    setTranslate3DTransform(this.element, Math.round(this.xPos), Math.round(this.yPos));

    if (this.yPos > browserHeight) {
      this.yPos = -50;
    }
  };
}

function generateSnowflakes() {
  const originalSnowflake = document.querySelector('.snowflake') as Element;
  const snowflakeContainer = originalSnowflake.parentNode;

  if (!snowflakeContainer) {
    return;
  }

  browserWidth = document.documentElement.clientWidth;
  browserHeight = document.documentElement.clientHeight;

  // Create each individual snowflake
  for (let i = 0; i < numberOfSnowflakes; i++) {
    const snowflakeCopy = originalSnowflake.cloneNode(true);
    snowflakeContainer.appendChild(snowflakeCopy);

    const initialXPos = getRandomPosition(50, browserWidth);
    const initialYPos = getRandomPosition(50, 100);
    const speed = 5 + Math.random() * 40;
    const radius = 4 + Math.random() * 10;

    const snowflakeObject = new (Snowflake as any)(snowflakeCopy, radius, speed, initialXPos, initialYPos);
    snowflakes.push(snowflakeObject);
  }

  snowflakeContainer.removeChild(originalSnowflake);
}

function moveSnowflakes() {
  snowflakes.forEach((snowflake) => snowflake.update());

  // Reset the position of all the snowflakes to a new value
  if (resetPositionFlag) {
    browserWidth = document.documentElement.clientWidth;
    browserHeight = document.documentElement.clientHeight;

    for (const snowflake of snowflakes) {
      snowflake.xPos = getRandomPosition(50, browserWidth);
      snowflake.yPos = getRandomPosition(50, 100);
    }

    resetPositionFlag = false;
  }

  currentFrame = requestAnimationFrame(moveSnowflakes);
}

function getRandomPosition(offset: number, size: number) {
  return Math.round(-1 * offset + Math.random() * (size + 2 * offset));
}

function createContainer() {
  const container = document.body.appendChild(document.createElement('div'));
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.right = '0';
  container.style.bottom = '0';
  container.style.pointerEvents = 'none';
  container.className = 'snowflake-container';

  const flake = container.appendChild(document.createElement('p'));
  flake.style.paddingLeft = '15px';
  flake.style.fontFamily = 'Cambria, Georgia, serif';
  flake.style.fontSize = '24px';
  flake.style.position = 'fixed';
  flake.style.color = '#5ecef4';
  flake.style.userSelect = 'none';
  flake.style.zIndex = '1000';
  flake.textContent = '*';
  flake.className = 'snowflake';
}

export function startSnowflakes() {
  window.addEventListener('resize', resizeHandler, false);
  createContainer();
  generateSnowflakes();
  moveSnowflakes();
}

export function stopSnowflakes() {
  window.removeEventListener('resize', resizeHandler, false);
  snowflakes.splice(0, snowflakes.length);
  cancelAnimationFrame(currentFrame);
  document.querySelector('.snowflake-container')?.remove();
}
