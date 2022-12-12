import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import {db} from "./../../firebase.js"
import { v4 } from 'uuid';



export default async function SlashAddTest(interaction, options, client)  {
    const testSubject  = options.getString('test-subject')
    const testDate     = options.getString('test-date')
    const testTopic    = options.getString('test-topic')
    const testLinks    = options.getString('test-links')


    // onValue(ref(db, "database"), (snapshot) => { 

    // }, {onlyOnce: true})

    const ID = v4();

    let obj = {
        ['test-subject']: testSubject,
        ['test-date']: testDate,
        ['test-topic']: testTopic,
        ['test-links']: testLinks,
        ['created-by-id']: interaction.user.id,
        ['created-by-name']: interaction.user.username,
        ['created-by-pfp']: interaction.user.avatarURL(),
        ['test-id']: ID,
    }


    
    update(ref(db, 'database'), {
        [ID]: obj,
    })

    
    let Embed = new EmbedBuilder()
    .setTitle('Test-reminder successfully created!')
    .setTimestamp()

    interaction.reply({  embeds: [Embed] })
}