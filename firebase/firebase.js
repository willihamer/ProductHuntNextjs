import app from 'firebase/app';
import firebaseConfig from './config';
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage';

class Firebase {
    constructor() {
        if (!app.apps.length) {
            app.initializeApp(firebaseConfig);
        }
        this.auth = app.auth();
        this.db = app.firestore();
        this.storage = app.storage();
    }

    // register an user
    async register(name, email, password) {
        const newUser = await this.auth.createUserWithEmailAndPassword(email, password);

        return await newUser.user.updateProfile({
            displayName: name
        });
    }

    async login(email, password) {
        return this.auth.signInWithEmailAndPassword(email, password);
    }

    async signOut() {
        return this.auth.signOut();
    }
}

const firebase = new Firebase();
export default firebase;