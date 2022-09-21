import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'
import * as fs from 'fs'
import WriteDB from '../../writeDB.js'

    

export default async function SlashCrime(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash crime')
    let database = JSON.parse(fs.readFileSync('database.json'))
    // onValue(ref(db, `guilds/${interaction.guild.id}/settings`), (snapshot) => {
    
    //////////////////////////////
    const min = database.guilds[interaction.guild.id].settings.crimeGetMin
    const max = database.guilds[interaction.guild.id].settings.crimeGetMax
    const chanceL = database.guilds[interaction.guild.id].settings.chanceCrime
    const lostmin = database.guilds[interaction.guild.id].settings.crimeLostMin
    const lostmax = database.guilds[interaction.guild.id].settingsv.crimeLostMax
    ///////////////////////////////

    let path = `guilds/${interaction.guildId}/members/${interaction.user.id}/memberMoneySystem`
    // onValue(ref(db, path), (snapshot) => {
        let data = database.guilds[interaction.guildId].members[interaction.user.id].memberMoneySystem
        if(data !== null) {
            let lastTime = data.lastCrimeTime
            // console.log("data.lastCrimeTime: ",  data.lastCrimeTime)
            let d = new Date()
            

            let oldDays = lastTime.split('.')[0]
            let oldMonth = lastTime.split('.')[1]
            let oldYears = lastTime.split('.')[2]

            if(d.getFullYear() === parseInt(oldYears) && d.getMonth()+1 === parseInt(oldMonth) && d.getDate() === parseInt(oldDays)) {
                sendEmnbed({
                    color: 'red',
                    thumbnail: null,
            
                    russianTitle: `Вы уже украли что-то сегодня!`,
                    russianDescription: null,
                    russianFields: [],
            
                    englishTitle: `You already crimed today!`,
                    englishDescription: null,
                    englishFields: [],
            
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

            } else {
                let chanceNum = Math.floor(Math.random() * 101);
                if(chanceNum <= chanceL) {
                    let randomNum =  Math.floor(Math.random() * ((max+1)-min)) + min;

                    database.guilds[interaction.guildId].members[interaction.user.id].memberMoneySystem.coins = (data.coins + randomNum)
                    database.guilds[interaction.guildId].members[interaction.user.id].memberMoneySystem.lastCrimeTime = `${d.getDate()}.${(d.getMonth()+1)}.${d.getFullYear()}`
                    WriteDB(database)
                    // update(ref(db, path), {
                    //     coins: (data.coins + randomNum),
                    //     lastCrimeTime: `${d.getDate()}.${(d.getMonth()+1)}.${d.getFullYear()}`
                    // })    

                    sendEmnbed({
                        color: 'blue',
                        thumbnail: null,
                
                        russianTitle: `Вы получили ${randomNum}💰 украденных коинов`,
                        russianDescription: `Ваш баланс сейчас: ${data.coins + randomNum}💰 `,
                        russianFields: [],
                
                        englishTitle: `You made ${randomNum}💰 crime coins today.`,
                        englishDescription: `Youre bag is ${data.coins + randomNum}💰 now.`,
                        englishFields: [],
                
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

                else {
                    let randomNum =  Math.floor(Math.random() * ((lostmax+1)-lostmin)) + lostmin;

                    database.guilds[interaction.guildId].members[interaction.user.id].memberMoneySystem.coins = (data.coins - randomNum)
                    database.guilds[interaction.guildId].members[interaction.user.id].memberMoneySystem.lastCrimeTime = `${d.getDate()}.${(d.getMonth()+1)}.${d.getFullYear()}`
                    WriteDB(database)
                    // update(ref(db, path), {
                    //     coins: (data.coins - randomNum),
                    //     lastCrimeTime: `${d.getDate()}.${(d.getMonth()+1)}.${d.getFullYear()}`
                    // })

                    sendEmnbed({
                        color: 'blue',
                        thumbnail: null,
                
                        russianTitle: `Вы потеряли ${randomNum}💰 коинов :[`,
                        russianDescription: `Ваш баланс сейчас: ${data.coins - randomNum}💰 `,
                        russianFields: [],
                
                        englishTitle: `You lost ${randomNum}💰 coins :[`,
                        englishDescription: `Youre bag is ${data.coins - randomNum}💰 now.`,
                        englishFields: [],
                
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
            }
            
        }
    // }, {onlyOnce: true})
// }, {onlyOnce: true}) 
}