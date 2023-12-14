import { startSnowflakes, stopSnowflakes } from './snow';

export function setup() {
  startSnowflakes();
}

export function teardown() {
  stopSnowflakes();
}
