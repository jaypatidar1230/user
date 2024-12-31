import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserData from "./components/UserData";
// import { AddUser } from "./components/AddUser";
import { ThemeProvider } from "@material-tailwind/react";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<UserData />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
