import DiscordJS, { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default async function SlashBuy(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash buy')
    const numOfItem = options.getInteger('item')
    
    onValue(ref(db, `guilds/${interaction.guildId}/shop/${numOfItem - 1}`), (snapshot) => {
        let item = snapshot.val()

        if(item) {
            onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberMoneySystem/coins`), (snapshot) => {
                let money = snapshot.val()

                if(money >= parseInt(item.split('.')[2])) {
                    if (!interaction.member.roles.cache.some(role => role.id === item.split('.')[0])) {
                        let isError = false
                        client.guilds.cache.get(interaction.guildId).members.cache.get(interaction.user.id).roles.add(item.split('.')[0]).catch(error => {isError = true})
                        isError ? embedReply(interaction, 'Something wrong, check bot permissions!', 'red', client) : writeToDb(interaction, item, client)
                    }
                    else {
                        embedReply(interaction, 'You already have this role!', 'red', client)
                    }
                }
                else {
                    embedReply(interaction, 'You dont have enought coins!', 'red', client)
                }
            }, {onlyOnce: true})
        }
        else {
            embedReply(interaction, 'Wrong number!', 'red', client)
        }
    }, {onlyOnce: true})
}

const writeToDb = (interaction, item, client) => {
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

        embedReply(interaction, 'Role successfully purchased!', '', client)
    }, {onlyOnce: true})
}

const embedReply = (interaction, text, color, client) => {
    let Embed = new EmbedBuilder()
    .setColor(color === 'red' ? 0xbd3c3c : 0x3a60b5)
    .setTitle(text)
    .setTimestamp()
    .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
    interaction.reply({ embeds: [Embed], ephemeral: true})
}