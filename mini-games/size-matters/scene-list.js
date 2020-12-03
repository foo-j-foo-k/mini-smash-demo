/**
 * Adds relevant mini-game scenes to game.
 */
const MINI_GAME = 'size-matters'; // Edit
game.scene.add('start-scene', startSceneConfig, true, { lastFrame: 1 });
game.scene.add('help-scene', helpSceneConfig);
game.scene.add('settings-scene', settingsSceneConfig);
game.scene.add('game-scene', sizeMattersGameConfig); // Edit
game.scene.add('game-over-scene', gameOverConfig); 