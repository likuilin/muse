import {Message} from 'discord.js';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import PlayerManager from '../managers/player';
import errorMsg from '../utils/error-msg';
import Command from '.';

@injectable()
export default class implements Command {
  public name = 'reset';
  public aliases = ['destroy', 'leave', 'terminate', 'stop'];
  public examples = [
    ['reset', 'disconnects player and deletes entire queue and clears scrobble and loop flags']
  ];

  public requiresVC = true;

  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public async execute(msg: Message, _: string []): Promise<void> {
    const player = this.playerManager.get(msg.guild!.id);

    if (!player.voiceConnection) {
      await msg.channel.send(errorMsg('not connected'));
      return;
    }

    player.reset();

    await msg.channel.send('“I love to soar in the boundless sky. In the vast emptiness of the blue, my soul rejoices listening to the soundless music of the wind.”\n― Banani Ray, World Peace: The Voice of a Mountain Bird');
  }
}
