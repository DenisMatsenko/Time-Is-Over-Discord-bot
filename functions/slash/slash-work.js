import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default function SlashWork(interaction, options, client) {
    Log(interaction.guild, interaction.user, 'Slash work')
    onValue(ref(db, `guilds/${interaction.guild.id}/settings`), (snapshot) => {

    
    //////////////////////////////
    const min = snapshot.val().workGetMin
    const max = snapshot.val().workGetMax
    ///////////////////////////////

    let path = `guilds/${interaction.guildId}/members/${interaction.user.id}/memberMoneySystem`
    onValue(ref(db, path), (snapshot) => {
        let data = snapshot.val()
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
                    // .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
                    interaction.reply({  embeds: [Embed] })
            } else {
                let randomNum = Math.floor(Math.random() * ((max+1)-min)) + min;
                update(ref(db, path), {
                    coins: (data.coins + randomNum),
                    lastWorkTime: `${d.getDate()}.${(d.getMonth()+1)}.${d.getFullYear()}`
                })

                

                let Embed = new EmbedBuilder()
                .setColor(0x3a60b5)
                .setAuthor({ name: `${interaction.user.username} ▪ work`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
                .setTitle(`You made ${randomNum} today.`)
                .setDescription(`Youre bag is ${data.coins + randomNum}💰 now.`)
                // .setTimestamp()
                // .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
                interaction.reply({  embeds: [Embed] })
            }
            
        }
    }, {onlyOnce: true})
}, {onlyOnce: true}) 
}