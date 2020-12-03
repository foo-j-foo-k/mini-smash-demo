/**
 * Adds relevant mini-game scenes to game.
 */
const MINI_GAME = 'chocolate-factory'; // Edit
game.scene.add('start-scene', startSceneConfig, true, { lastFrame: 2 });
game.scene.add('help-scene', helpSceneConfig);
game.scene.add('settings-scene', settingsSceneConfig);
game.scene.add('game-scene', chocolateFactoryGameConfig); // Edit
game.scene.add('game-over-scene', gameOverConfig); 