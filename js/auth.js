import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-app.js'
import {firebaseConfig} from "./firebase-config.js";
import {
    getAuth, createUserWithEmailAndPassword,
    signInWithEmailAndPassword, sendEmailVerification, updateProfile
}
    from 'https://www.gstatic.com/firebasejs/9.13.0/firebase-auth.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
var user;
console.log("Auth.js :" + document.title);

function getData(elements) {
    const obj = {};
    elements.forEach((e) => obj[e.name] = e.value);
    return obj;
}

const setError = (element) => element.style.borderColor = "red";


function validation(elements) {
    let c = null;
    elements.forEach((e) => {
        const reg =  /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
        switch (e.name) {
            case "email" :
                if (e.value === "" || !reg.test(e.value)) setError(c = e);
                break;
            case "cEmail" :
                if (e.value === "" || e.value !== elements.at(0).value) setError(c = e);
                break;
            case "userName" :
                if (e.value === "") setError(c = e);
                break;
            case "password" :
                if (e.value.length < 8) setError(c = e);
                break;
            case "DOB" :
                if (e.value === "") setError(c = e);
                break;
        }
    });
    if (c == null) return getData(elements);
    else return null;

}

/* Signup Using Firebase Email Verification & MySql */
if (document.title === "Signup - Spotify") {
    console.log("Working");
    document.querySelector(".btnDiv>.btn").onclick =
        function emailPassword_singUp() {
            const elements = document.querySelectorAll("form>.inputCtnr");
            const ele = [];
            elements.forEach((element) => ele.push(element.getElementsByTagName("input")[0]));
            let inputFieldsData = validation(ele);
            let gen = null;
            document.querySelectorAll('input[name="gender"]').forEach(g => {
                if (g.checked) gen = g.value;
            });
            if (gen == null) {
                setError(document.querySelector(".genderCtnr"));
                return;
            } else inputFieldsData["gender"] = gen;
            if (inputFieldsData != null) {
                createUserWithEmailAndPassword(auth, inputFieldsData.email, inputFieldsData.password)
                    .then((userCredential) => {
                        user = userCredential.user;
                        updateProfile(user, {
                            displayName: inputFieldsData.name, photoURL: ""
                        }).then(() => {

                        }).catch((error) => {
                            const errorCode = error.code;
                            const errorMessage = error.message;
                            console.log(errorCode + "errorCode");
                            console.log(errorMessage + "errorMessage");
                        });
                        sendEmailVerification(user)
                            .then(() => {
                                console.log("Email Sent");
                            });
                        $.post("https://notspotify.000webhostapp.com/Api%27s/signUpUser.php",
                            inputFieldsData,
                            function (data, status) {
                                location.href = "signin.html";
                                console.log(data + " : " + status);
                            });
                    })
                    .catch((error) => {
                        if (error.code === "auth/email-already-in-use") alert("Email Already in use, \nPlease choose another Email");
                        console.log(error.errorCode + " errorCode");
                        console.log(error.code + " errorCode");
                        console.log(error.message + " errorMessage");
                    });
            }
        }
}

/* Login Using Firebase Email Verification & MySql */
if (document.title === "Login - Spotify") {
    console.log("Working");
    document.querySelector(".btnLogin").onclick =
        function emailPassword_singIn() {
            console.log("Sign IN");
            const elements = document.querySelectorAll(".login>.inputCtnr");
            const ele = [];
            elements.forEach((element) => ele.push(element.getElementsByTagName("input")[0]));
            let inputFieldsData = validation(ele);
            console.log(inputFieldsData);
            if (inputFieldsData != null) {
                signInWithEmailAndPassword(auth, inputFieldsData.email, inputFieldsData.password)
                    .then((userCredential) => {
                        if (userCredential.user.emailVerified)
                            $.post("https://notspotify.000webhostapp.com/Api%27s/signInUser.php",
                                inputFieldsData,
                                function (data, status) {
                                    if (data !== "Login Failed") {
                                        sessionStorage.setItem("uid", data);
                                        sessionStorage.setItem("email", inputFieldsData.email);
                                        location.href = "index.html";
                                    } else alert("Login Failed Try Again");
                                });
                        else alert("Please Verify Your Email")
                    })
                    .catch((error) => {
                        if (error.code === "auth/wrong-password") alert("Invalid Email & Password");
                        else alert("Login Failed Try Again");
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorCode + "errorCode");
                        console.log(errorMessage + "errorMessage");
                    });

            }
        }
}
