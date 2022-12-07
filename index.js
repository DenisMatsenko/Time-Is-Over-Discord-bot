import DiscordJS, { ActivityFlags, SlashCommandBuilder, InteractionType ,  GatewayIntentBits, EmbedBuilder, PermissionsBitField, MessageActivityType  } from 'discord.js'

import BotTurnedOnMsg from './functions/sup-functions/BotTurnedOnMsg.js'
import SlashHelp from './functions/slash/slash-help.js'
import CommOnlyServsWarning from './functions/sup-functions/CommOnlyOnServsWarning.js'
import CommandList from './functions/sup-functions/SlashCommandsList.js'


import {db} from "./firebase.js"
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import SlashAddTest from './functions/slash/slash-add-test.js'




const client = new DiscordJS.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,

        GatewayIntentBits.GuildInvites,

        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessageReactions
    ]
})


client.on('ready', (client) => {
    //console.log('Time is over is ready!!!')
    //BotTurnedOnMsg(client)
    CommandList(client.application?.commands)


    // onValue(ref(db, "database"), (snapshot) => { 
    //     WriteDB(snapshot.val())
    // }, {onlyOnce: true})

    // client.application.commands.fetch('1012725832436957184')
    // .then( (command) => {
    //     console.log(`Fetched command ${command.name}`)
    //     // further delete it like so:
    //     command.delete()
    //     console.log(`Deleted command ${command.name}`)
    //     }).catch(console.error);
}) 

client.on('interactionCreate', async (interaction) => {
    let { commandName, options } = interaction

    if(interaction.guild !== null) {
        
        if(commandName === "help") { SlashHelp(interaction, options, client)}

        if(commandName === "addtest") { SlashAddTest(interaction, options, client)}

    } 
    else CommOnlyServsWarning()
})

//MTAwMjE1MTQ2MTg5MjkyNzUxMA.GIl6a2.UXvE4a0jsxGqmq0-oUtIihDMlKbQcYcj0Fn2aQ
//client.login(process.env.token)
client.login("MTAwMjE1MTQ2MTg5MjkyNzUxMA.GIl6a2.UXvE4a0jsxGqmq0-oUtIihDMlKbQcYcj0Fn2aQ")