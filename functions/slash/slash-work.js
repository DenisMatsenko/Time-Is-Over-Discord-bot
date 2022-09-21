import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'
import * as fs from 'fs'
import WriteDB from '../../writeDB.js'

export default function SlashWork(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash work')
    let database = JSON.parse(fs.readFileSync('database.json'))



    
    //////////////////////////////
    const min = database.guilds[interaction.guild.id].settings.workGetMin
    const max = database.guilds[interaction.guild.id].settings.workGetMax
    ///////////////////////////////

    let path = `guilds/${interaction.guildId}/members/${interaction.user.id}/memberMoneySystem`
    
        let data = database.guilds[interaction.guildId].members[interaction.user.id].memberMoneySystem
        if(data !== null) {
            let lastTime = data.lastWorkTime
            let d = new Date()
            

            let oldDays = lastTime.split('.')[0]
            let oldMonth = lastTime.split('.')[1]
            let oldYears = lastTime.split('.')[2]

            if(d.getFullYear() === parseInt(oldYears) && d.getMonth()+1 === parseInt(oldMonth) && d.getDate() === parseInt(oldDays)) {


                    let Embed = new EmbedBuilder()
                    .setColor(0xbd3c3c)
                    .setAuthor({ name: `${interaction.user.username} ▪ work`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
                    // .setAuthor({ name: `${interaction.user.username} ▪ work`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
                    .setTitle('You already worked today.')
                    // .setTimestamp() 
                    // .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
                    interaction.reply({  embeds: [Embed] })
            } else {
                let randomNum = Math.floor(Math.random() * ((max+1)-min)) + min;

                database.guilds[interaction.guildId].members[interaction.user.id].memberMoneySystem.coins = (data.coins + randomNum)
                database.guilds[interaction.guildId].members[interaction.user.id].memberMoneySystem.lastWorkTime = `${d.getDate()}.${(d.getMonth()+1)}.${d.getFullYear()}`
                WriteDB(database)
                // update(ref(db, path), {
                //     coins: (data.coins + randomNum),
                //     lastWorkTime: `${d.getDate()}.${(d.getMonth()+1)}.${d.getFullYear()}`
                // })

                
                sendEmnbed({
                    color: 'blue',
                    thumbnail: null,
        
                    russianTitle:`Ты заработал ${randomNum}.`,
                    russianDescription: `Твой баланс сейчас: ${data.coins + randomNum}💰.`,
                    russianFields: [],
        
                    englishTitle: `You made ${randomNum} today.`,
                    englishDescription: `Youre bag is ${data.coins + randomNum}💰 now.`,
                    englishFields: [],
        
                    author: {name: `${interaction.user.username} ▪ Work`, iconURL: interaction.user.avatarURL(), url: 'https://discord.gg/rEeW7Rs92q'},
                    //timestamp: true,
                    footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
        
                    guildId: interaction.guildId,
                    feedback: {
                      type: 'reply',
                      path: interaction,
                      ephemeral: false
                    },
                  })
            }
            
        }
}