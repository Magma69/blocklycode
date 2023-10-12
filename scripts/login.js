let key = 'somestupidcrapidek'


async function submit(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add("loading");
    try {
        let username = document.getElementById("usernameInput");
        let password = document.getElementById("passwordInput");
        if (!username.value) {
            username.classList.add("invalid");
            document.getElementById("usernameError").innerHTML = "Required Field";
        };
        if (!password.value) {
            password.classList.add("invalid");
            document.getElementById("passwordError").innerHTML = "Required Field";
        };
        

        if (document.getElementsByClassName("invalid")?.length < 1) {
            let request = await requests.send("users/login", username.value.includes("@") ? {
                email: username.value,
                password: password.value,
                captcha_token: key,
                ua: navigator.userAgent,
                platform: navigator.platform,
            } : {
                username: username.value,
                password: password.value,
                captcha_token: key,
                ua: navigator.userAgent,
                platform: navigator.platform,
            });
            if (request?.status == 403 && request?.data == "Invalid Captcha Token") {
                document.getElementById("captchaError").classList.add("invalid");
                captchaReset();
            } else if (request?.status == 404) {
                username.classList.add("invalid");
                document.getElementById("usernameError").innerHTML = "Unkown User";
            } else if (request?.status == 403) {
                password.classList.add("invalid");
                document.getElementById("passwordError").innerHTML = "Incorrect Password";
            } else if (request?.status == 200) {
                if (request?.data?.isBanned) {
                    return accounts.displayBan(request?.data);
                } else {
                    popups.open("s", "Weclome Back")
                    let d = new Date()
                    d.setDate(d.getDate() + 7);
                    document.cookie = `token_active=${request?.data?.session?.token}; domain=blocklycode.org; expires=${new Date(d)}; path=/; sameSite=Lax;`;
                    document.cookie = `token_${accounts?.tokens?.length ?? 0}=${request?.data?.session?.token}; domain=blocklycode.org; expires=${new Date(d)}; path=/; sameSite=Lax;`;
                    if (request?.data?.isDisabled) {
                        document.cookie = `token_active_disabled=true; domain=blocklycode.org; expires=${new Date(d)}; path=/; sameSite=Lax;`;    
                        document.cookie = `token_${accounts?.tokens?.length ?? 0}_disabled=true; domain=blocklycode.org; expires=${new Date(d)}; path=/; sameSite=Lax;`;    
                        document.location = "/enable";
                    } else if (!request?.data?.session?.authorized) {
                        document.cookie = `token_active_needs_two_factor=true; domain=blocklycode.org; expires=${new Date(d)}; path=/; sameSite=Lax;`;    
                        document.cookie = `token_${accounts?.tokens?.length ?? 0}_needs_two_factor=true; domain=blocklycode.org; expires=${new Date(d)}; path=/; sameSite=Lax;`;    
                        document.location = "/two-factor";
                    } else {
                        if (document.cookie.split(";").find(x => x.includes("return_to="))) {
                            document.location = document.cookie.split(";").find(x => x.includes("return_to=")).split("=")[1];
                            document.cookie = `return_to=; domain=blocklycode.org; expires=${new Date()}; path=/; sameSite=Lax;`;
                        } else if (document.referrer && document.referrer.endsWith("blocklycode.org/")){
                            document.location = document.referrer;
                        } else {
                            document.location = 'https://blocklycode.org/projects';
                        };
                    };
                };
            } else {
                popups.open("e", "Request failed");
                console.log(request);
            };
        };
    } catch (e) {
        console.log(e);
        popups.open("e", "Unexpected error occurred");
    };
    btn.classList.remove("loading");
};