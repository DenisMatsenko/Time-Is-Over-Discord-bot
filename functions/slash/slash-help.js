import DiscordJS, { ActionRowBuilder, ButtonBuilder,  ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'

export default async function SlashHelp(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash help')
    onValue(ref(db, `guilds/${interaction.guild.id}/settings`), (snapshot) => {
    let data = snapshot.val();
    
    let Embed = new EmbedBuilder()
    .setColor(0x3a60b5) 
    // .setAuthor({ name: `${interaction.user.username} ▪ crime`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
    .setTitle(`All commands from Time is over`)
    .setDescription(`**Economics**
    ● ***/work*** - You get from ${data.workGetMin} to ${data.workGetMax} coins. Can be used once a day.
    ● ***/crime*** - You have a ${data.chanceCrime}% chance to get from ${data.crimeGetMin} to ${data.crimeGetMax} coins, otherwise you will lose from ${data.crimeLostMin} to ${data.crimeLostMax} coins. Can be used once a day.
    ● ***/shop*** - Shows the store of this server.
    ● ***/buy*** [_number_] - You buy an item under the entered _number_ for your coins.
    ● ***/wallet*** - Shows your wallet.

    **Room management**
    ● ***/roomname*** - Changes the name of your room. Changes are saved even after leaving the room.
    ● ***/roomlimit*** - Changes the limit of your room. Changes are saved even after leaving the room.
    ● ***/roomlock*** - Closes your room. Changes are saved even after leaving the room.
    ● ***/roomunlock*** - Opens your room. Changes are saved even after leaving the room.

    **Activity**
    ● ***/top*** [_number_] - Shows the top active members of the server.
    ● ***/setmyreferal*** [_@user_] - Make the _@user_ your referral, he will receive 20% of your activity points. Make your referral only the person who invited you to the server. You can use this command _only once!_
    ● ***/myactive*** - Shows the number of activity points, sent messages and minutes in voice chat.

    ! For one message you get **${data.pointPerMsg}** activity point, for one minute in voice chat you get **${data.pointPerMinute}** activity points.
    `)
    .addFields(
        { name: '**Interaction**', value: `
        ● ***/hug*** [_@user_]
        ● ***/hit*** [_@user_]
        ● ***/kiss*** [_@user_]
        ● ***/pat*** [_@user_]
        ● ***/bite*** [_@user_]
        ● ***/slap*** [_@user_]
        ● ***/cry***
        `, inline: true },
        { name: '**ADMIN**', value: `
        ● ***/settings***
        ● ***/settingsreview***
        ● ***/addshoprole***
        ● ***/delshoprole***
        `, inline: true },
    )
    .setTimestamp()
    .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL() });
    interaction.reply({  embeds: [Embed], ephemeral: true })

    }, {onlyOnce: true}) 
}