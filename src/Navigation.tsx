import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./screens/HomePage";
import { FormContainer1, Section1, Form1 } from "./forms/form1/Form1";
import Forms from "./screens/Forms";


const Navigation = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/forms" element={<Forms />} />

                <Route path="/form1" element={<FormContainer1 />}>
                    <Route path=":section" element={<Section1 />}>
                        <Route path=":form" element={<Form1 />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Navigation;