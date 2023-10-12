let details, user, security_password;

window.addEventListener("load", () => {
    document.getElementById("nav_" + (location.hash.split("#")[1] ?? "account")).classList.add("active");
});
window.addEventListener("hashchange", () => {
    for (let x of document.getElementsByClassName("sidebar-item")) x.classList.remove("active");
    document.getElementById("nav_" + (location.hash.split("#")[1] ?? "account")).classList.add("active");
});
window.addEventListener("scroll", () => {
    for (let x of document.getElementsByClassName("sidebar-item")) x.classList.remove("active");
    for (let x of document.getElementsByClassName("section-wrapper")) {
        let area = x.getBoundingClientRect();
        if (area.bottom > 0) {
            document.getElementById(`nav_${x.previousElementSibling.id}`).classList.add("active");	
            break;
        };
    };
});

async function onPageLoaded(u) {
    try {
        user = u;
        if (user) {
            if (user.username == "blocklysystemerror") document.location = "/";
            document.getElementById("nav_username").innerHTML = user.username;
            document.getElementById("nav_profile").href = `/u/${user.username}`;
            if (user?.isBrandAccount) {
                document.getElementById("accountPassword").readOnly = true;
                document.getElementById("accountEmailUpdate").remove();
                Array.from(document.getElementsByClassName("save-wrapper")).forEach(x => x.remove());
            } 
            if (user?.isOwner || user?.isBrandAccount) {
                document.getElementById("nav_disable_account").remove();
                document.getElementById("nav_delete_account").remove();
            }
            loadAccount();
            loadNotifications();
            loadSessions();
            loadAppearance();
            loadAccessibility();
            loadPrivacy();
            loadRelations();
            loadExperiments();
            document.getElementsByClassName("content-wrapper")[0].style.display = "block";
        } else {
            document.location = "https://auth.blocklycode.org/login";
        }
    } catch(e) {
        console.log(e);
        document.getElementById("error").innerHTML = "Failed to load Account<br>Unexpected Error Occurred";
    }
    document.getElementById("contentLoader").style.display = "none";
};
async function loadAccount() {
    document.getElementById("accountUsernamePreview").innerHTML = user.username;
    document.getElementById("accountEmailPreview").innerHTML = user.email;
    if (user?.phone && user?.phone_verified) {
        document.getElementById("accountPhonePreview").innerHTML = `${user?.phone.substring(0, 3)} ${user?.phone.substring(3, 6)} ${user?.phone.substring(6, 10)} ${user?.phone.substring(10)}`;
    } else {
        document.getElementById("accountPhonePreview").innerHTML = "No Verified Phone Number";
    }

    if (user?.isBrandAccount) {
        document.getElementById("accountEmailExpandBrand").style.display = null;
    } else if (!user?.email_verified && !user?.email_verify_email) {
        document.getElementById("accountEmailExpandUnverified").style.display = null;
    } else {
        if (user?.email_verify_email) {
            document.getElementById("accountEmailExpandVerify").style.display = null;
            document.getElementById("accountEmailExpandVerifyPreview").innerHTML = user?.email_verify_email;
        } else {
            document.getElementById("accountEmailExpandUpdate").style.display = null;
        }
    }

    
    if (user?.isBrandAccount) {
        document.getElementById("accountPhoneExpandBrand").style.display = null;
    } else if (!user?.phone) {
        document.getElementById("accountPhoneExpandUpdate").style.display = null;
    } else if (!user?.phone_verified || user?.phone_verify_phone) {
        document.getElementById("accountPhoneExpandVerify").style.display = null;
        let number = user?.phone_verify_phone ?? user?.phone;
        document.getElementById("accountPhoneExpandVerifyPreview").innerHTML = `${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6, 10)} ${number.substring(10)}`;
    } else {
        document.getElementById("accountPhoneExpandUpdate").style.display = null;
        if (user?.phone_verify_phone) {
            document.getElementById("accountPhoneExpandUpdateInput").value = user?.phone_verify_phone;
        }
    }

    let codes = await fetch("country_codes.json").then(x => x.json());
    document.getElementById("accountPhoneExpandUpdateList").innerHTML = codes.map(x => `<button class="dropdown-item" onclick="setPhoneCountry(this)" data-code="${x.code.split("+")[1]}" data-dropdown="valid-search">
        <p class="account-expand-update-phone-country-name">${x.name}</p>
        <p class="account-expand-update-phone-country-code">${x.code}</p>
    </button>`).join("");
    if (!user.enabled_experiments.includes("707223816695398400")) {
        document.getElementById("accountPhone").remove();
        document.getElementById("accountPhoneLabel").remove();
    };
};
function loadNotifications() {
    document.getElementById("notificationsAccountProfileUpdateEmail").checked = user.email_update_profile ?? true;
    document.getElementById("notificationsAccountAccountUpdateEmail").checked = user.email_update_account ?? true;
    document.getElementById("notificationsAccountLoginEmail").checked = user.email_account_login ?? true;
    document.getElementById("notificationsAccountApplicationUpdateEmail").checked = user.email_application_status ?? true;
    document.getElementById("notificationsFriendsIncomingRequestEmail").checked = user.email_friend_req_receive ?? true;
    document.getElementById("notificationsFriendsAcceptedRequestEmail").checked = user.email_friend_req_accepted ?? true;
    document.getElementById("notificationsFriendsDeniedRequestEmail").checked = user.email_friend_req_denied ?? true;
    document.getElementById("notificationsFeedbackCommentsEmail").checked = user.email_feedback_comments ?? true;
    document.getElementById("notificationsFeedbackUpvotesEmail").checked = user.email_feedback_upvotes ?? true;
    document.getElementById("notificationsFeedbackDownvotesEmail").checked = user.email_feedback_downvotes ?? true;
    document.getElementById("notificationsProjectsSharedEmail").checked = user.email_project_shared ?? true;
    document.getElementById("notificationsProjectsActivityEmail").checked = user.email_project_activity ?? true;
    document.getElementById("notificationsTemplatesReviewsEmail").checked = user.email_template_reviewed ?? true;
    document.getElementById("notificationsTemplatesIssuesEmail").checked = user.email_template_issues ?? true;
    document.getElementById("notificationsDevelopersTeamsInviteEmail").checked = user.email_developer_team_invites ?? true;
    document.getElementById("notificationsDevelopersTeamsUpdateEmail").checked = user.email_developer_team_updates ?? true;
    document.getElementById("notificationsDevelopersTeamsOwnerEmail").checked = user.email_developer_team_owner ?? true;
    document.getElementById("notificationsDevelopersBlockletsInviteEmail").checked = user.email_developer_blocklet_invites ?? true;
    document.getElementById("notificationsDevelopersBlockletsUpdateEmail").checked = user.email_developer_blocklet_updates ?? true;
    document.getElementById("notificationsOtherNewsletterEmail").checked = user.email_newsletter ?? true;
    document.getElementById("notificationsOtherBlocklyUpdateEmail").checked = user.email_update_blockly ?? true;
    document.getElementById("notificationsOtherInactiveEmail").checked = user.email_inactive ?? true;

    document.getElementById("notificationsAccountProfileUpdateInApp").checked = user.notifications_update_profile ?? true;
    document.getElementById("notificationsAccountAccountUpdateInApp").checked = user.notifications_update_account ?? true;
    document.getElementById("notificationsAccountLoginInApp").checked = user.notifications_account_login ?? true;
    document.getElementById("notificationsAccountApplicationUpdateInApp").checked = user.notifications_application_status ?? true;
    document.getElementById("notificationsFriendsIncomingRequestInApp").checked = user.notifications_friend_req_receive ?? true;
    document.getElementById("notificationsFriendsAcceptedRequestInApp").checked = user.notifications_friend_req_accepted ?? true;
    document.getElementById("notificationsFriendsDeniedRequestInApp").checked = user.notifications_friend_req_denied ?? true;
    document.getElementById("notificationsFeedbackCommentsInApp").checked = user.notifications_feedback_comments ?? true;
    document.getElementById("notificationsFeedbackUpvotesInApp").checked = user.notifications_feedback_upvotes ?? true;
    document.getElementById("notificationsFeedbackDownvotesInApp").checked = user.notifications_feedback_downvotes ?? true;
    document.getElementById("notificationsProjectsSharedInApp").checked = user.notifications_project_shared ?? true;
    document.getElementById("notificationsProjectsActivityInApp").checked = user.notifications_project_activity ?? true;
    document.getElementById("notificationsTemplatesReviewsInApp").checked = user.notifications_template_reviewed ?? true;
    document.getElementById("notificationsTemplatesIssuesInApp").checked = user.notifications_template_issues ?? true;
    document.getElementById("notificationsDevelopersTeamsInviteInApp").checked = user.notifications_developer_team_invites ?? true;
    document.getElementById("notificationsDevelopersTeamsUpdateInApp").checked = user.notifications_developer_team_updates ?? true;
    document.getElementById("notificationsDevelopersTeamsOwnerInApp").checked = user.notifications_developer_team_owner ?? true;
    document.getElementById("notificationsDevelopersBlockletsInviteInApp").checked = user.notifications_developer_blocklet_invites ?? true;
    document.getElementById("notificationsDevelopersBlockletsUpdateInApp").checked = user.notifications_developer_blocklet_updates ?? true;
    document.getElementById("notificationsOtherBlocklyUpdateInApp").checked = user.notifications_update_blockly ?? true;
};
async function loadSecurity() {
    document.getElementById("securityMfaAppEnabled").checked = user.mfa_app_enabled;
    document.getElementById("securityMfaSmsEnabled").checked = user.mfa_sms_enabled;

    if (!user?.phone_verified) {
        document.getElementById("securityMfaSmsEnabled").parentElement.style.display = "none";
        document.getElementById("securityMfaSmsEnabled").disabled = true;
        document.getElementById("securityMfaSmsEnabled").parentElement.nextElementSibling.classList.add("push-right");
        document.getElementById("securityMfaSmsNoPhone").style.display = null;
        document.getElementById("securityMfaSmsPhone").style.display = "none";
    } else {
        document.getElementById("securityMfaSmsPhonePreview").innerHTML = `${user?.phone.substring(0, 3)} ${user?.phone.substring(3, 6)} ${user?.phone.substring(6, 10)} ${user?.phone.substring(10)}`;
    }
    
    document.getElementById("securityMfaAppAdditional").disabled = !user.mfa_app_enabled;
    document.getElementById("securityMfaSmsExample").disabled = !user.mfa_sms_enabled;

    if (!user.enabled_experiments.includes("707223816695398400")) {
        document.getElementById("securityMfaSms").remove();
    };

    let request = await requests.send("users/mfa/backupcodes/retrieve", {
        password: security_password
    });
    if (request.status == 401 || request.data == "Invalid Token") {
        document.location = "https://auth.blocklycode.org/login";
    } else if (request.status == 403) {
        security_password = null;
        document.getElementById("securityContent").style.display = "none";
        document.getElementById("securityVerify").style.display = "block";
        let error = document.getElementById("securityVerifyError");
        error.innerHTML = "";
        error.style.color = null;
    } else if (request.status == 200) {
        if (!request.data?.mfa_app_enabled && !request.data?.mfa_sms_enabled) {
            document.getElementById("securityMfaBackupActions").style.display = "none";
            document.getElementById("securityMfaBackupDisabled").style.display = "block";
        } else if (request.data?.mfa_backup_codes?.length) {
            document.getElementById("securityMfaBackupCodes").innerHTML = request.data.mfa_backup_codes.map(x => `${x.used ? "<s>" : ""}<code>${x.code}</code>${x.used ? "</s>" : ""}`).join("");
            
            let codes = request.data.mfa_backup_codes;
            let content = `BACKUP CODES FOR ${request.data.username}'s BLOCKLY CODE ACCOUNT
Keep these codes somewhere safe!

1. ${codes[0].code} ${codes[0].used ? "(X)" : "   "}        7. ${codes[6].code} ${codes[6].used ? "(X)" : "   "}
2. ${codes[1].code} ${codes[1].used ? "(X)" : "   "}        8. ${codes[7].code} ${codes[7].used ? "(X)" : "   "}
3. ${codes[2].code} ${codes[2].used ? "(X)" : "   "}        9. ${codes[8].code} ${codes[8].used ? "(X)" : "   "}
4. ${codes[3].code} ${codes[3].used ? "(X)" : "   "}       10. ${codes[9].code} ${codes[9].used ? "(X)" : "   "}
5. ${codes[4].code} ${codes[4].used ? "(X)" : "   "}       11. ${codes[10].code} ${codes[10].used ? "(X)" : "   "}
6. ${codes[5].code} ${codes[5].used ? "(X)" : "   "}       12. ${codes[11].code} ${codes[11].used ? "(X)" : "   "}

Each backup code can be only be used once.
To generate more, vist https://blocklycode.org/account#security

These codes were downloaded on ${new Date().toLocaleDateString()}`;
            document.getElementById("securityMfaBackupDownload").href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
        } else {
            document.getElementById("securityMfaBackupCodes").innerHTML = `<p>You haven't generated any backup codes</p>`;
        }
    } else {
        document.getElementById("securityMfaBackupCodes").innerHTML = `<p>Failed to load backup codes</p>`;
        console.log(request);
    }
};
function loadSessions() {
    let user_token;
    for (let x of document.cookie.split(';')) {
        if (x.includes('token=')) {
            user_token = x.split('=')[1];
            break;
        }
    }

    document.getElementById("sessionListTable").innerHTML = user.sessions.filter(x => x.active).map(x => `<div class="row ${x.token == user_token ? "active" : ""} | flex gap-100 v-center">
        <img src="https://assets.blocklycode.org/${x.device ?? "desktop"}.png" alt="" class="row-icon" style="border-radius: 0;">
        <div class="row-text">
            <p class="row-title">${x.name ?? `${x?.browser} on ${x?.os}`}</p>
            <p class="row-subtitle">${x.location ? `${x.location?.city}, ${x.location?.region}, ${x.location?.country_name} • ` : ""}${formatSessionDate(new Date(x.created_at ?? x.date))} • ${x.ip}</p>
        </div>
        <div class="row-actions | push-right">
            <button class="row-action btn" onclick="revokeSession('${x.id}', this)" title="Revoke Session">
                <div class="loader"></div>
                <span><i class="bx bx-window-close"></i></span>
            </button>
            <a class="row-action" href="/account/sessions/${x.id}" title="View Details & History"><i class="bx bxs-dashboard"></i></a>
        </div>
    </div>`).join("");

    function formatSessionDate(date) {
        let options = {}, now = new Date(), is_today = false;
        if (date.getDate() == now.getDate() && date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear()) {
            options = {hour: "numeric", minute: "numeric"};
            is_today = true;
        } else if (date.getFullYear() == now.getFullYear()) {
            options = {month: "short", day: "numeric"};
        }
        return `${new Intl.DateTimeFormat(navigator.language, options).format(date)}`;
    }
};
function loadAppearance() {
    if (user?.website_theme == "contrast") {
        document.getElementById("appearanceThemeWebsiteContrast").checked = true;
    } else if (user?.website_theme == 'light') {
        document.getElementById("appearanceThemeWebsiteLight").checked = true;
    } else if (user?.website_theme == 'dark') {
        document.getElementById("appearanceThemeWebsiteDark").checked = true;
    } else if (user?.website_theme == 'amoled') {
        document.getElementById("appearanceThemeWebsiteAmoled").checked = true;
    } else if (user?.website_theme == 'classic') {
        document.getElementById("appearanceThemeWebsiteClassic").checked = true;
    } else {
        document.getElementById("appearanceThemeWebsiteSync").checked = true;
    }
    if (user?.lab_theme == "contrast") {
        document.getElementById("appearanceThemeLabContrast").checked = true;
    } else if (user?.lab_theme == 'light') {
        document.getElementById("appearanceThemeLabLight").checked = true
    } else if (user?.lab_theme == 'dark') {
        document.getElementById("appearanceThemeLabDark").checked = true;
    } else if (user?.lab_theme == 'amoled') {
        document.getElementById("appearanceThemeLabAmoled").checked = true;
    } else if (user?.lab_theme == 'classic') {
        document.getElementById("appearanceThemeLabClassic").checked = true;
    } else {
        document.getElementById("appearanceThemeLabSync").checked = true;
    }
    if (document.getElementById(`appearanceThemeAccent${user?.accent_theme}`)) {
        document.getElementById(`appearanceThemeAccent${user?.accent_theme}`).checked = true;
    } else {
        document.getElementById("appearanceThemeAccentNone").checked = true;
    }
    if (user?.lab_controls == 'commands') {
        document.getElementById("appearanceControlsLabCommands").checked = true;
    } else {
        document.getElementById("appearanceControlsLabButtons").checked = true;
    }
    previewThemeWebsite(user?.website_theme ?? "sync");
    previewThemeAccent(user?.accent_theme ?? "none");
};
function loadAccessibility() {
    if (user?.text_scale) {
        let scale = (user?.text_scale * 62.5) + 37.5;
        document.getElementById("accessibilityTextScalePreview").innerHTML = scale + '%';
        document.getElementById("accessibilityTextScaleInput").value = scale;
    } else {
        document.getElementById("accessibilityTextScalePreview").innerHTML = '100%';
        document.getElementById("accessibilityTextScaleInput").value = '100';
    }
    document.getElementById("accessibilityAnimateAvatar").checked = user?.animate_user_avatar ?? true;
    document.getElementById("accessibilityAnimatePopups").checked = user?.animate_popups ?? true;
    document.getElementById("accessibilityAnimateLoaders").checked = user?.animate_loaders?? true;
    document.getElementById("accessibilityAnimateHover").checked = user?.animate_hover ?? true;
    document.getElementById("accessibilityAnimateOther").checked = user?.animate_other ?? true;
};
function loadPrivacy() {
    function formatPrivacyVis(x) {
        return x.replace('none', 'None').replace('anyone', 'Anyone').replace('friends', 'Friends')
    }
    document.getElementById("privacyMyDisplayNameVis" + formatPrivacyVis(user?.view_my_display_name ?? 'anyone')).checked = true;
    document.getElementById("privacyMyEmailVis" + formatPrivacyVis(user?.view_my_email ?? 'none')).checked = true;
    document.getElementById("privacyMyAvatarVis" + formatPrivacyVis(user?.view_my_avatar ?? 'anyone')).checked = true;
    document.getElementById("privacyMyBadgesVis" + formatPrivacyVis(user?.view_my_badges ?? 'anyone')).checked = true;
    document.getElementById("privacyMyLinksVis" + formatPrivacyVis(user?.view_my_social_links ?? 'anyone')).checked = true;
    document.getElementById("privacyMyPronounsVis" + formatPrivacyVis(user?.view_my_pronouns ?? 'anyone')).checked = true;
    document.getElementById("privacyMyAboutVis" + formatPrivacyVis(user?.view_my_about ?? 'anyone')).checked = true;
    document.getElementById("privacyMyAchievementsVis" + formatPrivacyVis(user?.view_my_achievements ?? 'anyone')).checked = true;
    document.getElementById("privacyMyFriendsVis" + formatPrivacyVis(user?.view_shared_friends ?? 'anyone')).checked = true;
    document.getElementById("privacyMyProjectsVis" + formatPrivacyVis(user?.view_public_projects ?? 'anyone')).checked = true;
    if (user?.isOwner || user?.isStaff || user?.isPartner || user?.isMod || user?.isTester) {
        let col = document.createElement("div");
        col.classList.add("col");
        col.innerHTML = `<h4 class="subtitle">Display Badges</h4>
        ${user?.isTester ? `<div class="toggle-wrapper">
            <label class="toggle"><input type="checkbox" id="privacyBadgesTester" ${user?.display_beta_badge ? 'checked' : ''}></label>
            <label class="toggle-label" for="privacyBadgesTester">Tester Badge</label>
        </div>` : ''}
        ${user?.isMod ? `<div class="toggle-wrapper">
            <label class="toggle"><input type="checkbox" id="privacyBadgesMod" ${user?.display_mod_badge ? 'checked' : ''}></label>
            <label class="toggle-label" for="privacyBadgesMod">Moderator Badge</label>
        </div>` : ''}
        ${user?.isPartner ? `<div class="toggle-wrapper">
            <label class="toggle"><input type="checkbox" id="privacyBadgesPartner" ${user?.display_partner_badge ? 'checked' : ''}></label>
            <label class="toggle-label" for="privacyBadgesPartner">Partner Badge</label>
        </div>` : ''}
        ${user?.isStaff ? `<div class="toggle-wrapper">
            <label class="toggle"><input type="checkbox" id="privacyBadgesStaff" ${user?.display_staff_badge ? 'checked' : ''}></label>
            <label class="toggle-label" for="privacyBadgesStaff">Staff Badge</label>
        </div>` : ''}
        ${user?.isOwner ? `<div class="toggle-wrapper">
            <label class="toggle"><input type="checkbox" id="privacyBadgesOwner" ${user?.display_owner_badge ? 'checked' : ''}></label>
            <label class="toggle-label" for="privacyBadgesOwner">Owner Badge</label>
        </div>` : ''}`;
        document.getElementById("privacyMyProfileVis").appendChild(col);
    }
    document.getElementById("privacyOtherDisplayNameVis").checked = user.view_other_display_name ?? true;
    document.getElementById("privacyOtherAvatarVis").checked = user.view_other_avatar ?? true;
    document.getElementById("privacyOtherLinksVis").checked = user.view_other_social_links ?? true;
    document.getElementById("privacyOtherAboutVis").checked = user.view_other_about ?? true;
    document.getElementById("privacyBlockedProjectsVis").checked = user.blocked_can_see_public_projects ?? false;
    document.getElementById("privacyBlockedProfileVis").checked = user.blocked_can_see_profile ?? false;
};
function loadRelations() {
    document.getElementById("friendRequestsIncomingTable").innerHTML = user?.friends_incoming?.length ? user?.friends_incoming.map(x => `<div class="row | flex gap-100 v-center">
        <img src="${x.avatar ?? 'https://assets.blocklycode.org/avatar.png'}" alt="User's Icon" class="row-icon">
        <div class="row-text">
            <p class="row-title">${x.display_name ?? x.username}</p>
            ${x.display_name ? `<p class="row-subtitle">${x.username}</p>` : ""}
        </div>
        <div class="row-actions | push-right">
            <button class="row-action btn" onclick="acceptFriend('${x.username}', this)">
                <div class="loader"></div>
                <span><i class="bx bx-check" aria-label="Accept Request"></i></span>
            </button>
            <button class="row-action btn" onclick="denyFriend('${x.username}', this)">
                <div class="loader"></div>
                <span><i class="bx bx-x" aria-label="Deny Request"></i></span>
            </button>
            <a class="row-action" href="/u/${x.username}"><i class="bx bxs-user-account" aria-label="View Profile"></i></a>
        </div>
    </div>`).join('') : "";
    document.getElementById("friendRequestsOutgoingTable").innerHTML = user?.friends_outgoing?.length ? user?.friends_outgoing.map(x => `<div class="row | flex gap-100 v-center">
        <img src="${x.avatar ?? 'https://assets.blocklycode.org/avatar.png'}" alt="User's Icon" class="row-icon">
        <div class="row-text">
            <p class="row-title">${x.display_name ?? x.username}</p>
            ${x.display_name ? `<p class="row-subtitle">${x.username}</p>` : ""}
        </div>
        <div class="row-actions | push-right">
            <button class="row-action btn" onclick="denyFriend('${x.username}', this)">
                <div class="loader"></div>
                <span><i class="bx bx-user-x" aria-label="Cancel Request"></i></span>
            </button>
            <a class="row-action" href="/u/${x.username}"><i class="bx bxs-user-account" aria-label="View Profile"></i></a>
        </div>
    </tr>`).join('') : "";
    document.getElementById("friendListTable").innerHTML = user?.friends?.length ? user?.friends.map(x => `<div class="row | flex gap-100 v-center">
        <img src="${x.avatar ?? 'https://assets.blocklycode.org/avatar.png'}" alt="User's Icon" class="row-icon">
        <div class="row-text">
            <p class="row-title">${x.display_name ?? x.username}</p>
            ${x.display_name ? `<p class="row-subtitle">${x.username}</p>` : ""}
        </div>
        <div class="row-actions | push-right">
            <button class="row-action btn" onclick="delFriend('${x.username}', this)">
                <div class="loader"></div>
                <span><i class="bx bx-user-x" aria-label="Remove Friend"></i></span>
            </button>
            <a class="row-action" href="/u/${x.username}"><i class="bx bxs-user-account" aria-label="View Profile"></i></a>
        </div>
    </div>`).join('') : "";
    document.getElementById("blockedListTable").innerHTML = user?.blocked?.length ? user?.blocked.map(x => `<div class="row | flex gap-100 v-center">
        <img src="${x.avatar ?? 'https://assets.blocklycode.org/avatar.png'}" alt="User's Icon" class="row-icon">
        <div class="row-text">
            <p class="row-title">${x.display_name ?? x.username}</p>
            ${x.display_name ? `<p class="row-subtitle">${x.username}</p>` : ""}
        </div>
        <div class="row-actions | push-right">
            <a class="row-action" href="/u/${x.username}"><i class="bx bxs-user-account" aria-label="View Profile"></i></a>
        </div>
    </div>`).join('') : "";
};
async function loadExperiments() {
    let request = await requests.send("experiments/list", {
        type: "account",
        active: true
    });
    if (request.status == 401 || request.status == 403) {
        document.location = "https://auth.blocklycode.org/login";
    } else if (request.status == 200) {
        document.getElementById("experimentsList").innerHTML = request.data.map(x => `<tr>
            <td>${x.title}</td>
            <td>${x.description}</td>
            <td>
                <div class="toggle-wrapper">
                    ${user?.enabled_experiments?.includes(x.id) ? `
                        <label class="toggle"><input type="checkbox" id="experimentsList_${x.id}_Toggle" onclick="disableExperiment('${x.id}')" checked></label>
                        <label class="sr-only" for="experimentList_${x.id}_Toggle">Disable</label>` : `
                        <label class="toggle"><input type="checkbox" id="experimentsList_${x.id}_Toggle" onclick="enableExperiment('${x.id}')"></label>
                        <label class="sr-only" for="experimentList_${x.id}_Toggle">Enable</label>`}
                </div>
            </td>
        </tr>`).join("");
        if (user.enabled_experiments.includes("706496491666227200")) {
            let link = document.createElement("a");
            link.classList.add("sidebar-item");
            link.id = "nav_developers";
            link.href = "#developers";
            link.innerHTML = "Developers";
            document.getElementById("nav_items").appendChild(link);
            let title = document.createElement("h2");
            title.classList.add("section-title");
            title.classList.add("betaFeature");
            title.id = "developers";
            title.innerHTML = "Developers";
            document.getElementsByClassName("content-wrapper")[0].appendChild(title);
            let section = document.createElement("section");
            section.classList.add("section-wrapper");
            section.innerHTML = `<div class="toggle-wrapper">
                <label class="toggle">
                    <input type="checkbox" id="developersDevMode">
                </label>
                <label for="developersDevMode" class="toggle-label">Developer Mode</label>
            </div>
            <div class="save-wrapper | flex v-center gap-100">
                <p class="save-errror" id="developersError"></p>
                <button class="btn textonly push-right" onclick="loadDevelopers(this)">Reset</button>
                <button class="btn clr-success filled darken no-mg" onclick="saveDevelopers(this)">
                    <div class="loader"></div>
                    <span>Save Changes</span>
                </button>
            </div>`;
            document.getElementsByClassName("content-wrapper")[0].appendChild(section);
            loadDevelopers();
        }
    } else {
        console.log(request);
    }
}
function loadDevelopers() {
    document.getElementById("developersDevMode").checked = user?.developer_mode ?? false;
};

function expandAccountSection(field) {
    let el = document.getElementById("accountContent");
    for (let x of el.classList) {
        if (x.startsWith("account-field-")) el.classList.remove(x);
    }
    el.classList.add(`account-field-${field}`);
};
function setPhoneCountry(item) {
    document.getElementById("accountPhoneExpandUpdateCountry").innerHTML = `+ ${item.dataset.code}`;
    document.getElementById("accountPhoneExpandUpdateCountry").dataset.code = item.dataset.code;
    drops.open("accountPhoneExpandUpdateDrop");
};

function editAccountEmail() {
    document.getElementById("accountEmailExpandVerifyInput").value = "";
    document.getElementById("accountEmailExpandUpdateInput").value = "";
    document.getElementById("accountEmailExpandVerify").style.display = "none";
    document.getElementById("accountEmailExpandUpdate").style.display = null;
}
async function resendAccountEmail() {
    try {
        let request = await requests.send("users/email/resend");
        if (request.status == 403 || request.status == 401) {
            document.location = "https://auth.blocklycode.org/login";
        } else if (request?.status == 200) {
            popups.open('s', 'Email resent');
        } else {
            console.log(request);
            popups.open('e', 'Request Failed');
        }
    } catch(e) {
        console.log(e);
        popups.open('e', 'Unexpected error occurred');
    }
};
async function verifyAccountEmail(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("accountEmailVerifyError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        let code = document.getElementById("accountEmailExpandVerifyInput");
        if (user?.isBrandAccount) {
            error.innerHTML = "Can't edit Brand Accounts";
        } else  if (!code.value) {
            code.classList.add("invalid");
        } else {
            let request = await requests.send('users/email/verify', {
                code: code.value,
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Invalid Code";
                code.classList.add("invalid");
            } else if (request?.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                user = request.data;
                document.getElementById("accountEmailPreview").innerHTML = user.email;
                document.getElementById("accountEmailExpandVerify").style.display = "none";
                document.getElementById("accountEmailExpandUpdate").style.display = null;
                document.getElementById("accountEmailExpandVerifyInput").value = "";
                document.getElementById("accountEmailExpandUpdateInput").value = "";
                document.getElementById("accountContent").classList.remove("account-field-email");
                
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};

function editAccountPhone() {
    document.getElementById("accountPhoneExpandVerifyInput").value = "";
    document.getElementById("accountPhoneExpandUpdateInput").value = "";
    document.getElementById("accountPhoneExpandVerify").style.display = "none";
    document.getElementById("accountPhoneExpandUpdate").style.display = null;
}
async function resendAccountPhone() {
    try {
        let request = await requests.send("users/phone/resend");
        if (request.status == 403 || request.status == 401) {
            document.location = "https://auth.blocklycode.org/login";
        } else if (request?.status == 200) {
            popups.open('s', 'Text resent');
        } else {
            console.log(request);
            popups.open('e', 'Request Failed');
        }
    } catch(e) {
        console.log(e);
        popups.open('e', 'Unexpected error occurred');
    }
};
async function verifyAccountPhone(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("accountPhoneVerifyError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        let code = document.getElementById("accountPhoneExpandVerifyInput");
        if (user?.isBrandAccount) {
            error.innerHTML = "Can't edit Brand Accounts";
        } else  if (!code.value) {
            code.classList.add("invalid");
        } else {
            let request = await requests.send('users/phone/verify', {
                code: code.value,
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Invalid Code";
                code.classList.add("invalid");
            } else if (request?.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                user = request.data;
                document.getElementById("accountPhonePreview").innerHTML = user.phone;
                document.getElementById("accountPhoneExpandVerify").style.display = "none";
                document.getElementById("accountPhoneExpandUpdate").style.display = null;
                document.getElementById("accountPhoneExpandVerifyInput").value = "";
                document.getElementById("accountPhoneExpandUpdateInput").value = "";
                document.getElementById("accountContent").classList.remove("account-field-phone");
                
                document.getElementById("securityMfaSmsEnabled").parentElement.style.display = null;
                document.getElementById("securityMfaSmsEnabled").disabled = false;
                document.getElementById("securityMfaSmsEnabled").parentElement.nextElementSibling.classList.remove("push-right");
                document.getElementById("securityMfaSmsNoPhone").style.display = "none";
                document.getElementById("securityMfaSmsPhone").style.display = null;
                document.getElementById("securityMfaSmsPhonePreview").innerHTML = `${user?.phone.substring(0, 3)} ${user?.phone.substring(3, 6)} ${user?.phone.substring(6, 10)} ${user?.phone.substring(10)}`;
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};


async function securityVerifyIdentity(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("securityVerifyError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        let password = document.getElementById("securityVerifyInput");
        if (!password.value) {
            password.classList.add("invalid");
        } else {
            let request = await requests.send('users/identity/verify', {
                password: password.value,
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Invalid Password";
                code.classList.add("invalid");
            } else if (request?.status == 200) {
                error.innerHTML = "Verified";
                error.style.color = "var(--bc-clr-success-400)";
                security_password = password.value;
                document.getElementById("securityVerify").style.display = "none";
                document.getElementById("securityContent").style.display = "block";
                loadSecurity();
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};
function securityMfaExpand(item) {
    if (item.getAttribute("aria-expanded") == "true") {
        item.parentElement.nextElementSibling.style.height = null;
        item.setAttribute("aria-expanded", "false");
    } else {
        item.parentElement.nextElementSibling.style.height = item.parentElement.nextElementSibling.scrollHeight + "px";
        item.setAttribute("aria-expanded", "true");
    }
};

async function securityMfaAppToggle(toggle) {
    try {
        if (toggle.checked) {
            let request = await requests.send("users/mfa/app/enable", {
                password: security_password
            });
            if (request.status == 401 || request.data == "Invalid Token") {
                document.location = "https://auth.blocklycode.org/login";
            } else if (request.status == 403) {
                security_password = null;
                document.getElementById("securityContent").style.display = "none";
                document.getElementById("securityVerify").style.display = "block";
                let error = document.getElementById("securityVerifyError");
                error.innerHTML = "";
                error.style.color = null;
            } else if (request.status == 200) {
                document.getElementById("enableMfaAppQr").src = `https://chart.googleapis.com/chart?chs=166x166&chld=L%7C0&cht=qr&chl=${request.data.mfa_app_url}`;
                modals.open("enableMfaAppModal");
            } else {
                console.log(request);
                popups.open("e", "Request failed");
                toggle.checked = !toggle.checked;
            }
        } else {
            modals.open("disableMfaAppModal");
        }
    } catch(e) {
        toggle.checked = !toggle.checked;
        console.log(e);
        popups.open("e", "Unexpected error occurred");
    }
};
async function securityMfaAppConfirm(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add("loading");
    let error = document.getElementById("enableMfaAppError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        let code = document.getElementById("enableMfaAppCode");
        if (!code.value) {
            code.classList.add("invalid");
        } else {
            let request = await requests.send("users/mfa/app/confirm", {
                password: security_password,
                code: code.value
            });
            if (request.status == 401 || request.data == "Invalid Token") {
                document.location = "https://auth.blocklycode.org/login";
            } else if (request.data == "Invalid Password") {
                security_password = null;
                document.getElementById("securityContent").style.display = "none";
                document.getElementById("securityVerify").style.display = "block";
                let error = document.getElementById("securityVerifyError");
                error.innerHTML = "";
                error.style.color = null;
                modals.close("enableMfaAppModal");
            } else if (request.data == "Invalid OTC") {
                error.innerHTML = "Invalid Code";
                code.classList.add("invalid");
            } else if (request.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                modals.close("enableMfaAppModal");
                popups.open("s", "App-Based 2FA enabled");
                document.getElementById("securityMfaAppAdditional").disabled = false;
                if (request.data.mfa_backup_codes?.length) {
                    document.getElementById("securityMfaBackupActions").style.display = null;
                    document.getElementById("securityMfaBackupDisabled").style.display = "none";
                    document.getElementById("securityMfaBackupCodes").innerHTML = request.data.mfa_backup_codes.map(x => `${x.used ? "<s>" : ""}<code>${x.code}</code>${x.used ? "</s>" : ""}`).join("");
                }
                user = request.data;
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch(e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove("loading");
};
async function securityMfaAppCancel() {
    document.getElementById("securityMfaAppEnabled").checked = user?.mfa_app_enabled;
    modals.close("enableMfaAppModal");
    modals.close("disableMfaAppModal");
};
async function securityMfaAppDisable(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add("loading");
    let error = document.getElementById("disableMfaAppError");
    error.style.color = null;
    error.innerHTML = "";
    try {
        let request = await requests.send("users/mfa/app/disable", {
            password: security_password
        });
        if (request.status == 401 || request.data == "Invalid Token") {
            document.location = "https://auth.blocklycode.org/login";
        } else if (request.status == 403) {
            security_password = null;
            document.getElementById("securityContent").style.display = "none";
            document.getElementById("securityVerify").style.display = "block";
            let error = document.getElementById("securityVerifyError");
            error.innerHTML = "";
            error.style.color = null;
        } else if (request.status == 200) {
            error.style.color = "var(--bc-clr-success-400)";
            error.innerHTML = "App-Based 2FA Disabled";
            modals.close("disableMfaAppModal");
            user = request.data;
        } else {
            error.innerHTML = "Request Failed";
            console.log(request);
        }
    } catch(e) {
        error.style.color = null;
        error.innerHTML = "Unexpected Error Occurred";
        console.log(e);
    }
    btn.classList.remove("loading");
};
async function securityMfaAppAdd(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add("loading");
    try {
        let request = await requests.send("users/mfa/app/addextra", {
            password: security_password
        });
        if (request.status == 401 || request.data == "Invalid Token") {
            document.location = "https://auth.blocklycode.org/login";
        } else if (request.status == 403) {
            security_password = null;
            document.getElementById("securityContent").style.display = "none";
            document.getElementById("securityVerify").style.display = "block";
            let error = document.getElementById("securityVerifyError");
            error.innerHTML = "";
            error.style.color = null;
        } else if (request.status == 406) {
            popups.open("e", "App-Based 2FA is disabled");
        } else if (request.status == 200) {
            document.getElementById("extraMfaAppQr").src = `https://chart.googleapis.com/chart?chs=166x166&chld=L%7C0&cht=qr&chl=${request.data.mfa_app_url}`;
            modals.open("extraMfaAppModal");
        } else {
            console.log(request);
            popups.open("e", "Request failed");
        }
    } catch(e) {
        console.log(e);
        popups.open("e", "Unexpected error occurred");
    }
    btn.classList.remove("loading");
};

async function securityMfaSmsToggle(toggle) {
    try {
        let request = await requests.send(`users/mfa/sms/${toggle.checked ? "enable" : "disable"}`, {
            password: security_password
        });
        if (request.status == 401 || request.data == "Invalid Token") {
            document.location = "https://auth.blocklycode.org/login";
        } else if (request.status == 403) {
            security_password = null;
            document.getElementById("securityContent").style.display = "none";
            document.getElementById("securityVerify").style.display = "block";
            let error = document.getElementById("securityVerifyError");
            error.innerHTML = "";
            error.style.color = null;
        } else if (request.status == 200) {
            user = request.data;
            if (toggle.checked) {
                popups.open("s", "SMS-Based 2FA enabled");
            } else {
                popups.open("s", "SMS-Based 2FA disabled");
            }
        } else {
            console.log(request);
            popups.open("e", "Request failed");
            toggle.checked = !toggle.checked;
        }
    } catch(e) {
        toggle.checked = !toggle.checked;
        console.log(e);
        popups.open("e", "Unexpected error occurred");
    }
};

async function securityMfaBackupReset(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add("loading");
    try {
        let request = await requests.send("users/mfa/backupcodes/generate", {
            password: security_password
        });
        if (request.status == 401 || request.data == "Invalid Token") {
            document.location = "https://auth.blocklycode.org/login";
        } else if (request.status == 403) {
            security_password = null;
            document.getElementById("securityContent").style.display = "none";
            document.getElementById("securityVerify").style.display = "block";
            let error = document.getElementById("securityVerifyError");
            error.innerHTML = "";
            error.style.color = null;
        } else if (request.status == 406) {
            popups.open("e", "2FA is disabled");
        } else if (request.status == 200) {
            document.getElementById("securityMfaBackupCodes").innerHTML = request.data.mfa_backup_codes.map(x => `${x.used ? "<s>" : ""}<code>${x.code}</code>${x.used ? "</s>" : ""}`).join("");
            user = request.data;
        } else {
            console.log(request);
            popups.open("e", "Request failed");
        }
    } catch(e) {
        console.log(e);
        popups.open("e", "Unexpected error occurred");
    }
    btn.classList.remove("loading");
};

function previewPasswordSecurity(input) {
    let valid_parts = 0;
    if (input.value.length > 6) valid_parts++;
    if (input.value.match(/[a-z]/g)) valid_parts++;
    if (input.value.match(/[A-Z]/g)) valid_parts++;
    if (input.value.match(/[0-9]/g)) valid_parts++;
    if (input.value.match(/\W|_/g)) valid_parts++;
    let items = document.getElementById("securityPasswordNewStrength").children;
    for (let x of items) x.classList.remove("visible");
    for (let i = 0; i < valid_parts; i++) {
        if (!items[i]) break;
        items[i].classList.add("visible");
    }
    inputs.validate(input);
};

function previewThemeWebsite(theme) {
    for (let x of Array.from(document.body.classList)) {
        if (x.startsWith("theme-")) document.body.classList.remove(x);
    }   
    document.body.classList.add("theme-" + theme);
};
function previewThemeAccent(hue) {
    if (hue != 'none') {
        document.body.style.setProperty("--bc-clr-theme-hue", hue);
        document.body.style.setProperty("--bc-clr-theme-sat", "50%");
    } else {
        document.body.style.removeProperty("--bc-clr-theme-hue");
        document.body.style.removeProperty("--bc-clr-theme-sat");
    }
};
function previewTextScale(size) {
    document.getElementById("accessibilityTextScalePreview").innerHTML = `${size < 100 ? "0": ""}${size}%`;
    document.getElementById("accessibilityTextScaleInput").value = size;
};


async function saveAccountEmail(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("accountEmailUpdateError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        let email = document.getElementById("accountEmailExpandUpdateInput");
        if (user?.isBrandAccount) {
            error.innerHTML = "Can't edit Brand Accounts";
        } else  if (!email.value) {
            email.classList.add("invalid");
        } else {
            let request = await requests.send('users/email/update', {
                email: email?.value,
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Missing Permissions";
            } else if (request?.status == 422) {
                error.innerHTML = request.data;
            } else if (request?.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                user = request.data;
                document.getElementById("accountEmailExpandUpdate").style.display = "none";
                document.getElementById("accountEmailExpandVerifyPreview").innerHTML = email.value;
                document.getElementById("accountEmailExpandVerify").style.display = null;
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};
async function saveAccountPhone(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("accountPhoneUpdateError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        let phone = document.getElementById("accountPhoneExpandUpdateInput");
        let code = document.getElementById("accountPhoneExpandUpdateCountry").dataset.code;
        if (user?.isBrandAccount) {
            error.innerHTML = "Can't edit Brand Accounts";
        } else  if (!phone.value) {
            phone.classList.add("invalid");
        } else {
            let request = await requests.send('users/phone/update', {
                phone: `+${code}${phone.value}`,
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Missing Permissions";
            } else if (request?.status == 422) {
                error.innerHTML = request.data;
            } else if (request?.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                user = request.data;
                document.getElementById("accountPhoneExpandUpdate").style.display = "none";
                document.getElementById("accountPhoneExpandVerifyPreview").innerHTML = `+${code} ${phone.value.substring(0, 3)} ${phone.value.substring(3, 7)} ${phone.value.substring(7)}`;
                document.getElementById("accountPhoneExpandVerify").style.display = null;
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};
async function saveNotifications(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("notificationsError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        if (user?.isBrandAccount) {
            error.innerHTML = "Can't edit Brand Accounts";
        } else {
            let request = await requests.send('users/update', {
                email_update_profile: document.getElementById("notificationsAccountProfileUpdateEmail").checked ?? true,
                email_update_account: document.getElementById("notificationsAccountAccountUpdateEmail").checked ?? true,
                email_account_login: document.getElementById("notificationsAccountLoginEmail").checked ?? true,
                email_application_status: document.getElementById("notificationsAccountApplicationUpdateEmail").checked ?? true,
                email_friend_req_receive: document.getElementById("notificationsFriendsIncomingRequestEmail").checked ?? true,
                email_friend_req_accepted: document.getElementById("notificationsFriendsAcceptedRequestEmail").checked ?? true,
                email_friend_req_denied: document.getElementById("notificationsFriendsDeniedRequestEmail").checked ?? true,
                email_feedback_comments: document.getElementById("notificationsFeedbackCommentsEmail").checked ?? true,
                email_feedback_upvotes: document.getElementById("notificationsFeedbackUpvotesEmail").checked ?? true,
                email_feedback_downvotes: document.getElementById("notificationsFeedbackDownvotesEmail").checked ?? true,
                email_project_shared: document.getElementById("notificationsProjectsSharedEmail").checked ?? true,
                email_project_activity: document.getElementById("notificationsProjectsActivityEmail").checked ?? true,
                email_template_reviewed: document.getElementById("notificationsTemplatesReviewsEmail").checked ?? true,
                email_template_issues: document.getElementById("notificationsTemplatesIssuesEmail").checked ?? true,
                email_developer_team_invites: document.getElementById("notificationsDevelopersTeamsInviteEmail").checked ?? true,
                email_developer_team_updates: document.getElementById("notificationsDevelopersTeamsUpdateEmail").checked ?? true,
                email_developer_team_owner: document.getElementById("notificationsDevelopersTeamsOwnerEmail").checked ?? true,
                email_developer_blocklet_invites: document.getElementById("notificationsDevelopersBlockletsInviteEmail").checked ?? true,
                email_developer_blocklet_updates: document.getElementById("notificationsDevelopersBlockletsUpdateEmail").checked ?? true,
                email_newsletter: document.getElementById("notificationsOtherNewsletterEmail").checked ?? true,
                email_update_blockly: document.getElementById("notificationsOtherBlocklyUpdateEmail").checked ?? true,
                email_inactive: document.getElementById("notificationsOtherInactiveEmail").checked ?? true,

                notifications_update_profile: document.getElementById("notificationsAccountProfileUpdateInApp").checked ?? true,
                notifications_update_account: document.getElementById("notificationsAccountAccountUpdateInApp").checked ?? true,
                notifications_account_login: document.getElementById("notificationsAccountLoginInApp").checked ?? true,
                notifications_application_status: document.getElementById("notificationsAccountApplicationUpdateInApp").checked ?? true,
                notifications_friend_req_receive: document.getElementById("notificationsFriendsIncomingRequestInApp").checked ?? true,
                notifications_friend_req_accepted: document.getElementById("notificationsFriendsAcceptedRequestInApp").checked ?? true,
                notifications_friend_req_denied: document.getElementById("notificationsFriendsDeniedRequestInApp").checked ?? true,
                notifications_feedback_comments: document.getElementById("notificationsFeedbackCommentsInApp").checked ?? true,
                notifications_feedback_upvotes: document.getElementById("notificationsFeedbackUpvotesInApp").checked ?? true,
                notifications_feedback_downvotes: document.getElementById("notificationsFeedbackDownvotesInApp").checked ?? true,
                notifications_project_shared: document.getElementById("notificationsProjectsSharedInApp").checked ?? true,
                notifications_project_activity: document.getElementById("notificationsProjectsActivityInApp").checked ?? true,
                notifications_template_reviewed: document.getElementById("notificationsTemplatesReviewsInApp").checked ?? true,
                notifications_template_issues: document.getElementById("notificationsTemplatesIssuesInApp").checked ?? true,
                notifications_developer_team_invites: document.getElementById("notificationsDevelopersTeamsInviteInApp").checked ?? true,
                notifications_developer_team_updates: document.getElementById("notificationsDevelopersTeamsUpdateInApp").checked ?? true,
                notifications_developer_team_owner: document.getElementById("notificationsDevelopersTeamsOwnerInApp").checked ?? true,
                notifications_developer_blocklet_invites: document.getElementById("notificationsDevelopersBlockletsInviteInApp").checked ?? true,
                notifications_developer_blocklet_updates: document.getElementById("notificationsDevelopersBlockletsUpdateInApp").checked ?? true,
                notifications_update_blockly: document.getElementById("notificationsOtherBlocklyUpdateInApp").checked ?? true,
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Missing Permissions";
            } else if (request?.status == 422) {
                error.innerHTML = request.data;
            } else if (request?.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                user = request.data;
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};
async function saveSecurityPassword(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add("loading");
    let error = document.getElementById("securityPasswordError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        let password = document.getElementById("securityPasswordNewInput");
        let confirm = document.getElementById("securityPasswordConfirmInput");
        if (user?.isBrandAccount) {
            error.innerHTML = "Can't edit Brand Accounts";
        } else if (!password.value) {
            password.classList.add("invalid");
        } else if (!document.getElementById("securityPasswordNewStrength")?.lastElementChild?.classList?.contains("visible")) {
            password.classList.add("invalid");
            error.innerHTML = "Strong Password Required";
        } else if (confirm?.value != password?.value) { 
            confirm.classList.add("invalid");
            error.innerHTML = "Password's don't match";
        } else {
            let request = await requests.send('users/password/update', {
                password: security_password,
                new_password: password.value
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Missing Permissions";
            } else if (request?.status == 422) {
                error.innerHTML = request.data;
            } else if (request?.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                user = request.data;
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove("loading");
}
async function saveAppearance(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("appearanceError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        if (user?.isBrandAccount) {
            error.innerHTML = "Can't edit Brand Accounts";
        } else {
            let request = await requests.send('users/update', {
                website_theme: document.querySelector("input[name='appearanceThemeWebsite']:checked").value,
                lab_theme: document.querySelector("input[name='appearanceThemeLab']:checked").value,
                accent_theme: document.querySelector("input[name='appearanceThemeAccent']:checked").value,
                lab_controls: document.querySelector("input[name='appearanceControlsLab']:checked").value,
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Missing Permissions";
            } else if (request?.status == 422) {
                error.innerHTML = request.data;
            } else if (request?.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                user = request.data;
                document.cookie = `website_theme=${user?.website_theme}; expires=${new Date(new Date().setYear(20000))}; domain=.blocklycode.org; sameSite=Lax; path=/;`;
                document.cookie = `accent_theme=${user?.accent_theme ?? null}; expires=${new Date(new Date().setYear(20000))}; domain=.blocklycode.org; sameSite=Lax; path=/;`;
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};
async function saveAccessibility(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("accessibilityError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        if (user?.isBrandAccount) {
            error.innerHTML = "Can't edit Brand Accounts";
        } else {
            let text_scale = document.getElementById("accessibilityTextScaleInput").value - 37.5;
            let request = await requests.send('users/update', {
                text_scale: text_scale / 62.5,
                animate_user_avatar: document.getElementById("accessibilityAnimateAvatar").checked ?? true,
                animate_loaders: document.getElementById("accessibilityAnimateLoaders").checked ?? true,
                animate_popups: document.getElementById("accessibilityAnimatePopups").checked ?? true,
                animate_hover: document.getElementById("accessibilityAnimateHover").checked ?? true,
                animate_other: document.getElementById("accessibilityAnimateOther").checked ?? true,
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Missing Permissions";
            } else if (request?.status == 422) {
                error.innerHTML = request.data;
            } else if (request?.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                user = request.data;
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};
async function savePrivacy(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("privacyError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        if (user?.isBrandAccount) {
            error.innerHTML = "Can't edit Brand Accounts";
        } else {
            let request = await requests.send('users/update', {
                view_email: document.querySelector("input[name=privacyMyEmailVis]:checked")?.id?.split('Vis')[1]?.toLowerCase() ?? null,
                view_display_name: document.querySelector("input[name=privacyMyDisplayNameVis]:checked").id.split('Vis')[1].toLowerCase(),
                view_avatar: document.querySelector("input[name=privacyMyAvatarVis]:checked")?.id?.split('Vis')[1]?.toLowerCase() ?? null,
                view_pronouns: document.querySelector("input[name=privacyMyPronounsVis]:checked")?.id?.split('Vis')[1]?.toLowerCase() ?? null,
                view_social_links: document.querySelector("input[name=privacyMyLinksVis]:checked")?.id?.split('Vis')[1]?.toLowerCase() ?? null,
                view_about: document.querySelector("input[name=privacyMyAboutVis]:checked")?.id?.split('Vis')[1]?.toLowerCase() ?? null,
                view_badges: document.querySelector("input[name=privacyMyBadgesVis]:checked")?.id?.split('Vis')[1]?.toLowerCase() ?? null,
                view_achievements: document.querySelector("input[name=privacyMyAchievementsVis]:checked")?.id?.split('Vis')[1]?.toLowerCase() ?? null,
                view_friends: document.querySelector("input[name=privacyMyFriendsVis]:checked")?.id?.split('Vis')[1]?.toLowerCase() ?? null,
                view_projects: document.querySelector("input[name=privacyMyProjectsVis]:checked")?.id?.split('Vis')[1]?.toLowerCase() ?? null,
                view_other_display_name: document.getElementById("privacyOtherDisplayNameVis").checked ?? null,
                view_other_avatar: document.getElementById("privacyOtherAvatarVis").checked ?? null,
                view_other_about: document.getElementById("privacyOtherAboutVis").checked ?? null,
                view_other_social_links: document.getElementById("privacyOtherLinksVis").checked ?? null,
                blocked_can_see_public_projects: document.getElementById("privacyBlockedProjectsVis").checked ?? null,
                blocked_can_see_profile: document.getElementById("privacyBlockedProfileVis").checked ?? null,
                display_owner_badge: user.isOwner ? document.getElementById("privacyBadgesOwner").checked : null,
                display_staff_badge: user.isStaff ? document.getElementById("privacyBadgesStaff").checked : null,
                display_partner_badge: user.isPartner ? document.getElementById("privacyBadgesPartner").checked : null,
                display_mod_badge: user.isMod ? document.getElementById("privacyBadgesMod").checked : null,
                display_beta_badge: user.isTester ? document.getElementById("privacyBadgesTester").checked : null,
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Missing Permissions";
            } else if (request?.status == 422) {
                error.innerHTML = request.data;
            } else if (request?.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                user = request.data;
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};
async function saveDevelopers(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("developersError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        if (user?.isBrandAccount) {
            error.innerHTML = "Can't edit Brand Accounts";
        } else {
            let request = await requests.send('users/update', {
                developer_mode: document.getElementById("developersDevMode").checked ?? null,
            });
            if (request?.status == 401 || request?.data == "Invalid Token") {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 403) {
                error.innerHTML = "Missing Permissions";
            } else if (request?.status == 422) {
                error.innerHTML = request.data;
            } else if (request?.status == 200) {
                error.innerHTML = "Changes Saved";
                error.style.color = "var(--bc-clr-success-400)";
                user = request.data;
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};

async function enableExperiment(id) {
    try {
        let request = await requests.send("users/experiments/create", {
            id: id,
        });
        if (request.status == 401 || request.status == 403) {
            document.location = "https://auth.blocklycode.org/login";
        } else if (request.status == 200) {
            popups.open("s", "Experiment Enabled");
            user.enabled_experiments = request.data.enabled_experiments;
            await loadExperiments();
        } else {
            console.log(request);
            popups.open("e", "Request failed");
        };
    } catch(e) {
        console.log(e);
        popups.open("e", "Unexpected error occurred");
    };
};
async function disableExperiment(id) {
    try {
        let request = await requests.send("users/experiments/destroy", {
            id: id,
        });
        if (request.status == 401 || request.status == 403) {
            document.location = "https://auth.blocklycode.org/login";
        } else if (request.status == 200) {
            popups.open("s", "Experiment Disabled");
            user.enabled_experiments = request.data.enabled_experiments;
            await loadExperiments();
        } else {
            console.log(request);
            popups.open("e", "Request failed");
        };
    } catch(e) {
        console.log(e);
        popups.open("e", "Unexpected error occurred");
    };
};


async function unblockUser(username, btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    try {
        let request = await requests.send('users/blocked/destroy', {username});
        if (request?.status == 401) {
            document.location = 'https://auth.blocklycode.org/login';
        } else if (request?.status == 403) {
            popups.open('e', 'Missing Permissions');
        } else if (request?.status == 200) {
            user = request.data;
            return loadRelations();
        } else {
            console.log(request);
            popups.open('e', 'Request failed');
        }
    } catch (e) {
        console.log(e);
        popups.open('e', 'Unexpected error occurred');
    }
  btn.classList.remove('loading');
}
async function acceptFriend(username, btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    try {
        let request = await requests.send('users/friends/create', {username});
        if (request?.status == 401 || request?.data == "Invalid Token") {
            document.location = 'https://auth.blocklycode.org/login';
        } else if (request?.status == 403) {
            popups.open('e', 'Missing Permissions');
        } else if (request?.status == 200) {
            user = request.data;
            return loadRelations();
        } else {
            console.log(request);
            popups.open('e', 'Request failed');
        }
    } catch (e) {
        console.log(e);
        popups.open('e', 'Unexpected error occurred');
    }
    btn.classList.remove('loading');
};
async function denyFriend(username, btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    try {
        let request = await requests.send('users/friends/requests/destroy', {username});
        if (request?.status == 401 || request?.data == "Invalid Token") {
            document.location = 'https://auth.blocklycode.org/login';
        } else if (request?.status == 403) {
            popups.open('e', 'Missing Permissions');
        } else if (request?.status == 200) {
            user = request.data;
            return loadRelations();
        } else {
            console.log(request);
            popups.open('e', 'Request failed');
        }
    } catch (e) {
        console.log(e);
        popups.open('e', 'Unexpected error occurred');
    }
    btn.classList.remove('loading');
};
async function delFriend(username, btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    try {
        let request = await requests.send('users/friends/destroy', {username});
        if (request?.status == 401 || request?.data == "Invalid Token") {
            document.location = 'https://auth.blocklycode.org/login';
        } else if (request?.status == 403) {
            popups.open('e', 'Missing Permissions');
        } else if (request?.status == 200) {
            user = request.data;
            return loadRelations();
        } else {
            console.log(request);
            popups.open('e', 'Request failed');
        }
    } catch (e) {
        console.log(e);
        popups.open('e', 'Unexpected error occurred');
    }
    btn.classList.remove('loading');
};

function deleteAccountValidate(input, toggle) {
    if (toggle.checked && input.value == user.username) {
        document.getElementById("deleteAccountButton").disabled = false;
    } else {
        document.getElementById("deleteAccountButton").disabled = true;
    }
}
async function deleteAccount(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("deleteAccountError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        let username = document.getElementById("deleteAccountUsername");
        let toggle = document.getElementById("deleteAccountConfirm");

        if (username.value != user.username) {
            username.classList.add('invalid');
        } else if (!toggle.checked) {
            toggle.parentElement.classList.add('invalid');
        } else if (user.isOwner || user.isBrandAccount) {
            error.innerHTML = "Missing Permissions";
        } else {
            let request = await requests.send('users/destroy');
            if (request?.status == 401 || request?.status == 403) {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 422) {
                error.innerHTML = "Missing Permissions";
            } else if (request?.status == 200) {
                error.innerHTML = "Account Deleted";
                error.style.color = "var(--bc-clr-success-400)";
                await accounts.logout();
                document.location = "/";
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};
function disableAccountValidate(input) {
    if (input.value == user.username) {
        document.getElementById("disableAccountButton").disabled = false;
    } else {
        document.getElementById("disableAccountButton").disabled = true;
    }
}
async function disableAccount(btn) {
    if (btn.classList.contains("loading")) return;
    btn.classList.add('loading');
    let error = document.getElementById("disableAccountError");
    error.innerHTML = "";
    error.style.color = null;
    try {
        let username = document.getElementById("disableAccountUsername");

        if (username.value != user.username) {
            username.classList.add('invalid');
        } else if (user.isOwner || user.isBrandAccount) {
            error.innerHTML = "Missing Permissions";
        } else {
            let request = await requests.send("users/disable");
            if (request?.status == 401 || request?.status == 403) {
                document.location = 'https://auth.blocklycode.org/login';
            } else if (request?.status == 422) {
                error.innerHTML = "Missing Permissions";
            } else if (request?.status == 200) {
                error.innerHTML = "Account Disabled";
                error.style.color = "var(--bc-clr-success-400)";
                document.cookie = `token_${accounts.tokens.findIndex(x => x == accounts?.users?.active?.token)}_disabled=true; expires=${new Date(new Date().setYear(20000))}; domain=.blocklycode.org; sameSite=Lax; path=/;`;
                document.cookie = `token_active_disabled=true; expires=${new Date(new Date().setYear(20000))}; domain=.blocklycode.org; sameSite=Lax; path=/;`;
                document.location = "https://auth.blocklycode.org/enable";
            } else {
                error.innerHTML = "Request Failed";
                console.log(request);
            }
        }
    } catch (e) {
        error.innerHTML = "Unexpected Error Occurred";
        error.style.color = null;
        console.log(e);
    }
    btn.classList.remove('loading');
};