import {Message} from 'discord.js';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import PlayerManager from '../managers/player';
import errorMsg from '../utils/error-msg';
import Command from '.';

@injectable()
export default class implements Command {
  public name = 'fullshuffle';
  public aliases = ['fshuffle'];
  public examples = [
    ['fullshuffle', 'shuffles the entire queue, including already-played and current songs, and re-starts at top of queue']
  ];

  public requiresVC = true;

  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public async execute(msg: Message, _: string []): Promise<void> {
    const player = this.playerManager.get(msg.guild!.id);

    await player.shuffle(true);

    await msg.channel.send('full shuffled');
  }
}
