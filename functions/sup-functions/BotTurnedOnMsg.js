import DiscordJS, {EmbedBuilder} from 'discord.js'


export default async function SlashHelp(client)  {
    let Embed = new EmbedBuilder()
    .setTitle('Time is over turned on!')
    .setThumbnail(client.user.avatarURL())
    .setAuthor({name: `${client.user.username} ▪ Turn on`, iconURL: client.user.avatarURL(), url: 'https://discord.gg/rEeW7Rs92q'})
    .setTimestamp()

    if(client.user.id === '1002151461892927510')
    client.users.fetch('538343406326513704').then((user) => {user.send({ embeds: [Embed] })})
}