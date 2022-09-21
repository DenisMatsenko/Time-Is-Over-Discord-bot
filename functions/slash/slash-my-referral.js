import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import { async } from '@firebase/util'
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'
import * as fs from 'fs'
import WriteDB from '../../writeDB.js'

export default async function SlashMyReferral(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash my referral')
    let User = options.getUser('user') 

        if(!User.bot && !User.system && interaction.guildId !== null) {
            // let path = `guilds/${interaction.guildId}/members/${User.id}`
        
            let database = JSON.parse(fs.readFileSync('database.json'))
            // onValue(ref(db, path), (snapshot) => {
              let data = database.guilds[interaction.guildId].members[User.id]

              
              // onValue(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`), (snapshot) => {
                let mydata = database.guilds[interaction.guildId].members[interaction.user.id].memberInfo
     
              //exists checking
              if(data && interaction.user.id != User.id && !mydata.hasRefferal) {
                // database.guilds[interaction.guildId].members[User.id].referrals[interaction.user.id]

                if(!database.guilds[interaction.guildId].members[User.id].referrals) {
                  Object.assign(database.guilds[interaction.guildId].members[User.id], {referrals: {[interaction.user.id]: {userName: interaction.user.username, userId: interaction.user.id}}})
                }
                else {
                  Object.assign(database.guilds[interaction.guildId].members[User.id].referrals, {[interaction.user.id]: {userName: interaction.user.username, userId: interaction.user.id}})
                }
                database.guilds[interaction.guildId].members[interaction.user.id].memberInfo.hasRefferal = true
                WriteDB(database)

                // set(ref(db, `${path}/referrals/${interaction.user.id}`), {
                //     userName: interaction.user.username,
                //     userId: interaction.user.id
                // })

                
                // update(ref(db, `guilds/${interaction.guildId}/members/${interaction.user.id}/memberInfo`), {
                //     hasRefferal: true,
                //   })

                  
                  sendEmnbed({
                    color: 'blue',
                    thumbnail: null,
            
                    russianTitle: `Вы стали реферером`,
                    russianDescription: `<@${User.id}> твой реферал.`,
                    russianFields: [],
            
                    englishTitle: `You became a refer`,
                    englishDescription: `<@${User.id}> is now your referral.`,
                    englishFields: [],
            
                    author: null,                            
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
              else if (data && interaction.user.id != User.id && mydata.hasRefferal) {
                sendEmnbed({
                  color: 'red',
                  thumbnail: null,
          
                  russianTitle: `Что-то пошло не так :[`,
                  russianDescription: `У вас уже есть реферал`,
                  russianFields: [],
          
                  englishTitle: `Something is wrong 1 :[`,
                  englishDescription: `You already have a referral.`,
                  englishFields: [],
          
                  author: null,                            
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
              else if (data && interaction.user.id == User.id) {
                sendEmnbed({
                  color: 'red',
                  thumbnail: null,
          
                  russianTitle: `Что-то пошло не так :[`,
                  russianDescription: `У вас уже есть реферал`,
                  russianFields: [],
          
                  englishTitle: `Something is wrong 2 :[`,
                  englishDescription: `You already have a referral.`,
                  englishFields: [],
          
                  author: null,                            
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
              else {
                sendEmnbed({
                  color: 'red',
                  thumbnail: null,
          
                  russianTitle: `Что-то пошло не так :[`,
                  russianDescription: `У <@${User.id}> нет аккаунта.`,
                  russianFields: [],
          
                  englishTitle: `Something is wrong 3 :[`,
                  englishDescription: `<@${User.id}> doesn't have an interactive account.`,
                  englishFields: [],
          
                  author: null,                            
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
            // }, {
            //     onlyOnce: true 
            // })
            // }, {
            //     onlyOnce: true 
            // })
        } else {
          sendEmnbed({
            color: 'red',
            thumbnail: null,
    
            russianTitle: `Что-то пошло не так  :[`,
            russianDescription: `Введен неправильный аккаунт.`,
            russianFields: [],
    
            englishTitle: `Something is wrong 4 :[`,
            englishDescription: `Wrong account entered.`,
            englishFields: [],
    
            author: null,                            
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
}