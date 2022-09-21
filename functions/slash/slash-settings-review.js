import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'
import * as fs from 'fs'
import WriteDB from '../../writeDB.js'

export default function SlashSettingsReview(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash settings review')
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

        let database = JSON.parse(fs.readFileSync('database.json'))
        // onValue(ref(db, `guilds/${interaction.guild.id}/settings`), (snapshot) => {
            let data = database.guilds[interaction.guild.id].settings
            let arr = Object.getOwnPropertyNames(data)
            let strresult = ``

            for (let i = 0; i < arr.length; i++) {
                if(arr[i] == 'voiceManageChannel') {
                } else {
                    strresult += `${arr[i]} - ${data[arr[i]]}.\n`
                }
            }
            
            sendEmnbed({
                color: 'blue',
                thumbnail: null,
        
                russianTitle: `Обзор настроек`,
                russianDescription: `${strresult}`,
                russianFields: [],
        
                englishTitle: `Settings review.`,
                englishDescription: `${strresult}`,
                englishFields: [],
        
                author: null,                            
                // timestamp: 'true',
                footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
        
                guildId: interaction.guildId,
                feedback: {
                  type: 'reply',
                  path: interaction,
                  ephemeral: true,
                },
            })
        // }, {onlyOnce: true})     

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