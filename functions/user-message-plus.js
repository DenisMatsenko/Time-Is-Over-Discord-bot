import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "./../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'

export default async function userMessagePlus(message) {
    
    // db add!
    if(!message.author.bot && !message.author.system && message.guild !== null) {
        Log(message.guild, message.author, 'User Message Plus')
        let path = `guilds/${message.guild.id}/members/${message.author.id}/memberInfo`
        let count = 0
            onValue(ref(db, path), async (snapshot) => {  
                let data = snapshot.val();
                if(!message.author.bot && data !== null) {
                    update(ref(db, path), {
                        countOfTextMessages:  parseInt(data.countOfTextMessages) + 1
                    }) 
                }
            }, {
                onlyOnce: true
            }) 
    }
}