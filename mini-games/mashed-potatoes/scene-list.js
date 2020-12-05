/**
 * Adds relevant mini-game scenes to game.
 */
const MINI_GAME = 'mashed-potatoes'; // Edit
game.scene.add('start-scene', startSceneConfig, true, { lastFrame: 1 });
game.scene.add('help-scene', helpSceneConfig);
game.scene.add('settings-scene', settingsSceneConfig);
game.scene.add('game-scene', mashedPotatoesGameConfig); 
game.scene.add('game-over-scene', gameOverConfig); 