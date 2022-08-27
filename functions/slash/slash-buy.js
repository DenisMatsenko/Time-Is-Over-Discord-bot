import DiscordJS, { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default async function SlashBuy(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash buy')
    const numOfItem = options.getInteger('item')
    let path = `guilds/${interaction.guildId}/shop`
    onValue(ref(db, `guilds/${interaction.guildId}/shop`), (snapshot) => {
        let data = snapshot.val()
        let item = data[numOfItem-1]

        if(item) {
            onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberMoneySystem/coins`), (snapshot) => {
                let money = snapshot.val()
                if(money >= parseInt(item.split('.')[2])) {

                    let error = false
                    client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id).roles.add(item.split('.')[0]).catch(() => {
                        error = true


                        if(error) {
                            let Embed = new EmbedBuilder()
                            .setColor(0xbd3c3c)
                            .setTitle(`Something wrong :[`)
                            .setTimestamp()
                            .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
                            interaction.reply({ embeds: [Embed], ephemeral: true})
                        } else {
                            let Embed = new EmbedBuilder()
                            .setColor(0x3a60b5)
                            .setTitle(`Role successfully purchased!`)
                            .setTimestamp()
                            .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
                            interaction.reply({ embeds: [Embed], ephemeral: true})
                        }
                    })
                    
                    update(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberMoneySystem`), {
                        coins: money - parseInt(item.split('.')[2])
                    }) 
/////////////
                    onValue(ref(db, `guilds/${interaction.guildId}/timeRoles`), (snapshot) => {
                        let data = snapshot.val()
                        let index = 0
                        if(data !== null) index = data.length

                        const role = item.split('.')[0]
                        const member = interaction.user.id
                        const time = () => {
                           let d =  new Date()
                           return (d.getFullYear()*525960 +  d.getMonth() * 43800 + (d.getDate()+parseInt(item.split('.')[1])) * 1440 + d.getHours() * 60 + d.getMinutes())
                        }

                        update(ref(db, `guilds/${interaction.guildId}/timeRoles`), {
                            [index]: `${time()}.${role}.${member}`
                        })
                    }, {onlyOnce: true})
/////////////



                }
                else {
                    let Embed = new EmbedBuilder()
                    .setColor(0xbd3c3c)
                    .setTitle(`You don't have enough coins :[`)
                    .setTimestamp()
                    .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
                    interaction.reply({ embeds: [Embed], ephemeral: true})
                }
            }, {onlyOnce: true})
        }
        else {
            let Embed = new EmbedBuilder()
            .setColor(0xbd3c3c)
            .setTitle(`Something wrong :[`)
            .setTimestamp()
            .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
            interaction.reply({ embeds: [Embed], ephemeral: true})
        }
        
        
        
    }, {onlyOnce: true})
}