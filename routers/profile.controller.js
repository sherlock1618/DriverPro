const cookieParser = require("cookie-parser");
const {
    // getProfilesDev,
    getProfile,
    createProfile,
    updateProfile,
    removeProfile,
    isExist,
    login
} = require("../models/profile.model");

// async function HTTPGetProfilesDev(req, res){
//     const profiles = await getProfilesDev();
//     return res.status(200).json(profiles);
// }

async function HTTPGetProfile(req, res){
    const id = Number(req.params.id);
    const profile = await getProfile(id);

    if(!profile){
        return res.status(404).json({
            error: "profile not found!",
        });
    }

    return res.status(200).json(profile);
}

async function HTTPCreateProfile(req, res){
    const attrs = req.body;
    
    try{
        const newProfile = await createProfile(attrs);
        return res.status(201).json(newProfile);
    }
    catch(err){
        console.error(err);
        return res.status(400).json({
            error: "profile creation failed!",
        });
    }    
}

async function HTTPRemoveProfile(req, res){
    const id = Number(req.params.id);
    const profile = await isExist(id);

    if(!profile){
        return res.status(404).json({
            error: "profile not found!",
        });
    }

    try{
        const removedProfile = await removeProfile(req.params.id);
        return res.status(200).json(removedProfile);
    }catch(err){
        res.status(400).json({
            error: "profile remove failed!",
        });
    }
}

async function HTTPUpdateAccount(req, res){
    const attrs = req.body;

    const foundProfile = await isExist(Number(attrs.id));

    if(!foundProfile){
        return res.status(404).json({
            error: "profile not found!"
        });
    }

    if(attrs.role){
        return res.status(400).json({
            error: "cannot update role!",
        });
    }

    try{
        const updatedProfile = await updateProfile(attrs);
        return res.status(200).json(updatedProfile);
    }
    catch(err){
        console.error(err);
        return res.status(400).json({
            error: "profile update failed!",
        });
    }    
}

async function HTTPLogin(req, res){
    const { phone, password } = req.body;
    try{
        const result = await login(phone, password);
        
        res.cookie('token', result.token, {
            httpOnly: true, // Makes it accessible only by the server
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (https)
            maxAge: 24 * 60 * 60 * 1000 // Token expiry time, 1 day here
        });

        return res.status(200).json(result);
    }
    catch(err){
        console.error(err);
        res.status(401).json({
            error: "authentication failed",
        });
    }
}

async function HTTPLogout(req, res){
    try{
        const id = req.params.id;
        const foundProfile = await isExist(id);
        if(!foundProfile){
            return res.status(404).json({
                error: "trying to logout profile with wrong id!",
            });
        }
        
        await res.clearCookie('token', {
            httpOnly: true, // Ensure the cookie is httpOnly for security
            secure: true,   // Enable this if using HTTPS
            sameSite: 'Strict', // Recommended for cross-site request protection
        });

        return res.status(200).json({
            message: "Logout successful!",
        });
    }
    catch(err){
        return res.status(404).json({
            error: "profile not found!",
        });
    }
}

module.exports = {
    // HTTPGetProfilesDev,
    HTTPGetProfile,
    HTTPCreateProfile,
    HTTPRemoveProfile,
    HTTPUpdateAccount,
    HTTPLogin,
    HTTPLogout
}