import {Message} from 'discord.js';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import PlayerManager from '../managers/player';
import Command from '.';

@injectable()
export default class implements Command {
  public name = 'loop';
  public aliases = [];
  public examples = [
    ['loop', 'toggles looping one song instead of using queue']
  ];

  public requiresVC = true;

  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public async execute(msg: Message, _: string []): Promise<void> {
    const player = this.playerManager.get(msg.guild!.id);

    player.songLoop = !player.songLoop;
    await msg.channel.send('the stop-and-go light (for looping the song) is now ' + (player.songLoop ? 'green' : 'red'));
  }
}
