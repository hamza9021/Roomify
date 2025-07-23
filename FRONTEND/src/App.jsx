import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
    Home,
    Register,
    Login,
    Logout,
    UpdateUser,
    CreateListing,
    ListingDetail,
    Messages,
    MyListing,
    UpdateListing,
    MyTrip,
} from "./Components";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
    const GoogleAuthWrapper = () => {
        return (
            <GoogleOAuthProvider clientId="832018393066-he1p2hdcl15u4mn4ndqa83dsgt3ehgig.apps.googleusercontent.com">
                <Login> </Login>
            </GoogleOAuthProvider>
        );
    };
        return (
            <>
                <Toaster position="bottom-right" reverseOrder={false} />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<GoogleAuthWrapper />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/u/update" element={<UpdateUser />} />
                        <Route
                            path="/create/listing"
                            element={<CreateListing />}
                        />
                        <Route
                            path="/listing/:id"
                            element={<ListingDetail />}
                        />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/host/listings" element={<MyListing />} />
                        <Route
                            path="/update-listing/:id"
                            element={<UpdateListing />}
                        />
                        <Route path="/search" element={<Home />} />
                        <Route path="/trips" element={<MyTrip />} />
                    </Routes>
                </BrowserRouter>
            </>
        );
};

export default App;
