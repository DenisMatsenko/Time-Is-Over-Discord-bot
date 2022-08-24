import DiscordJS, { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default async function SlashDelShopRole(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash del role from shop')
    if (interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
        const item = options.getInteger('item')

    onValue(ref(db, `guilds/${interaction.guildId}/shop`), (snapshot) => {
        let shop = snapshot.val()
        
        shop.splice(item-1, 1);
        remove(ref(db, `guilds/${interaction.guildId}/shop`))

        setTimeout(() => {update(ref(db, `guilds/${interaction.guildId}`), {shop})}, 0)


    }, {onlyOnce: true}) 
    

    interaction.reply({content: 'deleted', ephemeral: true})
    } else {
        let Embed = new EmbedBuilder()
        .setColor(0x3a60b5)
        // .setAuthor({ name: `${interaction.user.username} ▪ crime`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
        .setTitle(`You are not an administrator!`)
        .setTimestamp()
        .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
        interaction.reply({  embeds: [Embed], ephemeral: true })
    }
}