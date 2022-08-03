import "./App.scss";
import Contact from "./contact/Contact";
import DApp from "./dapp/Dapp";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>César Calle Dapp Wayru </h1>
      </header>
      <content>
        <section>
          <DApp></DApp>
        </section>
        <section>
          <Contact></Contact>
        </section>
      </content>
    </div>
  );
}

export default App;
