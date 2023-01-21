import { logIn, logOut } from "../redux/auth"
import {
    Auth, GoogleAuthProvider, signInWithPopup
} from 'firebase/auth';
import { useAppDispatch, useAppSelector } from "../redux/hooks";

export default function NavBar(props: {auth: Auth}) {
    const dispatch = useAppDispatch()

    function signInWithGoogle() {
        const provider = new GoogleAuthProvider()
        signInWithPopup(props.auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential ? credential.accessToken : "";
                // The signed-in user info.
                const user = result.user;
                // ...
                dispatch(logIn({ user:user, token: token as string }))
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                console.log(`${errorMessage}`)
            });
    }

    function signOut() {
        props.auth.signOut()
            .then(result =>
                dispatch(logOut())
            ).catch(error => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(`${errorMessage}`)
            })
    }

    const token = useAppSelector(state => state.authState.token)
    const signInOrOutElement = <div>
        { token === "" ? 
            <button type="button" onClick={signInWithGoogle}>Sign In With Google</button> 
            : <button type="button" onClick={signOut}>Sign Out</button>
        }
    </div>

    return (
        <form className="SignInScreen">
            { signInOrOutElement }
        </form>
    )
}