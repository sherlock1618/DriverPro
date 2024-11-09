const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { error } = require("console");
const Profile = require("./profile.mongo");
const cookieParser = require("cookie-parser");
require("dotenv").config();


// async function getProfilesDev(){
//     const profilesModel = await Profile.find();
//     return profilesModel;
// }

async function isExist(id){
    return await Profile.findOne({id});
}

//GETPROFILE
async function getProfile(id){
    const profile = await Profile.findOne({id});
    return sanitizePassword(profile);
}

//REGISTER
async function createProfile(profile){
    const latestProfile = await Profile.findOne().sort({ id: -1 }).exec();
    const latestProfileID = latestProfile ? latestProfile.id + 1 : 0;
    
    const { password, ...restAttrs } = profile;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newProfile = new Profile({
        ...restAttrs,
        id: latestProfileID,
        password: hashedPassword,
    });

    await newProfile.save();
    console.log(profile);

    return sanitizePassword(newProfile);
}

//DELETE
async function removeProfile(id){
    const removedProfile = await Profile.findOneAndDelete({id});
    return sanitizePassword(removedProfile);
}

//UPDATE
async function updateProfile(attrs){
    const { id, password, ...updatedAttrs } = attrs;
    //hashing password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : password;
    const newAttrs = {...updatedAttrs, password: hashedPassword}

    const updatedProfile = await Profile.findOneAndUpdate({id}, newAttrs, {new: true});

    return sanitizePassword(updatedProfile);
}

function sanitizePassword(profile){
    if(!profile){
        return null;
    }
    const { password, ...profileWithoutPassword } = profile.toObject();
    return profileWithoutPassword;
}

//LOGIN
async function login(phone, password){
    const profile = await Profile.findOne({phone});

    if(!profile){
        return null;
    }
    console.log(profile);
    const isPasswordValid = await bcrypt.compare(password, profile.password);
    if(isPasswordValid){
        const token = jwt.sign({id: profile.id, role: profile.role}, process.env.JWT_KEY, {expiresIn: '1d'});
        console.log("access granted!");
        return {token, profile: sanitizePassword(profile)};
    }

    return null;

}


module.exports = {
    // getProfilesDev,
    getProfile,
    createProfile,
    updateProfile,
    removeProfile,
    isExist,
    login
}