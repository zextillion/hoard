import { Provider } from "react-redux";
import App from "./App";
import store from "./redux/store";

export default function AppWrapper() {
    return (
      <Provider store={store}>
        <App />
      </Provider>
    );
  }