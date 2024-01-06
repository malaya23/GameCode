import { getSwingBlockVelocity } from './utils'
import * as constant from './constant'

export const hookAction = (instance, engine, time) => {
  // Set the initial position of the hook
  if (!instance.ready) {
    instance.x = engine.width / 2;
    instance.y = -50; // Adjust the initial height as needed
    instance.ready = true;
  }

  // Simple downward movement
  instance.y += 2; // Adjust the speed as needed
};

export const hookPainter = (instance, engine) => {
  const { ctx } = engine;
  const ropeHeight = 50; // Example rope height
  const ropeWidth = ropeHeight * 0.1;
  const hookWidth = 20; // Adjust the width of the hook image
  const hookHeight = 20; // Adjust the height of the hook image

  // Draw the long line (rope)
  ctx.fillStyle = '#000000';
  ctx.fillRect(instance.x - (ropeWidth / 2), instance.y, ropeWidth, ropeHeight);

  // Draw the hook image holding the block
  const hookImage = new Image();
  hookImage.src = 'hook_image.png'; // Replace with the path to your hook image
  hookImage.onload = function () {
      ctx.drawImage(hookImage, instance.x - (hookWidth / 2), instance.y + ropeHeight, hookWidth, hookHeight);
  };
};
