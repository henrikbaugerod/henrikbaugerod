import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./screens/HomePage";


const Navigation = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />

            </Routes>
        </BrowserRouter>
    )
}

export default Navigation;