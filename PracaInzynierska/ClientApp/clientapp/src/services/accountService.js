class AccountService {
    parseJwt() {
        try {
            let accessToken = localStorage.getItem("accessToken");
            const base64Url = accessToken.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const payLoad = JSON.parse(window.atob(base64));
            return payLoad;
        } catch (err) {
            return false;
        }
    }

    isAuthenticated() {
        if(localStorage.getItem("accessToken") !== null) {
            return true;
        } else {
            return false;
        }
    }

    logOut() {
        localStorage.removeItem("accessToken");
    }

    logIn(token) {
        localStorage.setItem("accessToken", token);
    }

    isInRole(role) {
        let payLoad = this.parseJwt();
        if(payLoad.role === role) {
            return true;
        } else {
            return false;
        }
    }

    getUserName() {
        if(this.isAuthenticated) {
            let payLoad = this.parseJwt();
            return payLoad.sub;
        } else {
            return null;
        }
    }
}

export default new AccountService();

