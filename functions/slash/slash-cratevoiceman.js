import DiscordJS, { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default async function SlashCreateVoiceMan(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash SlashCreateVoiceMan')
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

        const Category = await interaction.guild.channels.create({
            name: 'category name',
            type: 4,
            position: 1,
          });
        
        const ManageTextChannel = await interaction.guild.channels.create({
            name:`room management`, 
            type: 0,
            parent: Category,
            position: 1,
            permissionOverwrites: [{
                id: interaction.guild.roles.everyone,
                deny: [PermissionsBitField.Flags.SendMessages],      
            }]
          });
         
        const ManageVoiceChannel = await interaction.guild.channels.create({
            name:`create room`, 
            type: 2,
            parent: Category,
            position: 2,

        })

          let path = `guilds/${interaction.guildId}/settings/voiceManageChannel`
          update(ref(db, path), {
            [ManageVoiceChannel.id]: 'qwd'
          })



        let Embed = new EmbedBuilder()
        .setColor(0x3a60b5)
        .setTitle(`Room management panel`)
        .setURL('https://discord.gg/rEeW7Rs92q')
        .setDescription(`
        **Name** - change room name
        **Lock** - lock room
        **Unlock** - unlock room`)
        // .setImage('https://media.discordapp.net/attachments/1006251207578361948/1012726409728368750/unknown.png')
        // .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
    
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('roomname')
                .setLabel('Name')
                .setStyle(ButtonStyle.Primary),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('roomlock')
                .setLabel('Lock')
                .setStyle(ButtonStyle.Primary),
        )
        .addComponents(
            new ButtonBuilder()
                .setCustomId('roomunlock')
                .setLabel('Unlock')
                .setStyle(ButtonStyle.Primary),
        )
        ManageTextChannel.send({ content: '** **', embeds: [Embed], components: [row] })

        let Embed2 = new EmbedBuilder()
        .setColor(0x3a60b5)
        // .setAuthor({ name: `${interaction.user.username} ▪ crime`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
        .setTitle(`Created!`)
        .setTimestamp()
        .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
        interaction.reply({  embeds: [Embed2], ephemeral: true })

    } else {
        let Embed = new EmbedBuilder()
        .setColor(0x3a60b5)
        // .setAuthor({ name: `${interaction.user.username} ▪ crime`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
        .setTitle(`You are not an administrator!`)
        .setTimestamp()
        .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
        interaction.reply({  embeds: [Embed], ephemeral: true })
    }
}