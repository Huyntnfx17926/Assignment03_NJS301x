import { BrowserRouter, Route, Switch } from "react-router-dom";
import Chat from "./Chat/Chat";
import Header from "./Header/Header";
import History from "./History/History";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import Products from "./Products/Products";
import Users from "./Users/Users";
import Login from "./Login/Login";
import NewProduct from "./New/NewProduct";
import { AuthContextProvider } from "./Context/AuthContext";

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <BrowserRouter>
          <div
            id="main-wrapper"
            data-theme="light"
            data-layout="vertical"
            data-navbarbg="skin6"
            data-sidebartype="full"
            data-sidebar-position="fixed"
            data-header-position="fixed"
            data-boxed-layout="full"
          >
            <Header />

            <Menu />

            <Switch>
              <Route exact path="/" component={Home} />
              <Route path="/chat" component={Chat} />
              <Route path="/users" component={Users} />
              <Route path="/products" component={Products} />
              <Route path="/history" component={History} />
              <Route path="/login" component={Login} />
              <Route path="/new" component={NewProduct} />
            </Switch>
          </div>
        </BrowserRouter>
      </AuthContextProvider>
    </div>
  );
}

export default App;
