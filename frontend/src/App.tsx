import './App.css';
import firebase from 'firebase/compat/app';
import Main from './components/Main';
import NavBar from './components/NavBar';
import { Provider } from 'react-redux';
import store from './redux/store';
import { GameCardTest } from './components/GameCard';
import CreateAccount from './components/CreateAccount';


const app = firebase.initializeApp({
  apiKey: "AIzaSyAZLKjGwjrJCH55Ue9b5DTUGzFOnyjLVaE",
  authDomain: "backlog-3bfc9.firebaseapp.com",
  projectId: "backlog-3bfc9",
  storageBucket: "backlog-3bfc9.appspot.com",
  messagingSenderId: "532369751766",
  appId: "1:532369751766:web:732272e7f4dc225eb41377",
  measurementId: "G-GDMKXD8J7F"
})



function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
        </header>
        <Main />
      </div>
    </Provider>
  );
}

export default App;
