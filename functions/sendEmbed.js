import DiscordJS, { ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField  } from 'discord.js'
import {db} from "../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from './log.js'

export default async function sendEmnbed({thumbnail, guildId, color, russianFields, englishFields, russianTitle, englishTitle, russianDescription, englishDescription, author, timestamp, footer, feedback }) {
        onValue(ref(db, `guilds/${guildId}/settings/language`), (snapshot) => {
            let Embed = new EmbedBuilder()
            if (snapshot.val()) {
                switch (snapshot.val()) {
                    case 'English':
                        Embed
                        .setColor(color === 'blue' ? 0x3a60b5 : 0xbd3c3c)
                        .setThumbnail(thumbnail)
                        .setTitle(englishTitle)
                        .setDescription(englishDescription)
                        .setAuthor(author)
                        .setTimestamp(timestamp)
                        .setFooter(footer)
                        .addFields(englishFields)
                        break;

                    case 'Russian': 
                        Embed
                        .setColor(color === 'blue' ? 0x3a60b5 : 0xbd3c3c)
                        .setThumbnail(thumbnail)
                        .setTitle(russianTitle)
                        .setDescription(russianDescription)
                        .setAuthor(author)
                        .setTimestamp(timestamp)
                        .setFooter(footer)
                        .addFields(russianFields)
                        break;
                }


                switch (feedback.type) {
                    case 'reply':
                        feedback.path.reply({ embeds: [Embed], ephemeral: feedback.ephemeral })
                        break;
                    case 'send':
                        // feedback.path.send({ embeds: [Embed], ephemeral: feedback.ephemeral })
                        feedback.add.client.guilds.cache.get(feedback.add.guildId).members.fetch(feedback.add.memId).then((user) => user.send({ embeds: [Embed] }).catch((error) => {console.error(error)}))
                }
            }
        }, {onlyOnce: true}) 
    // client.users.cache.get(userId).send({ embeds: [Embed] }).catch((error) => {console.error(error)})
}