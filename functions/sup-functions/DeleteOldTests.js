import DiscordJS, {EmbedBuilder} from 'discord.js'
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"
import {db} from "./../../firebase.js"

const Hour_for_notify = 19

export default async function DeleteOldTests(client) {
    onValue(ref(db, "database"), (snapshot) => { 

        const data = snapshot.val()

        //new

            for (let y = 0; y < Object.keys(data).length; y++) {

                let testData = Object.entries(data)[y][1]

                if(parseInt(testData['test-date'].split('.')[0]) < new Date().getDate()  ) {
                    remove(ref(db, `database/${testData['test-id']}`))
                }
            }
    
        
    }, {onlyOnce: true})
}