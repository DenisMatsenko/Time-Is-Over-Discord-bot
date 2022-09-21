import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'
import * as fs from 'fs'
import WriteDB from '../../writeDB.js'



    
   

export default async function SlashHelp(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash help')

    let database = JSON.parse(fs.readFileSync('database.json'))
    let data = database.guilds[interaction.guild.id].settings

    sendEmnbed({
        color: 'blue',
        thumbnail: null,

        russianTitle: `Все команды Time is over`,
        russianDescription: `**Экономика**
        ● ***/work*** - Ты получаешь от ${data.workGetMin} до ${data.workGetMax} коинов. Использовать можно раз в день.
        ● ***/crime*** - Дает ${data.chanceCrime}% шанс получить от ${data.crimeGetMin} до ${data.crimeGetMax} коинов, в случае невезения вы теряете од ${data.crimeLostMin} до ${data.crimeLostMax} коинов. Использовать можно раз в день.
        ● ***/shop*** - Посмотреть магазин сервера.
        ● ***/buy*** [_номер_] - Вы покупаете товар под _номером_ за ваши коины.
        ● ***/wallet*** - Посмотреть баланс.
    
        **Активность**
        ● ***/top*** - Показывает топ активных игроков сервера.
        ● ***/myreferral*** [_@пользователь_] - Делает _@пользователя_ вашим рефералом, он будет получать бонусные ${data.referalPoints ? data.referalPoints : '20'}% от ваших очков активности. Сделайте рефералом человека который пригласил вас на сервер. Вы можете сделать это _только один раз!_
        ● ***/active*** - Посмотреть свои очки активности, время в чате, количество сообщений.
    
        ! За одно сообщение вы получаете **${data.pointPerMsg}** очко/в активности, за одну минуту в чате вы получаете **${data.pointPerMinute}** очков активности.
        `,
        russianFields: [
            { name: '**Interaction**', value: `
            ● ***/hug*** [_@пользователь_]
            ● ***/hit*** [_@пользователь_]
            ● ***/kiss*** [_@пользователь_]
            ● ***/pat*** [_@пользователь_]
            ● ***/bite*** [_@пользователь_]
            ● ***/slap*** [_@пользователь_]
            ● ***/cry***
            `, inline: true },
            { name: '**ADMIN**', value: `
            ● ***/settings***
            ● ***/settingsreview***
            ● ***/addshoprole***
            ● ***/delshoprole***
            `, inline: true },
        ],

        englishTitle: `All commands from Time is over`,
        englishDescription: `**Economics**
        ● ***/work*** - You get from ${data.workGetMin} to ${data.workGetMax} coins. Can be used once a day.
        ● ***/crime*** - You have a ${data.chanceCrime}% chance to get from ${data.crimeGetMin} to ${data.crimeGetMax} coins, otherwise you will lose from ${data.crimeLostMin} to ${data.crimeLostMax} coins. Can be used once a day.
        ● ***/shop*** - Shows the store of this server.
        ● ***/buy*** [_number_] - You buy an item under the entered _number_ for your coins.
        ● ***/wallet*** - Shows your wallet.
    
        **Activity**
        ● ***/top*** - Shows the top active members of the server.
        ● ***/myreferral*** [_@user_] - Make the _@user_ your referral, he will receive 20% of your activity points. Make your referral only the person who invited you to the server. You can use this command _only once!_
        ● ***/active*** - Shows the number of activity points, sent messages and minutes in voice chat.
    
        ! For one message you get **${data.pointPerMsg}** activity point, for one minute in voice chat you get **${data.pointPerMinute}** activity points.
        `,
        englishFields: [
            { name: '**Interaction**', value: `
            ● ***/hug*** [_@user_]
            ● ***/hit*** [_@user_]
            ● ***/kiss*** [_@user_]
            ● ***/pat*** [_@user_]
            ● ***/bite*** [_@user_]
            ● ***/slap*** [_@user_]
            ● ***/cry***
            `, inline: true },
            { name: '**ADMIN**', value: `
            ● ***/settings***
            ● ***/settingsreview***
            ● ***/addshoprole***
            ● ***/delshoprole***
            `, inline: true },
        ],

        author: { name: `${interaction.user.username} ▪ crime`, iconURL: interaction.user.avatarURL(), url: 'https://discord.gg/rEeW7Rs92q' },                            
        //// timestamp: 'true',
        footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },

        guildId: interaction.guildId,
        feedback: {
          type: 'reply',
          path: interaction,
          ephemeral: false,
        },
    })
}