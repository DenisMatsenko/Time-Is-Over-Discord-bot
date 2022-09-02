import DiscordJS, { ActionRowBuilder, ButtonBuilder, ButtonStyle, ActivityFlags, SlashCommandBuilder,  GatewayIntentBits, EmbedBuilder, PermissionsBitField, cleanCodeBlockContent } from 'discord.js'
import {db} from "./../../firebase.js"
import {set, ref, onValue, remove, update} from "firebase/database"
import Log from '../log.js'
import sendEmnbed from '../sendEmbed.js'

export default async function SlashShop(interaction, options, client)  {
    Log(interaction.guild, interaction.user, 'Slash shop')
    // interaction.deferReply()

    let path = `guilds/${interaction.guildId}/shop`
    onValue(ref(db, path), async (snapshot) => {
        let data = snapshot.val()
        let isLast = false
        if(data !== null) {
            let strOfItems = ''
            for (let i = 0; i < 5; i++) {
                if(data[i]) {
                    strOfItems += `**${i+1}**. <@&${data[i].split('.')[0]}>
                    **Time** - **${data[i].split('.')[1]}**  day/s
                    **Price** - **${data[i].split('.')[2]}**  coins\n\n`
                    if(i === data.length-1) {
                        isLast = true
                    }
                } else {
                    isLast = true
                    strOfItems += '-\n'
                }
            }

            let Embed = new EmbedBuilder()
            .setColor(0x3a60b5)
            .setTitle(`Page 1`)
            .setDescription(strOfItems)
            .setTimestamp()
            .setFooter({ text: `Time is over`, iconURL: client.user.displayAvatarURL() });
        
            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('btnBack')
                    .setLabel('<')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('btnNext')
                    .setLabel('>')
                    .setDisabled(isLast ? true : false)
                    .setStyle(ButtonStyle.Secondary),
            )
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('x')
                    .setStyle(ButtonStyle.Secondary),
            )
            interaction.reply({ embeds: [Embed], components: [row] }).then(() => {
                let lmsg = interaction.channel.lastMessage
                if(lmsg.author.bot) {
                    setTimeout(async () => {
                    lmsg.delete().catch(error => {})
                }, 45000)
                }
            })
           
            
            
            // console.log("msg: ",  msg)







            // interaction.channel.send({ embeds: [Embed], components: [row] }).then(msg => {
            //     setTimeout(async () => {
            //         let messageedit = await interaction.channel.messages.fetch(msg.id).catch((error) => {console.log("error: ",  error)})
            //         if(messageedit) {msg.delete()}
            //     }, 90000)
            // })



        }
        else {
            sendEmnbed({
                color: 'red',
                thumbnail: null,
        
                russianTitle: `Магазин пустой сейчас :[`,
                russianDescription: null,
                russianFields: [],
        
                englishTitle: `Shop is empty now :[`,
                englishDescription: null,
                englishFields: [],
        
                author: null,                            
                // timestamp: 'true',
                footer: { text: `Time is over`, iconURL: client.user.displayAvatarURL() },
        
                guildId: interaction.guildId,
                feedback: {
                  type: 'reply',
                  path: interaction,
                  ephemeral: false,
                },
            }) 
        }
    }, {onlyOnce: true})




    // let newEmbed = new EmbedBuilder()
    // .setColor(0x3a60b5)
    // // .setAuthor({ name: `${interaction.user.username} ▪ crime`, iconURL: interaction.user.avatarURL(), url: 'https://discord.js.' })
    // .setTitle(`page 2`)
    // .setDescription(`des`)
    // .setTimestamp()
    // .setFooter({ text: `Time is over`, iconURL: client.users.cache.get('1002151461892927510').avatarURL()

    // });

    // setTimeout(() => {reply.edit({embeds: [newEmbed]})}, 3000)
}