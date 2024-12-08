import axios from "axios";

const URL = "http://localhost:8000/api";

class AuthService {
    login(username: string, password: string) {
        return axios
            .post(`${URL}/login/`, {
                username: username,
                password: password,
            })
            .then((response) => {
                if (response.status != 200) return false;

                localStorage.setItem("username", username);
                localStorage.setItem("password", password);
                return true;
            });
    }

    updateUserScore(score: number) {
        return axios
            .post(`${URL}/score/update_score/`, {
                score: score,
            })
            .then((response) => {
                return response.status == 200;
            });
    }

    getUserScore() {
        return axios
            .get(`${URL}/score/get_score/`, {
                params: {
                    username: localStorage.getItem("username"),
                },
            })
            .then((response) => {
                if (response.status != 200) return -1;
                return response.data["score"];
            });
    }

    getUsersScores() {
        return axios.get(`${URL}/score/get_users_scores/`);
    }
}

export default new AuthService();
