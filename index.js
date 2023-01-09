import DiscordJS, { ActivityFlags, SlashCommandBuilder, InteractionType ,  GatewayIntentBits, EmbedBuilder, PermissionsBitField, MessageActivityType  } from 'discord.js'

import BotTurnedOnMsg from './functions/sup-functions/BotTurnedOnMsg.js'
import SlashHelp from './functions/slash/slash-help.js'
import CommOnlyServsWarning from './functions/sup-functions/CommOnlyOnServsWarning.js'
import CommandList from './functions/sup-functions/SlashCommandsList.js'


import {db} from "./firebase.js"
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import SlashAddTest from './functions/slash/slash-add-test.js'
import SlashShowAllTests from './functions/slash/slash-show-all-tests.js'
import NotifyTimerStart from './functions/sup-functions/TimeToSendNotifStart.js'
import SendTestListToChannel from './functions/sup-functions/SendTestListToChammel.js'
import GetTokenimport from './functions/sup-functions/Token.js'
import DeleteOldTests from './functions/sup-functions/DeleteOldTests.js'


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
    console.log('Time is over is ready!!!')
    //BotTurnedOnMsg(client)
    CommandList(client.application?.commands)

    NotifyTimerStart()

    //send test list trigger 
    onValue(ref(db, 'Settings'), (snapshot) => { 
        let data = snapshot.val()

        if(data.TimeToSend == true) {

            SendTestListToChannel(client)
            DeleteOldTests()

            update(ref(db, 'Settings'), {
                LastNotifiDate: `${new Date().getDate()}.${new Date().getMonth()+1}`,
                TimeToSend: false,
            })
        }
    })
 
    //client.application.commands.set([])

    //console.log("client.application.commands: ",  client.application.commands.)


    // onValue(ref(db, "database"), (snapshot) => { 
    //     WriteDB(snapshot.val())
    // }, {onlyOnce: true})

    // client.application.commands.fetch("1061981789855432714")
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

        if(commandName === "add-test") { SlashAddTest(interaction, options, client)}

        if(commandName === "show-all-tests") {console.log("gg"); SlashShowAllTests(interaction, options, client)}

    } 
    else CommOnlyServsWarning()
})

client.login(GetTokenimport.Token)
//client.login(client.login(process.env.token))

