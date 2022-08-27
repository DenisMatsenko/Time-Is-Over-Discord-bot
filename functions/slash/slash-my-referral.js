import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import { async } from '@firebase/util'
import Log from '../log.js'

export default async function SlashMyReferral(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash my referral')
    let User = options.getUser('user') 

        if(!User.bot && !User.system && interaction.guildId !== null) {
            let path = `guilds/${interaction.guildId}/members/${User.id}`
        
            onValue(ref(db, path), (snapshot) => {
              let data = snapshot.val();
              onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`), (snapshot) => {
                let mydata = snapshot.val();
    
              //exists checking
              if(data !== null && interaction.user.id != User.id && !mydata.hasRefferal) {
                set(ref(db, `${path}/referrals/${interaction.user.id}`), {
                    userName: interaction.user.username,
                    userId: interaction.user.id
                })

                update(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`), {
                    hasRefferal: true,
                  })

                let Embed = new EmbedBuilder()
                .setColor(0x3a60b5)
                // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
                .setTitle('You became a refer')
                .setDescription(`<@${User.id}> is now your referral.`)
                .setTimestamp()
                .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
                interaction.reply({ embeds: [Embed] })
              }
              else if (data !== null && interaction.user.id != User.id && mydata.hasRefferal) {
                let Embed = new EmbedBuilder()
                .setColor(0xbd3c3c)
                // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
                .setTitle('Something is wrong :[')
                .setDescription(`You already have a referral.`)
                .setTimestamp()
                .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
                interaction.reply({ embeds: [Embed] })
              }
              else if (data !== null && interaction.user.id == User.id) {
                let Embed = new EmbedBuilder()
                .setColor(0xbd3c3c)
                // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
                .setTitle('Something is wrong :[')
                .setDescription(`You can't be your own referral.`)
                .setTimestamp()
                .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
                interaction.reply({ embeds: [Embed] })
              }
              else {
                let Embed = new EmbedBuilder()
                .setColor(0xbd3c3c)
                // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
                .setTitle('Something is wrong :[')
                .setDescription(`<@${User.id}> doesn't have an interactive account.`)
                .setTimestamp()
                .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
                interaction.reply({ embeds: [Embed] })
              }
            }, {
                onlyOnce: true 
            })
            }, {
                onlyOnce: true 
            })
        } else {
            let Embed = new EmbedBuilder()
            .setColor(0xbd3c3c)
            // .setAuthor({ name: `Time is over from ${message.guild.name}`, iconURL: client.users.cache.get('1002151461892927510').avatarURL(), url: 'https://discord.js.' })
            .setTitle('Something is wrong :[')
            .setDescription(`Wrong account entered.`)
            .setTimestamp()
            .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
            interaction.reply({ embeds: [Embed] })
        }
}