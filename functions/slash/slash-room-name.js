import DiscordJS, { ActivityFlags, SlashCommandBuilder,TextInputStyle, TextInputBuilder, ModalBuilder, ActionRowBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js';

export default function roomName(interaction, options, client) {
  Log(interaction.guild, interaction.user, 'Room name')
    // const [key, value] of Object.entries(date)
    const modal = new ModalBuilder()
        .setCustomId('roomname1')
        .setTitle('Change room name.')
        .addComponents([
          new ActionRowBuilder().addComponents(
            new TextInputBuilder()
              .setCustomId('roomname')
              .setLabel('Enter new room name')
              .setStyle(TextInputStyle.Short)
              .setMinLength(1)
              .setMaxLength(20)
              .setPlaceholder('cool room name....')
              .setRequired(true),
          ),
        ]);
    interaction.showModal(modal);
}