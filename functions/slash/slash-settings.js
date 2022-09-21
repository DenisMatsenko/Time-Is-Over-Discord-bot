import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'
import * as fs from 'fs'
import WriteDB from '../../writeDB.js'

export default function SlashSettings(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash settings')
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    let database = JSON.parse(fs.readFileSync('database.json'))
    const settings = {
        voiceManageChannel: options.getChannel('voice-manage-channel') !== null ? options.getChannel('voice-manage-channel').id : options.getChannel('voice-manage-channel'),
        pointPerMinute: options.getNumber('point-per-minute'),
        pointPerMsg: options.getNumber('point-per-message'),
        chanceCrime: options.getNumber('chance-to-crime'),
        crimeGetMax: options.getNumber('crime-max'),
        crimeGetMin: options.getNumber('crime-min'),
        crimeLostMin: options.getNumber('crime-lost-min'),
        crimeLostMax: options.getNumber('crime-lost-max'),
        workGetMax: options.getNumber('work-max'),
        workGetMin: options.getNumber('work-min'),
        language: options.getString('bot-language'),
        referalPoints: options.getNumber('referal-points'),
    }


    let arr = Object.getOwnPropertyNames(settings)
    
    for (let i = 0; i < arr.length; i++) {
        if(settings[arr[i]] !== null) {
            
            database.guilds[interaction.guild.id].settings[arr[i]] =  settings[arr[i]]
            // update(ref(db, `guilds/${interaction.guild.id}/settings`), {
            //     [arr[i]]: settings[arr[i]]
            // })
        }
    }
    WriteDB(database)

    sendEmnbed({
        color: 'blue',
        thumbnail: null,

        russianTitle: `Настройки сохранены!`,
        russianDescription: `Используйте **/settingsreview**.`,
        russianFields: [],

        englishTitle: `Settings has been changed!`,
        englishDescription: `Use **/settingsreview**.`,
        englishFields: [],

        author: null,                            
        // timestamp: 'true',
        footer: null,

        guildId: interaction.guildId,
        feedback: {
          type: 'reply',
          path: interaction,
          ephemeral: true,
        },
    })

    } else {
        sendEmnbed({
            color: 'red',
            thumbnail: null,
    
            russianTitle: `Вы не администратор!`,
            russianDescription: null,
            russianFields: [],
    
            englishTitle: `You are not an administrator!`,
            englishDescription: null,
            englishFields: [],
    
            author: null,                            
            // timestamp: 'true',
            footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
    
            guildId: interaction.guildId,
            feedback: {
              type: 'reply',
              path: interaction,
              ephemeral: false,
            },
        }) 
    }
}