import './App.scss';
import Contact  from './contact/Contact';
import DApp from './dapp/Dapp';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>César Calle Dapp Wayru </h1>
      </header>
      <DApp></DApp>
      <Contact></Contact>
    </div>
  );
}

export default App;
