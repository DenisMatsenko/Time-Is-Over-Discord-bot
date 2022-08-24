import DiscordJS, { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js';

export default async function SwitchPage(interaction, options, client, way)  {
    Log(interaction.guild, interaction.user, 'Switch shop page')
    interaction.deferUpdate();
    let from = 0; 
    let before = 0;
    let pageNum = 0
    if(way === 'next') {pageNum = parseInt(interaction.message.embeds[0].data.title.split(' ')[1])+1}
    if(way === 'back') {pageNum = parseInt(interaction.message.embeds[0].data.title.split(' ')[1])-1}

    switch (pageNum) {
        case 1: from = 0; before = 5; break;
        case 2: from = 5; before = 10; break;
        case 3: from = 10; before = 15; break;
        case 4: from = 15; before = 20; break;
        case 5: from = 20; before = 25; break;
        case 6: from = 25; before = 30; break;
        case 7: from = 30; before = 35; break;
        case 8: from = 35; before = 40; break;
    }
 
    let isLast = false
    let isFirst = pageNum === 1 ? true : false

    let path = `guilds/${interaction.guildId}/shop`
    onValue(ref(db, path), (snapshot) => {
        let data = snapshot.val()
        let strOfItems = ''
            for (let i = from; i < before; i++) {
                if(data[i]) {
                    strOfItems += `**${i+1}**. <@&${data[i].split('.')[0]}>
                    **Time** - **${data[i].split('.')[1]}**  day/s
                    **Price** - **${data[i].split('.')[2]}**  coins\n\n`
                    if(i === data.length-1) {
                        isLast = true
                    }
                } else {
                    isLast = true
                    strOfItems += '-\n'
                }
            }

            

            let Embed = new EmbedBuilder()
            .setColor(0x3a60b5)
            .setTitle(`Page ${pageNum}`)
            .setDescription(strOfItems)
            .setTimestamp()
            .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });


            let row = new ActionRowBuilder()
            if(isFirst) {
                row
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('btnBack')
                        .setLabel('<')
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('btnNext')
                        .setLabel('>')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('x')
                        .setStyle(ButtonStyle.Secondary),
                )
            } 
            else if(isLast) {
                row
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('btnBack')
                        .setLabel('<')
                        
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('btnNext')
                        .setLabel('>')
                        .setDisabled(true)
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('x')
                        .setStyle(ButtonStyle.Secondary),
                )
            }
            else {
                row
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('btnBack')
                        .setLabel('<')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('btnNext')
                        .setLabel('>')
                        .setStyle(ButtonStyle.Secondary),
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('cancel')
                        .setLabel('x')
                        .setStyle(ButtonStyle.Secondary),
                )
            }
            interaction.message.edit({ embeds: [Embed], components: [row]})
        

            
            // interaction.channel.send({ embeds: [Embed], components: [row]})
    }, {onlyOnce: true})
}