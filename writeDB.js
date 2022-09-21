import * as fs from 'fs';
import {db} from "./firebase.js"
import {set, ref, onValue, remove, update, increment, forceWebSockets} from "firebase/database"

export default async function WriteDB(database) {
    update(ref(db), {database: database})    
    fs.writeFileSync('database.json', JSON.stringify(database));

}