import {Message, MessageEmbed} from 'discord.js';
import {TYPES} from '../types';
import {inject, injectable} from 'inversify';
import PlayerManager from '../managers/player';
import {STATUS} from '../services/player';
import Player from '../services/player';
import Command from '.';
import getProgressBar from '../utils/get-progress-bar';
import errorMsg from '../utils/error-msg';
import {prettyTime} from '../utils/time';
import getYouTubeID from 'get-youtube-id';

@injectable()
export default class NowPlaying implements Command {
  public name = 'nowplaying';
  public aliases = ['np'];
  public examples = [
    ['np', 'shows current song']
  ];

  private readonly playerManager: PlayerManager;

  constructor(@inject(TYPES.Managers.Player) playerManager: PlayerManager) {
    this.playerManager = playerManager;
  }

  public async execute(msg: Message, args: string []): Promise<void> {
    const player = this.playerManager.get(msg.guild!.id);

    await msg.channel.send(NowPlaying.buildRadio(player));
  }

  public static buildRadio(player: Player) {
    const currentlyPlaying = player.getCurrent();

    if (currentlyPlaying) {
      const embed = new MessageEmbed();

      embed.setTitle(currentlyPlaying.title);
      embed.setURL(`https://www.youtube.com/watch?v=${currentlyPlaying.url.length === 11 ? currentlyPlaying.url : getYouTubeID(currentlyPlaying.url) ?? ''}`);

      let description = player.status === STATUS.PLAYING ? '⏹️' : '▶️';
      description += ' ';
      description += getProgressBar(20, player.getPosition() / currentlyPlaying.length);
      description += ' ';
      description += `\`[${prettyTime(player.getPosition())}/${currentlyPlaying.isLive ? 'live' : prettyTime(currentlyPlaying.length)}]\``;
      description += ' 🔉';
      if (player.songLoop) description += ' 🔂';
      if (player.queueLoop) description += ' 🔁';

      embed.setDescription(description);

      let footer = `Source: ${currentlyPlaying.artist}`;

      embed.setFooter(footer);

      return embed;
    } else {
      return 'no thoughts, queue empty';
    }
  }
}
