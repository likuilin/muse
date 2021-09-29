import {Message} from 'discord.js';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import PlayerManager from '../managers/player';
import Command from '.';
import NowPlaying from './nowplaying';

@injectable()
export default class implements Command {
  public name = 'scrobble';
  public aliases = ['scrob'];
  public examples = [
    ['scrobble', 'toggles announcing each song as it plays']
  ];

  public requiresVC = true;

  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public async execute(msg: Message, _: string []): Promise<void> {
    const player = this.playerManager.get(msg.guild!.id);

    if (player.scrobbleAnnounce) {
      player.scrobbleAnnounce = null;
      await msg.channel.send('forget what you\'ve listened to');
    } else {
      player.scrobbleAnnounce = () => {
        msg.channel.send(NowPlaying.buildRadio(player));
      };
      await msg.channel.send('dontcha forget what you\'ve listened to');
    }
  }
}
