import DiscordJS, { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import * as fs from 'fs'
import WriteDB from '../../writeDB.js'

export default async function SlashDelShopRole(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash del role from shop')
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const item = options.getInteger('item')

    let database = JSON.parse(fs.readFileSync('database.json'))
    // onValue(ref(db, `guilds/${interaction.guildId}/shop`), (snapshot) => {
        let shop = database.guilds[interaction.guildId].shop
        
        shop.splice(item-1, 1);

        delete database.guilds[interaction.guildId].shop
        WriteDB(database)
        // remove(ref(db, `guilds/${interaction.guildId}/shop`))

        setTimeout(() => {
            Object.assign(database.guilds[interaction.guildId], {shop})
            WriteDB(database)
            // update(ref(db, `guilds/${interaction.guildId}`), {shop})
        }, 0)


    // }, {onlyOnce: true}) 
    

    interaction.reply({content: 'deleted', ephemeral: true})
    } else {
        let Embed = new EmbedBuilder()
        .setColor(0x3a60b5)
        // .setAuthor({ name: `${interaction.user.username} ▪ crime`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
        .setTitle(`You are not an administrator!`)
        .setTimestamp()
        .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
        interaction.reply({  embeds: [Embed], ephemeral: true })
    }
}